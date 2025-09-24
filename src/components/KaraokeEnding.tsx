import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FinalPage } from '@/data/storyPages';

interface KaraokeEndingProps {
  page: FinalPage;
}

export const KaraokeEnding: React.FC<KaraokeEndingProps> = ({ page }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Split text into lines and words for highlighting
  const lines = page.text.split(/[.!?]+/).filter(line => line.trim().length > 0).map(line => line.trim());
  const allWords = page.text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 0);
  
  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return null;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      const currentTranscript = (finalTranscript + interimTranscript).toLowerCase();
      setTranscribedText(currentTranscript);
      
      // Find matching words and highlight accordingly
      const transcriptWords = currentTranscript.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 0);
      
      // Find the best match position in our lyrics
      let bestMatch = 0;
      let maxMatches = 0;
      
      for (let i = 0; i <= allWords.length - transcriptWords.length; i++) {
        let matches = 0;
        for (let j = 0; j < Math.min(transcriptWords.length, 5); j++) { // Check last 5 words
          const transcriptWord = transcriptWords[transcriptWords.length - 1 - j];
          const lyricWord = allWords[i + transcriptWords.length - 1 - j];
          if (transcriptWord && lyricWord && lyricWord.includes(transcriptWord.substring(0, 3))) {
            matches++;
          }
        }
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = i + transcriptWords.length - 1;
        }
      }
      
      if (maxMatches > 0) {
        setCurrentWordIndex(bestMatch);
        
        // Update current line based on word position
        let wordCount = 0;
        let newLineIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          const lineWords = lines[i].toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 0);
          if (wordCount + lineWords.length > bestMatch) {
            newLineIndex = i;
            break;
          }
          wordCount += lineWords.length;
        }
        setCurrentLineIndex(newLineIndex);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      // Restart if audio is still playing
      if (isPlaying && audioRef.current && !audioRef.current.paused) {
        setTimeout(() => {
          if (recognitionRef.current && isPlaying) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.warn('Could not restart recognition:', e);
            }
          }
        }, 100);
      }
    };
    
    return recognition;
  };

  // Helper function to render lyrics with word-level highlighting
  const renderLyricsWithHighlighting = (line: string, lineIndex: number) => {
    const words = line.split(/(\s+)/); // Split but keep whitespace
    let globalWordIndex = 0;
    
    // Calculate the starting word index for this line
    for (let i = 0; i < lineIndex; i++) {
      const lineWords = lines[i].toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 0);
      globalWordIndex += lineWords.length;
    }
    
    return words.map((word, wordIndex) => {
      const isWord = /\w/.test(word);
      if (!isWord) {
        return <span key={wordIndex}>{word}</span>;
      }
      
      const currentGlobalIndex = globalWordIndex + Math.floor(wordIndex / 2); // Approximate since we have spaces
      const isHighlighted = currentGlobalIndex <= currentWordIndex;
      
      return (
        <span
          key={wordIndex}
          style={{
            backgroundColor: isHighlighted ? '#fef3c7' : 'transparent',
            color: isHighlighted ? '#92400e' : 'inherit',
            fontWeight: isHighlighted ? '600' : 'inherit',
            padding: isHighlighted ? '2px 4px' : '0',
            borderRadius: isHighlighted ? '4px' : '0',
            transition: 'all 0.3s ease'
          }}
        >
          {word}
        </span>
      );
    });
  };

  // Initialize audio and speech recognition
  useEffect(() => {
    if (page.audio) {
      const audio = new Audio(page.audio);
      audioRef.current = audio;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleError = (e: any) => {
        console.error('Audio loading error:', e);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handlePlay = () => {
        setIsPlaying(true);
        // Start speech recognition when audio starts (optional)
        setTimeout(() => {
          try {
            if (!recognitionRef.current) {
              recognitionRef.current = initializeSpeechRecognition();
            }
            if (recognitionRef.current && !isListening) {
              recognitionRef.current.start();
            }
          } catch (e) {
            console.warn('Speech recognition not available or failed to start:', e);
            // Continue without speech recognition
          }
        }, 100);
      };

      const handlePause = () => {
        setIsPlaying(false);
        // Stop speech recognition when audio pauses
        if (recognitionRef.current && isListening) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.warn('Could not stop speech recognition:', e);
          }
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        // Stop speech recognition when audio ends
        if (recognitionRef.current && isListening) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.warn('Could not stop speech recognition:', e);
          }
        }
        
        if (isLooping) {
          audio.currentTime = 0;
          setCurrentTime(0);
          setCurrentLineIndex(0);
          setCurrentWordIndex(0);
          setTranscribedText('');
          audio.play();
          setIsPlaying(true);
        } else {
          setCurrentTime(0);
          setCurrentLineIndex(0);
          setCurrentWordIndex(0);
          setTranscribedText('');
        }
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('error', handleError);
        audio.pause();
        
        // Clean up speech recognition
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.warn('Could not stop speech recognition on cleanup:', e);
          }
          recognitionRef.current = null;
        }
      };
    }
  }, [page.audio, isLooping]);

  const handlePlayPause = useCallback(async () => {
    if (!audioRef.current || !page.audio) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      // Reset states if playback fails
      setIsPlaying(false);
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Could not stop speech recognition:', e);
        }
      }
    }
  }, [isPlaying, page.audio, isListening]);

  const handleSkipBack = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  }, []);

  const handleSkipForward = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
  }, [duration]);

  const handleProgressClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !page.audio) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const progress = clickX / rect.width;
    const newTime = progress * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration, page.audio]);

  const handleRequestKaraoke = useCallback(() => {
    setRequestSent(true);
    // Reset after 3 seconds
    setTimeout(() => setRequestSent(false), 3000);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const hasAudio = Boolean(page.audio);

  return (
    <div 
      className="karaoke-ending"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {/* Main Karaoke Card */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '28px',
          padding: '48px',
          width: '100%',
          maxWidth: '1000px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          border: '3px solid rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px',
            fontFamily: '"Georgia", "Times New Roman", serif'
          }}>
            {page.title}
          </h1>
          {page.subtitle && (
            <p style={{
              fontSize: '18px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              {page.subtitle}
            </p>
          )}
        </div>

        {/* Content Layout */}
        <div style={{
          display: 'flex',
          gap: '48px',
          alignItems: 'flex-start',
          marginBottom: '40px'
        }}>
          {/* Image Thumbnail */}
          <div style={{
            flexShrink: 0,
            width: '280px',
            height: '200px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
            border: '3px solid rgba(255, 255, 255, 0.8)'
          }}>
            <img
              src={page.image}
              alt={page.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Lyrics/Text */}
          <div 
            ref={lyricsContainerRef}
            className="lyrics-container"
            style={{ 
              flex: 1,
              paddingTop: '8px',
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '8px',
              scrollBehavior: 'smooth'
            }}
          >
            {lines.map((line, index) => (
              <div
                key={index}
                style={{
                  fontSize: '24px',
                  lineHeight: '1.8',
                  marginBottom: '20px',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  backgroundColor: hasAudio && currentLineIndex === index 
                    ? 'rgba(254, 243, 199, 0.3)' 
                    : 'rgba(248, 250, 252, 0.6)',
                  color: '#374151',
                  border: hasAudio && currentLineIndex === index 
                    ? '3px solid #f59e0b' 
                    : '2px solid rgba(226, 232, 240, 0.8)',
                  transition: 'all 0.4s ease',
                  boxShadow: hasAudio && currentLineIndex === index 
                    ? '0 8px 25px rgba(245, 158, 11, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transform: hasAudio && currentLineIndex === index 
                    ? 'translateY(-2px)' 
                    : 'translateY(0)'
                }}
              >
                {hasAudio ? renderLyricsWithHighlighting(line, index) : line}
              </div>
            ))}
            
            {/* Audio Status Info */}
            {hasAudio && (
              <div style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: isPlaying ? 'rgba(34, 197, 94, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                color: isPlaying ? '#15803d' : '#6b7280',
                border: `1px solid ${isPlaying ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)'}`
              }}>
                <div style={{ marginBottom: '8px', fontWeight: '600' }}>
                  {isPlaying ? '🎵 Playing' : '⏸️ Paused'} | Duration: {formatTime(duration)}
                </div>
                {isListening && (
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    🎤 Speech recognition active {transcribedText && `| Last: "${transcribedText.slice(-30)}..."`}
                  </div>
                )}
                {!isListening && isPlaying && (
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    💡 Speech recognition not available - using basic playback
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {hasAudio && (
          <div style={{ marginBottom: '32px' }}>
            <div
              onClick={handleProgressClick}
              style={{
                width: '100%',
                height: '12px',
                backgroundColor: '#e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(226, 232, 240, 0.8)'
              }}
            >
              <div
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '6px',
                  transition: 'width 0.1s ease',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
                }}
              />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '12px',
              fontSize: '16px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <Button
            onClick={handleSkipBack}
            disabled={!hasAudio}
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 border-2"
            style={{ 
              opacity: hasAudio ? 1 : 0.5,
              borderColor: hasAudio ? '#e2e8f0' : '#d1d5db',
              boxShadow: hasAudio ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            onClick={handlePlayPause}
            disabled={!hasAudio}
            className={`rounded-full w-16 h-16 ${hasAudio ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'}`}
            style={{ 
              opacity: hasAudio ? 1 : 0.5,
              boxShadow: hasAudio ? '0 8px 25px rgba(59, 130, 246, 0.4)' : 'none',
              transform: hasAudio && isPlaying ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease'
            }}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7" fill="currentColor" />
            )}
          </Button>

          <Button
            onClick={handleSkipForward}
            disabled={!hasAudio}
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 border-2"
            style={{ 
              opacity: hasAudio ? 1 : 0.5,
              borderColor: hasAudio ? '#e2e8f0' : '#d1d5db',
              boxShadow: hasAudio ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => setIsLooping(!isLooping)}
            disabled={!hasAudio}
            variant={isLooping ? "default" : "outline"}
            size="lg"
            className="rounded-full w-14 h-14 border-2"
            style={{ 
              opacity: hasAudio ? 1 : 0.5,
              borderColor: hasAudio ? (isLooping ? '#3b82f6' : '#e2e8f0') : '#d1d5db',
              backgroundColor: isLooping ? '#3b82f6' : 'transparent',
              color: isLooping ? 'white' : '#374151',
              boxShadow: hasAudio ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          {!hasAudio && (
            <Button
              onClick={handleRequestKaraoke}
              disabled={requestSent}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                marginLeft: '24px',
                boxShadow: requestSent ? 'none' : '0 4px 15px rgba(168, 85, 247, 0.4)'
              }}
            >
              {requestSent ? (
                <span className="flex items-center gap-2">
                  ✅ Request sent
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🎤 Request your personal karaoke version today
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
