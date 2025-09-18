/**
 * Creates a subtle page flip sound effect using Web Audio API
 */
export class PageFlipSound {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        this.audioContext = new AudioContext();
        this.isEnabled = true;
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
  }

  /**
   * Play a subtle page flip sound
   */
  play() {
    if (!this.audioContext || !this.isEnabled) return;

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create a subtle "shwwp" sound using oscillators
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filterNode = this.audioContext.createBiquadFilter();

      // Configure the filter for a muffled paper sound
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(800, this.audioContext.currentTime);
      filterNode.Q.setValueAtTime(0.5, this.audioContext.currentTime);

      // Configure oscillators for a paper-like texture
      oscillator1.type = 'sawtooth';
      oscillator1.frequency.setValueAtTime(120, this.audioContext.currentTime);
      oscillator1.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.1);

      oscillator2.type = 'triangle';
      oscillator2.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator2.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.15);

      // Configure gain envelope for a quick "shwwp"
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 0.01); // Very quiet
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

      // Connect the audio graph
      oscillator1.connect(filterNode);
      oscillator2.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Start and stop the oscillators
      const startTime = this.audioContext.currentTime;
      const stopTime = startTime + 0.2;

      oscillator1.start(startTime);
      oscillator1.stop(stopTime);
      oscillator2.start(startTime);
      oscillator2.stop(stopTime);

    } catch (e) {
      console.warn('Failed to play page flip sound:', e);
    }
  }

  /**
   * Enable or disable the sound effect
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * Check if sound is supported and enabled
   */
  isSupported(): boolean {
    return this.audioContext !== null;
  }
}

// Singleton instance
export const pageFlipSound = new PageFlipSound();


