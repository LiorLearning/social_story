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
  const [isLooping, setIsLooping] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  // Split text into lines (sentences)
  const lines = page.text.split(/[.!?]+/).filter(line => line.trim().length > 0).map(line => line.trim());

  // Define precise timestamps for each section based on your timing
  const sectionTimestamps = [
    { start: 0, end: 13, name: "Verse 1" },      // 0:00 - 0:13
    { start: 14, end: 32, name: "Chorus 1" },    // 0:14 - 0:32
    { start: 33, end: 47, name: "Verse 2" },     // 0:33 - 0:47
    { start: 48, end: 69, name: "Chorus 2" },    // 0:48 - 1:09
    { start: 70, end: 83, name: "Bridge" },      // 1:10 - 1:23
    { start: 84, end: 104, name: "Final Chorus" } // 1:24 - end
  ];

  // Map lines to their corresponding sections (based on the lyrics structure)
  const lineToSection = [
    0, // "Verse 1"
    0, 0, 0, 0, // Verse 1 lines (4 lines)
    1, // "Chorus"
    1, 1, 1, 1, // Chorus 1 lines (4 lines)
    2, // "Verse 2"
    2, 2, 2, 2, // Verse 2 lines (4 lines)
    3, // "Chorus"
    3, 3, 3, 3, // Chorus 2 lines (4 lines)
    4, // "Bridge"
    4, 4, 4, 4, // Bridge lines (4 lines)
    5, // "Final Chorus"
    5, 5, 5, 5  // Final Chorus lines (4 lines)
  ];

  const getCurrentLineIndex = (currentTime: number) => {
    // Find which section we're in
    let currentSection = -1;
    for (let i = 0; i < sectionTimestamps.length; i++) {
      if (currentTime >= sectionTimestamps[i].start && currentTime <= sectionTimestamps[i].end) {
        currentSection = i;
        break;
      }
    }

    if (currentSection === -1) {
      // If we're past all sections, show the last line
      if (currentTime > sectionTimestamps[sectionTimestamps.length - 1].end) {
        return lines.length - 1;
      }
      return 0;
    }

    // Find the first line of this section
    let sectionStartLine = 0;
    for (let i = 0; i < lineToSection.length; i++) {
      if (lineToSection[i] === currentSection) {
        sectionStartLine = i;
        break;
      }
    }

    // Count lines in this section
    let sectionLineCount = 0;
    for (let i = 0; i < lineToSection.length; i++) {
      if (lineToSection[i] === currentSection) {
        sectionLineCount++;
      }
    }

    // Calculate progress within the section
    const sectionDuration = sectionTimestamps[currentSection].end - sectionTimestamps[currentSection].start;
    const timeInSection = currentTime - sectionTimestamps[currentSection].start;
    const progressInSection = Math.min(Math.max(timeInSection / sectionDuration, 0), 1);

    // Calculate which line within the section
    const lineInSection = Math.floor(progressInSection * sectionLineCount);
    
    return Math.min(sectionStartLine + lineInSection, lines.length - 1);
  };

  // Initialize audio
  useEffect(() => {
    if (page.audio) {
      const audio = new Audio(page.audio);
      audioRef.current = audio;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        
        // Use precise timing to determine current line
        const newLineIndex = getCurrentLineIndex(audio.currentTime);
        
        if (newLineIndex !== currentLineIndex) {
          setCurrentLineIndex(newLineIndex);
          
          // Auto-scroll to keep current line visible
          if (lyricsContainerRef.current) {
            const activeLineElement = lyricsContainerRef.current.children[newLineIndex] as HTMLElement;
            if (activeLineElement) {
              activeLineElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
              });
            }
          }
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        if (isLooping) {
          audio.currentTime = 0;
          audio.play();
          setIsPlaying(true);
        } else {
          setCurrentTime(0);
          setCurrentLineIndex(0);
        }
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.pause();
      };
    }
  }, [page.audio, lines.length, isLooping]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !page.audio) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [isPlaying, page.audio]);

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
                    ? '#fef3c7' 
                    : 'rgba(248, 250, 252, 0.6)',
                  color: hasAudio && currentLineIndex === index 
                    ? '#92400e' 
                    : '#374151',
                  border: hasAudio && currentLineIndex === index 
                    ? '3px solid #f59e0b' 
                    : '2px solid rgba(226, 232, 240, 0.8)',
                  transition: 'all 0.4s ease',
                  fontWeight: hasAudio && currentLineIndex === index ? '600' : '400',
                  boxShadow: hasAudio && currentLineIndex === index 
                    ? '0 8px 25px rgba(245, 158, 11, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transform: hasAudio && currentLineIndex === index 
                    ? 'translateY(-2px)' 
                    : 'translateY(0)'
                }}
              >
                {line}
              </div>
            ))}
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
