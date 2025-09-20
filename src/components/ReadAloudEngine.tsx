import { useState, useEffect, useCallback, useRef } from 'react';
import { elevenLabsService, ElevenLabsVoice } from '@/lib/elevenLabs';

export interface ReadAloudState {
  isPlaying: boolean;
  isPaused: boolean;
  currentWordIndex: number;
  currentSentenceIndex: number;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  speed: number;
  autoPageTurn: boolean;
  pageSounds: boolean;
  useElevenLabs: boolean;
  elevenLabsVoices: ElevenLabsVoice[];
  selectedElevenLabsVoice: ElevenLabsVoice | null;
  isElevenLabsConfigured: boolean;
}

export interface ReadAloudControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  setSpeed: (speed: number) => void;
  setAutoPageTurn: (enabled: boolean) => void;
  setPageSounds: (enabled: boolean) => void;
  toggleElevenLabs: () => void;
  setElevenLabsVoice: (voice: ElevenLabsVoice) => void;
}

interface ReadAloudEngineProps {
  text: string;
  onWordHighlight?: (wordIndex: number, word: string) => void;
  onSentenceHighlight?: (sentenceIndex: number) => void;
  onComplete?: () => void;
  children: (state: ReadAloudState, controls: ReadAloudControls) => React.ReactNode;
}

