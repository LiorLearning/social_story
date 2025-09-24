import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Book } from './Book';
import { ReadAloudEngine } from './ReadAloudEngine';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { storyBooks } from '@/data/storyPages';
import { speechRecognition, calculateReadingAccuracy } from '@/lib/speechRecognition';

export const ReaderShell: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const [readOnlyMode, setReadOnlyMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [readingAccuracy, setReadingAccuracy] = useState<number | null>(null);

  const story = storyId ? storyBooks[storyId] : null;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevPage();
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          handleNextPage();
          break;
        case 'Home':
          event.preventDefault();
          setCurrentPageIndex(0);
          break;
        case 'End':
          event.preventDefault();
          if (story) setCurrentPageIndex(story.pages.length - 1);
          break;
        case 'Escape':
          event.preventDefault();
          navigate('/');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [story, navigate]);

  // Auto-hide controls after idle
  useEffect(() => {
    const resetIdleTimer = () => {
      setControlsVisible(true);
      if (idleTimer) clearTimeout(idleTimer);
      
      const timer = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
      
      setIdleTimer(timer);
    };

    const handleActivity = () => resetIdleTimer();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    resetIdleTimer();

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []); // Empty dependency array - only run once on mount

  // Touch/swipe handling
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Only trigger if horizontal swipe is dominant and exceeds threshold
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        if (deltaX > 0) {
          handlePrevPage();
        } else {
          handleNextPage();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleNextPage = useCallback(() => {
    if (story && currentPageIndex < story.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
      setHighlightedWordIndex(-1);
      // Stop recording when page changes
      if (isRecording) {
        speechRecognition.stop();
        setIsRecording(false);
      }
    }
  }, [story, currentPageIndex, isRecording]);

  const handlePrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      setHighlightedWordIndex(-1);
    }
  }, [currentPageIndex]);

  const handleBack = () => {
    navigate('/');
  };

  const handleWordHighlight = useCallback((wordIndex: number, word: string) => {
    setHighlightedWordIndex(wordIndex);
  }, []);

  const handleReadAloudComplete = useCallback(() => {
    // Auto-advance to next page if enabled
    setTimeout(() => {
      handleNextPage();
    }, 1000);
  }, [handleNextPage]);

  const handleMicrophoneClick = useCallback(() => {
    if (readOnlyMode) {
      console.log('Microphone clicked in read-only mode');
      return;
    }

    if (!speechRecognition.isAvailable()) {
      console.log('Speech recognition not available in this browser');
      return;
    }

    const currentPage = story?.pages[currentPageIndex];
    if (!currentPage || currentPage.type !== 'spread') {
      console.log('No text available for speech recognition');
      return;
    }

    if (isRecording) {
      // User manually stopped - stop everything
      speechRecognition.stop();
      setIsRecording(false);
      return;
    }

    // User started listening
    setIsRecording(true);
    setReadingAccuracy(null);

    speechRecognition.start({
      onInterimResult: (transcript) => {
        // Silent processing - no UI updates for transcription
      },
      onResult: (result) => {
        // Calculate accuracy based on the current page text
        const accuracy = calculateReadingAccuracy(result.transcript, currentPage.right.text);
        setReadingAccuracy(accuracy);
        
        // No UI feedback for transcription - just log for debugging
        console.log(`Reading accuracy: ${Math.round(accuracy)}%`);
      },
      onError: (error) => {
        console.error('Speech recognition error:', error);
        setIsRecording(false);
      },
      onStart: () => {
        console.log('Speech recognition started');
        setIsRecording(true);
      },
      onEnd: () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
      },
      language: 'en-US'
    });
  }, [readOnlyMode, story, currentPageIndex, isRecording]);

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Story not found</h1>
          <Button onClick={handleBack} className="bg-[#22C55E] hover:bg-[#1FAA4B] text-white">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentPage = story.pages[currentPageIndex];

  return (
    <div 
      className="reader-shell reader-root no-scroll-x"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        '--reader-bg-theme': 'warm',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      } as React.CSSProperties}
    >

      <ReadAloudEngine
        text={currentPage.type === 'spread' ? currentPage.right.text : ''}
        onWordHighlight={handleWordHighlight}
        onComplete={handleReadAloudComplete}
      >
        {(readAloudState, readAloudControls) => (
          <>
            {/* Top Bar - Always Visible */}
            <TopBar
              onBack={handleBack}
              currentPage={currentPageIndex + 1}
              totalPages={story.pages.length}
              readAloudState={readAloudState}
              readAloudControls={readAloudControls}
              storyTitle={story.title}
              pageImage={currentPage.type === 'spread' ? currentPage.left.image : currentPage.image}
              storyId={story.id}
            />
            
            {/* Read-Only Mode Toggle */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '120px',
                zIndex: 20,
                opacity: controlsVisible ? 1 : 0,
                transition: 'opacity 300ms ease-in-out',
                pointerEvents: controlsVisible ? 'auto' : 'none'
              }}
            >
              <Button
                onClick={() => setReadOnlyMode(!readOnlyMode)}
                className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
                  readOnlyMode 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {readOnlyMode ? 'Read Only' : 'Practice Mode'}
              </Button>
            </div>

            {/* Main Stage */}
            <div
              className="stage"
              style={{
                paddingTop: 'clamp(72px, 15vw, 88px)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(72px, 15vw, 88px) clamp(8px, 2vw, 10px) clamp(80px, 15vw, 120px)', // Extra bottom padding for mic
                position: 'relative',
                zIndex: 2,
                gap: 'clamp(20px, 5vw, 40px)' // Gap between book and mic
              }}
            >
              <Book
                pages={story.pages}
                currentPageIndex={currentPageIndex}
                onPageChange={setCurrentPageIndex}
                highlightedWordIndex={highlightedWordIndex}
                pageSoundsEnabled={readAloudState.pageSounds}
                readOnlyMode={readOnlyMode}
                externalReadingAccuracy={readingAccuracy}
                externalIsRecording={isRecording}
              />

              {/* Microphone Button - Centered below the book */}
              <button
                onClick={handleMicrophoneClick}
                className={`flex items-center justify-center rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  readOnlyMode 
                    ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'
                    : isRecording
                    ? 'bg-sky-400 hover:bg-sky-500 focus:ring-sky-300'
                    : readingAccuracy !== null && readingAccuracy >= 80
                    ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300'
                    : 'bg-[#22C55E] hover:bg-[#1FAA4B] focus:ring-[#A7F3D0]'
                }`}
                style={{
                  width: 'clamp(56px, 12vw, 72px)', // Slightly larger than in-card version
                  height: 'clamp(56px, 12vw, 72px)', // Slightly larger than in-card version
                  minWidth: '44px', // Ensure tap target minimum
                  minHeight: '44px' // Ensure tap target minimum
                }}
                aria-label={readOnlyMode ? "Read-only mode" : isRecording ? "Stop recording" : "Start voice recording"}
                title={readOnlyMode ? "Read-only mode" : isRecording ? "Stop recording" : "Start voice recording"}
              >
                {readOnlyMode ? (
                  <Mic style={{ width: 'clamp(24px, 6vw, 28px)', height: 'clamp(24px, 6vw, 28px)' }} />
                ) : isRecording ? (
                  <Square style={{ width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)' }} fill="currentColor" />
                ) : (
                  <Mic style={{ width: 'clamp(24px, 6vw, 28px)', height: 'clamp(24px, 6vw, 28px)' }} />
                )}
              </button>
            </div>

            {/* Floating CTA - Safe positioning, avoid overlap */}
            <div
              style={{
                position: 'fixed',
                bottom: 'max(clamp(16px, 4vw, 24px), env(safe-area-inset-bottom))',
                right: 'max(clamp(16px, 4vw, 24px), env(safe-area-inset-right))',
                opacity: controlsVisible ? 1 : 0,
                transition: 'opacity 300ms ease-in-out',
                pointerEvents: controlsVisible ? 'auto' : 'none',
                zIndex: 5 // Lower z-index to stay behind story content
              }}
            >
              <Button
                onClick={() => window.open('/create', '_blank')}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium px-3 sm:px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base tap-target"
                style={{
                  minHeight: '44px',
                  minWidth: '44px'
                }}
              >
                <span className="hidden xs:inline">Create a storybook</span>
                <span className="xs:hidden">Create</span>
              </Button>
            </div>
          </>
        )}
      </ReadAloudEngine>
    </div>
  );
};
