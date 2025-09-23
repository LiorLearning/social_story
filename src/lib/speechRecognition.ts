interface SpeechRecognitionOptions {
  onResult: (result: { transcript: string; confidence: number }) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
  onInterimResult?: (transcript: string) => void;
  continuous?: boolean;
  language?: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

class SpeechRecognitionService {
  private recognition: any = null;
  private isSupported = false;
  private isActive = false;
  private isRunning = false;
  private startTimeout: NodeJS.Timeout | null = null;
  private currentOptions: SpeechRecognitionOptions | null = null;
  private restartTimeout: NodeJS.Timeout | null = null;
  private lastSpeechTime: number = 0;
  private silenceThreshold: number = 3000; // 3 seconds of silence before considering restart
  private maxSessionDuration: number = 25000; // 25 seconds max session before restart
  private sessionStartTime: number = 0;
  private silenceCheckInterval: NodeJS.Timeout | null = null;
  private hasReceivedSpeech: boolean = false;

  constructor() {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
    }
  }

  isAvailable(): boolean {
    return this.isSupported;
  }

  private setupOnEndHandler(options: SpeechRecognitionOptions): void {
    this.recognition.onend = () => {
      console.log('Speech recognition ended, isActive:', this.isActive);
      this.isRunning = false;
      
      // If still active, automatically restart to maintain continuous listening
      if (this.isActive) {
        console.log('Auto-restarting speech recognition to maintain continuous listening');
        this.restartTimeout = setTimeout(() => {
          if (this.isActive && !this.isRunning) {
            this.startRecognition();
          }
        }, 100); // Short delay to prevent rapid restarts
      } else {
        // Only call onEnd if we're actually stopping (not restarting)
        options.onEnd();
      }
    };
  }

  start(options: SpeechRecognitionOptions): void {
    if (!this.isSupported || !this.recognition) {
      options.onError('Speech recognition not supported');
      return;
    }

    this.isActive = true;
    this.currentOptions = options;
    this.sessionStartTime = Date.now();
    this.lastSpeechTime = Date.now();

    this.startRecognition();
  }

  private startRecognition(): void {
    if (!this.currentOptions || !this.recognition) return;

    // Configure recognition
    this.recognition.continuous = true; // Keep listening until manually stopped
    this.recognition.interimResults = true;
    this.recognition.lang = this.currentOptions.language || 'en-US';

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isRunning = true;
      this.sessionStartTime = Date.now();
      this.hasReceivedSpeech = false;
      this.startSilenceDetection();
      this.currentOptions?.onStart();
    };

    this.recognition.onresult = (event: any) => {
      this.lastSpeechTime = Date.now(); // Update last speech time
      this.hasReceivedSpeech = true; // Mark that we've received speech
      let finalTranscript = '';
      let interimTranscript = '';
      let confidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          confidence = result[0].confidence;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Send interim results for live transcription
      if (interimTranscript && this.currentOptions?.onInterimResult) {
        this.currentOptions.onInterimResult(interimTranscript.trim());
      }

      // Send final results
      if (finalTranscript && this.currentOptions) {
        this.currentOptions.onResult({
          transcript: finalTranscript.trim(),
          confidence: confidence
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific errors that might require restart
      const recoverableErrors = [
        'network',           // Network connectivity issues
        'audio-capture',     // Temporary audio capture problems
        'aborted',          // Recognition was aborted (often by browser)
        'no-speech',        // No speech detected (not really an error)
        'service-not-allowed' // Temporary service issues
      ];

      const permanentErrors = [
        'not-allowed',      // User denied microphone permission
        'language-not-supported', // Language not supported
        'bad-grammar'       // Grammar issues (shouldn't happen with our setup)
      ];

      if (recoverableErrors.includes(event.error)) {
        console.log(`Recoverable error (${event.error}), will attempt restart`);
        // Don't call onError for recoverable errors, just restart
        if (this.isActive) {
          // Use exponential backoff for retries
          const retryDelay = event.error === 'network' ? 2000 : 1000;
          this.restartTimeout = setTimeout(() => {
            if (this.isActive && !this.isRunning) {
              console.log(`Restarting after ${event.error} error`);
              this.startRecognition();
            }
          }, retryDelay);
        }
      } else if (permanentErrors.includes(event.error)) {
        // For permanent errors, stop and notify the user
        console.error(`Permanent error (${event.error}), stopping recognition`);
        this.isActive = false;
        this.isRunning = false;
        this.currentOptions?.onError(`Speech recognition error: ${event.error}`);
      } else {
        // For unknown errors, try once more then give up
        console.warn(`Unknown error (${event.error}), attempting one restart`);
        if (this.isActive) {
          this.restartTimeout = setTimeout(() => {
            if (this.isActive && !this.isRunning) {
              this.startRecognition();
            }
          }, 1500);
        }
      }
    };

    this.setupOnEndHandler(this.currentOptions);

    // Proactive restart mechanism to prevent browser timeouts
    this.scheduleProactiveRestart();

    // Start recognition
    try {
      // Check if recognition is already running
      if (this.isRunning) {
        console.warn('Speech recognition is already running, stopping first');
        this.recognition.stop();
        // Wait a bit before starting again
        this.startTimeout = setTimeout(() => {
          if (this.isActive && !this.isRunning) {
            try {
              this.recognition.start();
            } catch (error) {
              console.error('Failed to restart speech recognition:', error);
              this.currentOptions?.onError(`Failed to restart: ${error}`);
            }
          }
        }, 100);
        return;
      }
      
      console.log('Starting speech recognition');
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      this.currentOptions?.onError(`Failed to start speech recognition: ${error}`);
    }
  }

  private startSilenceDetection(): void {
    // Clear any existing silence check
    if (this.silenceCheckInterval) {
      clearInterval(this.silenceCheckInterval);
      this.silenceCheckInterval = null;
    }

    // Check for silence every second
    this.silenceCheckInterval = setInterval(() => {
      if (!this.isActive || !this.isRunning) {
        return;
      }

      const now = Date.now();
      const timeSinceLastSpeech = now - this.lastSpeechTime;
      const sessionDuration = now - this.sessionStartTime;

      // If we haven't received any speech and it's been a while, keep listening
      // If we have received speech but there's been silence, be more aggressive about restarting
      const shouldRestart = this.hasReceivedSpeech 
        ? timeSinceLastSpeech > this.silenceThreshold 
        : sessionDuration > this.maxSessionDuration;

      if (shouldRestart) {
        console.log(`Restarting due to ${this.hasReceivedSpeech ? 'silence' : 'session timeout'}`);
        this.recognition.stop(); // This will trigger onend and automatic restart
      }
    }, 1000); // Check every second
  }

  private scheduleProactiveRestart(): void {
    // Clear any existing restart timeout
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }

    // Schedule a proactive restart before browser timeout
    this.restartTimeout = setTimeout(() => {
      if (this.isActive && this.isRunning) {
        const now = Date.now();
        const sessionDuration = now - this.sessionStartTime;
        const timeSinceLastSpeech = now - this.lastSpeechTime;

        // Restart if session is getting long or if there's been recent speech activity
        if (sessionDuration > this.maxSessionDuration || timeSinceLastSpeech < this.silenceThreshold) {
          console.log('Proactively restarting speech recognition to prevent timeout');
          this.recognition.stop(); // This will trigger onend and automatic restart
        } else {
          // If no recent speech, schedule another check
          this.scheduleProactiveRestart();
        }
      }
    }, this.maxSessionDuration);
  }

  stop(): void {
    console.log('Stopping speech recognition');
    this.isActive = false;
    this.isRunning = false;
    
    // Clear all timeouts and intervals
    if (this.startTimeout) {
      clearTimeout(this.startTimeout);
      this.startTimeout = null;
    }
    
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }

    if (this.silenceCheckInterval) {
      clearInterval(this.silenceCheckInterval);
      this.silenceCheckInterval = null;
    }
    
    if (this.recognition) {
      // Simple stop - no complex handler swapping needed
      this.recognition.stop();
    }

    // Call onEnd when actually stopping (not restarting)
    if (this.currentOptions) {
      this.currentOptions.onEnd();
    }
  }
}