export const ReadAloudEngine: React.FC<ReadAloudEngineProps> = ({
  text,
  onWordHighlight,
  onSentenceHighlight,
  onComplete,
  children
}) => {
  const [state, setState] = useState<ReadAloudState>({
    isPlaying: false,
    isPaused: false,
    currentWordIndex: -1,
    currentSentenceIndex: -1,
    isSupported: elevenLabsService.isConfigured(), // Use ElevenLabs as primary support check
    voices: [],
    selectedVoice: null,
    speed: 1.0,
    autoPageTurn: true,
    pageSounds: false,
    useElevenLabs: true, // Default to ElevenLabs
    elevenLabsVoices: [],
    selectedElevenLabsVoice: null,
    isElevenLabsConfigured: elevenLabsService.isConfigured()
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wordsRef = useRef<string[]>([]);
  const sentencesRef = useRef<string[]>([]);

  // Load voices
  useEffect(() => {
    if (!state.isSupported) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => 
        voice.lang.startsWith('en') && !voice.name.includes('Google')
      );
      
      setState(prev => ({
        ...prev,
        voices: englishVoices,
        selectedVoice: prev.selectedVoice || englishVoices.find(v => 
          v.name.includes('Samantha') || v.name.includes('Karen') || v.default
        ) || englishVoices[0] || null
      }));
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [state.isSupported]);

  // Load ElevenLabs voices
  useEffect(() => {
    if (!state.isElevenLabsConfigured) return;

    const loadElevenLabsVoices = async () => {
      try {
        const voices = await elevenLabsService.getVoices(); // Get all voices to ensure John Doe is included
        // Find John Doe voice or fallback to first available
        const johnDoeVoice = voices.find(v => v.voice_id === '7fbQ7yJuEo56rYjrYaEh');
        const defaultVoice = johnDoeVoice || voices[0] || null;
        
        setState(prev => ({
          ...prev,
          elevenLabsVoices: voices,
          selectedElevenLabsVoice: prev.selectedElevenLabsVoice || defaultVoice
        }));
      } catch (error) {
        console.error('Failed to load ElevenLabs voices:', error);
      }
    };

    loadElevenLabsVoices();
  }, [state.isElevenLabsConfigured]);

  // Parse text into words and sentences
  useEffect(() => {
    wordsRef.current = text.split(/\s+/).filter(word => word.length > 0);
    sentencesRef.current = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  }, [text]);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('readAloudPrefs');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          speed: prefs.speed || 1.0,
          autoPageTurn: prefs.autoPageTurn !== false,
          pageSounds: prefs.pageSounds || false
        }));
      } catch (e) {
        console.warn('Failed to load read-aloud preferences:', e);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newState: Partial<ReadAloudState>) => {
    const prefs = {
      speed: newState.speed ?? state.speed,
      autoPageTurn: newState.autoPageTurn ?? state.autoPageTurn,
      pageSounds: newState.pageSounds ?? state.pageSounds
    };
    localStorage.setItem('readAloudPrefs', JSON.stringify(prefs));
  }, [state.speed, state.autoPageTurn, state.pageSounds]);

  const play = useCallback(async () => {
    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));

    if (!state.isElevenLabsConfigured || !state.selectedElevenLabsVoice) {
      console.error('ElevenLabs not configured or no voice selected');
      setState(prev => ({ ...prev, isPlaying: false }));
      return;
    }

    // Use ElevenLabs
    try {
      const audio = await elevenLabsService.generateAudioElement(
        text, 
        state.selectedElevenLabsVoice.voice_id
      );
      
      audioRef.current = audio;
      
      // Set playback rate
      audio.playbackRate = state.speed;

      audio.onplay = () => {
        setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      };

      audio.onpause = () => {
        setState(prev => ({ ...prev, isPaused: true }));
      };

      audio.onerror = (event) => {
        console.error('ElevenLabs audio error:', event);
        setState(prev => ({ 
          ...prev, 
          isPlaying: false, 
          isPaused: false,
          currentWordIndex: -1,
          currentSentenceIndex: -1
        }));
      };

      // Word highlighting for ElevenLabs (estimate timing)
      const words = wordsRef.current;
      let wordIndex = 0;
      let wordTimer: NodeJS.Timeout;

      const startWordHighlighting = () => {
        const totalDuration = audio.duration || (words.length * 0.5); // Estimate if duration not available
        const wordDuration = totalDuration / words.length;

        wordTimer = setInterval(() => {
          if (wordIndex < words.length && !audio.paused && !audio.ended) {
            setState(prev => ({ ...prev, currentWordIndex: wordIndex }));
            onWordHighlight?.(wordIndex, words[wordIndex]);
            wordIndex++;
          } else {
            clearInterval(wordTimer);
          }
        }, wordDuration * 1000);
      };

      audio.onloadedmetadata = () => {
        startWordHighlighting();
      };

      audio.onended = () => {
        if (wordTimer) clearInterval(wordTimer);
        setState(prev => ({ 
          ...prev, 
          isPlaying: false, 
          isPaused: false, 
          currentWordIndex: -1,
          currentSentenceIndex: -1
        }));
        onComplete?.();
      };

      await audio.play();
    } catch (error) {
      console.error('ElevenLabs playback error:', error);
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isPaused: false,
        currentWordIndex: -1,
        currentSentenceIndex: -1
      }));
    }
  }, [text, state.isElevenLabsConfigured, state.selectedElevenLabsVoice, state.speed, onWordHighlight, onComplete]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      if (state.isPlaying && !state.isPaused) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPaused: true }));
      } else if (state.isPaused) {
        audioRef.current.play();
        setState(prev => ({ ...prev, isPaused: false }));
      }
    }
  }, [state.isPlaying, state.isPaused]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false,
      currentWordIndex: -1,
      currentSentenceIndex: -1
    }));
  }, []);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setState(prev => ({ ...prev, selectedVoice: voice }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
    savePreferences({ speed });
  }, [savePreferences]);

  const setAutoPageTurn = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, autoPageTurn: enabled }));
    savePreferences({ autoPageTurn: enabled });
  }, [savePreferences]);

  const setPageSounds = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, pageSounds: enabled }));
    savePreferences({ pageSounds: enabled });
  }, [savePreferences]);

  const toggleElevenLabs = useCallback(() => {
    setState(prev => ({ ...prev, useElevenLabs: !prev.useElevenLabs }));
  }, []);

  const setElevenLabsVoice = useCallback((voice: ElevenLabsVoice) => {
    setState(prev => ({ ...prev, selectedElevenLabsVoice: voice }));
  }, []);

  const controls: ReadAloudControls = {
    play,
    pause,
    stop,
    setVoice,
    setSpeed,
    setAutoPageTurn,
    setPageSounds,
    toggleElevenLabs,
    setElevenLabsVoice
  };

  return <>{children(state, controls)}</>;
};



