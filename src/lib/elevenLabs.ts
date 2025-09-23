interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
}

interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  model: string;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
      voiceId: 'EiNlNiXeDU1pqqOPrYMO', // Default to John Doe voice
      model: 'eleven_multilingual_v2',
      stability: 0.5,
      similarityBoost: 0.8,
      style: 0.0,
      useSpeakerBoost: true
    };
  }

  /**
   * Check if ElevenLabs is properly configured
   */
  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  /**
   * Get available voices from ElevenLabs
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    if (!this.isConfigured()) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.config.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      throw error;
    }
  }

  /**
   * Generate speech from text using ElevenLabs
   */
  async generateSpeech(text: string, voiceId?: string): Promise<Blob> {
    if (!this.isConfigured()) {
      throw new Error('ElevenLabs API key not configured');
    }

    const selectedVoiceId = voiceId || this.config.voiceId;

    try {
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${selectedVoiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.config.apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: this.config.model,
            voice_settings: {
              stability: this.config.stability,
              similarity_boost: this.config.similarityBoost,
              style: this.config.style,
              use_speaker_boost: this.config.useSpeakerBoost,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to generate speech: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  /**
   * Generate speech and return as audio URL
   */
  async generateSpeechUrl(text: string, voiceId?: string): Promise<string> {
    const audioBlob = await this.generateSpeech(text, voiceId);
    return URL.createObjectURL(audioBlob);
  }

  /**
   * Generate speech and return as HTMLAudioElement
   */
  async generateAudioElement(text: string, voiceId?: string): Promise<HTMLAudioElement> {
    const audioUrl = await this.generateSpeechUrl(text, voiceId);
    const audio = new Audio(audioUrl);
    
    // Clean up the URL when audio is done
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl);
    });

    return audio;
  }

  /**
   * Update voice settings
   */
  updateVoiceSettings(settings: Partial<ElevenLabsConfig>) {
    this.config = { ...this.config, ...settings };
  }

  /**
   * Set the default voice ID
   */
  setVoiceId(voiceId: string) {
    this.config.voiceId = voiceId;
  }

  /**
   * Get current configuration
   */
  getConfig(): ElevenLabsConfig {
    return { ...this.config };
  }

  /**
   * Get recommended voices for children's stories
   */
  async getChildrensVoices(): Promise<ElevenLabsVoice[]> {
    const allVoices = await this.getVoices();
    
    // Filter for voices that work well for children's content
    const childrensFriendlyNames = [
      'Rachel', 'Domi', 'Bella', 'Antoni', 'Elli', 'Josh', 'Arnold', 'Adam', 'Sam'
    ];

    return allVoices.filter(voice => 
      childrensFriendlyNames.some(name => 
        voice.name.toLowerCase().includes(name.toLowerCase())
      )
    );
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();

// Export types
export type { ElevenLabsVoice, ElevenLabsConfig };
