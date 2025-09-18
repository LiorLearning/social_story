import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Book } from './Book';
import { ReadAloudEngine } from './ReadAloudEngine';
import { Button } from '@/components/ui/button';
import { storyBooks } from '@/data/storyPages';

export const ReaderShell: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const [readOnlyMode, setReadOnlyMode] = useState(false);

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
  }, [idleTimer]);

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
    }
  }, [story, currentPageIndex]);

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
      className="reader-shell reader-root"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        '--reader-bg-theme': 'warm'
      } as React.CSSProperties}
    >

      <ReadAloudEngine
        text={currentPage.right.text}
        onWordHighlight={handleWordHighlight}
        onComplete={handleReadAloudComplete}
      >
        {(readAloudState, readAloudControls) => (
          <>
            {/* Top Bar */}
            <div
              style={{
                opacity: controlsVisible ? 1 : 0,
                transition: 'opacity 300ms ease-in-out',
                pointerEvents: controlsVisible ? 'auto' : 'none'
              }}
            >
              <TopBar
                onBack={handleBack}
                currentPage={currentPageIndex + 1}
                totalPages={story.pages.length}
                readAloudState={readAloudState}
                readAloudControls={readAloudControls}
              />
              
              {/* Read-Only Mode Toggle */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '120px',
                  zIndex: 20
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
            </div>

            {/* Main Stage */}
            <div
              className="stage"
              style={{
                paddingTop: '70px',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '70px 20px 20px',
                position: 'relative',
                zIndex: 2
              }}
            >
              <Book
                pages={story.pages}
                currentPageIndex={currentPageIndex}
                onPageChange={setCurrentPageIndex}
                highlightedWordIndex={highlightedWordIndex}
                pageSoundsEnabled={readAloudState.pageSounds}
                readOnlyMode={readOnlyMode}
              />
            </div>

            {/* Floating CTA */}
            <div
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                opacity: controlsVisible ? 1 : 0,
                transition: 'opacity 300ms ease-in-out',
                pointerEvents: controlsVisible ? 'auto' : 'none',
                zIndex: 10
              }}
            >
              <Button
                onClick={() => window.open('/create', '_blank')}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Create a storybook
              </Button>
            </div>
          </>
        )}
      </ReadAloudEngine>
    </div>
  );
};
