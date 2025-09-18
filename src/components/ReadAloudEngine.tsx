import { useState, useEffect, useCallback, useRef } from 'react';

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
}

export interface ReadAloudControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  setSpeed: (speed: number) => void;
  setAutoPageTurn: (enabled: boolean) => void;
  setPageSounds: (enabled: boolean) => void;
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
    isSupported: 'speechSynthesis' in window,
    voices: [],
    selectedVoice: null,
    speed: 1.0,
    autoPageTurn: true,
    pageSounds: false
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
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

  const play = useCallback(() => {
    if (!state.isSupported || !state.selectedVoice) return;

    // Stop any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = state.selectedVoice;
    utterance.rate = state.speed;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    let wordIndex = 0;
    let sentenceIndex = 0;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const currentWord = wordsRef.current[wordIndex];
        setState(prev => ({ ...prev, currentWordIndex: wordIndex }));
        onWordHighlight?.(wordIndex, currentWord);
        wordIndex++;
      } else if (event.name === 'sentence') {
        setState(prev => ({ ...prev, currentSentenceIndex: sentenceIndex }));
        onSentenceHighlight?.(sentenceIndex);
        sentenceIndex++;
      }
    };

    utterance.onstart = () => {
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    };

    utterance.onpause = () => {
      setState(prev => ({ ...prev, isPaused: true }));
    };

    utterance.onresume = () => {
      setState(prev => ({ ...prev, isPaused: false }));
    };

    utterance.onend = () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isPaused: false, 
        currentWordIndex: -1,
        currentSentenceIndex: -1
      }));
      onComplete?.();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isPaused: false,
        currentWordIndex: -1,
        currentSentenceIndex: -1
      }));
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [text, state.isSupported, state.selectedVoice, state.speed, onWordHighlight, onSentenceHighlight, onComplete]);

  const pause = useCallback(() => {
    if (state.isPlaying && !state.isPaused) {
      speechSynthesis.pause();
    } else if (state.isPaused) {
      speechSynthesis.resume();
    }
  }, [state.isPlaying, state.isPaused]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
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

  const controls: ReadAloudControls = {
    play,
    pause,
    stop,
    setVoice,
    setSpeed,
    setAutoPageTurn,
    setPageSounds
  };

  return <>{children(state, controls)}</>;
};



