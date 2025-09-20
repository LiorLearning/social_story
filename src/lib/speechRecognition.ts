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
      options.onEnd();
      
      // No auto-restart logic - user controls start/stop manually
      // This eliminates race conditions and makes behavior predictable
    };
  }

  start(options: SpeechRecognitionOptions): void {
    if (!this.isSupported || !this.recognition) {
      options.onError('Speech recognition not supported');
      return;
    }

    this.isActive = true;
    this.currentOptions = options;

    // Configure recognition
    this.recognition.continuous = false; // Always false - no auto-restart
    this.recognition.interimResults = true;
    this.recognition.lang = options.language || 'en-US';

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isRunning = true;
      options.onStart();
    };

    this.recognition.onresult = (event: any) => {
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
      if (interimTranscript && options.onInterimResult) {
        options.onInterimResult(interimTranscript.trim());
      }

      // Send final results
      if (finalTranscript) {
        options.onResult({
          transcript: finalTranscript.trim(),
          confidence: confidence
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      options.onError(`Speech recognition error: ${event.error}`);
    };

    this.setupOnEndHandler(options);

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
              options.onError(`Failed to restart: ${error}`);
            }
          }
        }, 100);
        return;
      }
      
      console.log('Starting speech recognition');
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      options.onError(`Failed to start speech recognition: ${error}`);
    }
  }

  stop(): void {
    console.log('Stopping speech recognition');
    this.isActive = false;
    this.isRunning = false;
    
    // Clear any pending start timeout
    if (this.startTimeout) {
      clearTimeout(this.startTimeout);
      this.startTimeout = null;
    }
    
    if (this.recognition) {
      // Simple stop - no complex handler swapping needed
      this.recognition.stop();
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