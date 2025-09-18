interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionOptions {
  onResult: (result: SpeechRecognitionResult) => void;
  onInterimResult?: (transcript: string) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
  language?: string;
  continuous?: boolean;
}

class SpeechRecognitionService {
  private recognition: any = null;
  private isSupported = false;
  private isActive = false;

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

  start(options: SpeechRecognitionOptions): void {
    if (!this.isSupported || !this.recognition) {
      options.onError('Speech recognition not supported in this browser');
      return;
    }

    this.isActive = true;

    // Configure recognition
    this.recognition.continuous = options.continuous || false;
    this.recognition.interimResults = true;
    this.recognition.lang = options.language || 'en-US';

    // Set up event handlers
    this.recognition.onstart = () => {
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

    this.recognition.onend = () => {
      console.log('Speech recognition ended, isActive:', this.isActive);
      options.onEnd();
      
      // If continuous mode and still active, restart recognition
      if (options.continuous && this.isActive) {
        console.log('Attempting to restart speech recognition...');
        setTimeout(() => {
          if (this.isActive) {
            try {
              console.log('Restarting speech recognition');
              this.recognition.start();
            } catch (error) {
              console.warn('Failed to restart speech recognition:', error);
              // If restart fails, try again after a longer delay
              setTimeout(() => {
                if (this.isActive) {
                  try {
                    this.recognition.start();
                  } catch (retryError) {
                    console.error('Failed to restart speech recognition after retry:', retryError);
                    options.onError(`Failed to restart: ${retryError}`);
                  }
                }
              }, 1000);
            }
          }
        }, 300); // Increased delay for better reliability
      }
    };

    // Start recognition
    try {
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
    if (this.recognition) {
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

  // Simple word-based comparison
  const spokenWords = spoken.split(' ');
  const expectedWords = expected.split(' ');

  let matches = 0;
  const maxLength = Math.max(spokenWords.length, expectedWords.length);

  // Count matching words in order
  for (let i = 0; i < Math.min(spokenWords.length, expectedWords.length); i++) {
    if (spokenWords[i] === expectedWords[i]) {
      matches++;
    }
  }

  // Calculate accuracy as percentage
  return maxLength > 0 ? (matches / maxLength) * 100 : 0;
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

  // Compare each expected word with the corresponding spoken word
  for (let i = 0; i < expectedWords.length; i++) {
    if (i < spokenWords.length) {
      accuracies.push(spokenWords[i] === expectedWords[i]);
    } else {
      accuracies.push(false); // Word not spoken
    }
  }

  return accuracies;
}

export const speechRecognition = new SpeechRecognitionService();