// Text similarity calculation for reading accuracy
export function calculateReadingAccuracy(spokenText: string, expectedText: string): number {
  // Normalize both texts
  const normalize = (text: string) => 
    text.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();

  const spoken = normalize(spokenText);
  const expected = normalize(expectedText);

  if (!spoken || !expected) return 0;

  const spokenWords = spoken.split(' ');
  const expectedWords = expected.split(' ');

  if (expectedWords.length === 0) return 0;

  // Count how many expected words appear anywhere in the spoken text
  let correctWords = 0;
  
  for (const expectedWord of expectedWords) {
    if (spokenWords.includes(expectedWord)) {
      correctWords++;
    }
  }

  // Calculate accuracy based on expected words found (not total spoken words)
  return (correctWords / expectedWords.length) * 100;
}

// Word-by-word accuracy calculation
export function calculateWordAccuracies(spokenText: string, expectedText: string): boolean[] {
  // Normalize both texts
  const normalize = (text: string) => 
    text.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();

  const spoken = normalize(spokenText);
  const expected = normalize(expectedText);

  if (!spoken || !expected) return [];

  const spokenWords = spoken.split(' ');
  const expectedWords = expected.split(' ');
  const accuracies: boolean[] = [];

  // Check if each expected word appears anywhere in the spoken text
  for (const expectedWord of expectedWords) {
    accuracies.push(spokenWords.includes(expectedWord));
  }

  return accuracies;
}

// Detailed transcript analysis for enhanced feedback
export function analyzeTranscriptAttempts(spokenText: string, expectedText: string): {
  correctWords: string[];
  incorrectAttempts: string[];
  missingWords: string[];
} {
  const normalize = (text: string) => 
    text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

  const spoken = normalize(spokenText);
  const expected = normalize(expectedText);

  const spokenWords = spoken.split(' ');
  const expectedWords = expected.split(' ');

  const correctWords: string[] = [];
  const missingWords: string[] = [];
  const incorrectAttempts: string[] = [];

  // Find correct and missing words
  for (const expectedWord of expectedWords) {
    if (spokenWords.includes(expectedWord)) {
      correctWords.push(expectedWord);
    } else {
      missingWords.push(expectedWord);
    }
  }

  // Find incorrect attempts (words spoken that aren't in expected)
  for (const spokenWord of spokenWords) {
    if (!expectedWords.includes(spokenWord)) {
      incorrectAttempts.push(spokenWord);
    }
  }

  return {
    correctWords,
    incorrectAttempts,
    missingWords
  };
}

export const speechRecognition = new SpeechRecognitionService();