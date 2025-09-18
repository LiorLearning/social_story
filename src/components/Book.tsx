import React, { useState, useCallback } from 'react';
import { Spread } from './Spread';
import { StoryPage } from '@/data/storyPages';
import { pageFlipSound } from '@/lib/pageFlipSound';

interface BookProps {
  pages: StoryPage[];
  currentPageIndex: number;
  onPageChange: (newIndex: number) => void;
  highlightedWordIndex?: number;
  pageSoundsEnabled?: boolean;
  readOnlyMode?: boolean;
  className?: string;
}

export const Book: React.FC<BookProps> = ({
  pages,
  currentPageIndex,
  onPageChange,
  highlightedWordIndex = -1,
  pageSoundsEnabled = false,
  readOnlyMode = false,
  className = ''
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  const currentPage = pages[currentPageIndex];
  const nextPage = pages[currentPageIndex + 1];

  const handleNext = useCallback(() => {
    if (isFlipping || currentPageIndex >= pages.length - 1) return;
    
    setFlipDirection('next');
    setIsFlipping(true);
    
    // Play page flip sound if enabled
    if (pageSoundsEnabled) {
      pageFlipSound.play();
    }
    
    // Smooth page flip timing
    setTimeout(() => {
      onPageChange(currentPageIndex + 1);
      setTimeout(() => {
        setIsFlipping(false);
      }, 350); // Slightly longer to ensure smooth completion
    }, 325); // Start page change slightly before animation completes
  }, [currentPageIndex, pages.length, isFlipping, onPageChange, pageSoundsEnabled]);

  const handlePrev = useCallback(() => {
    if (isFlipping || currentPageIndex <= 0) return;
    
    setFlipDirection('prev');
    setIsFlipping(true);
    
    // Play page flip sound if enabled
    if (pageSoundsEnabled) {
      pageFlipSound.play();
    }
    
    setTimeout(() => {
      onPageChange(currentPageIndex - 1);
      setTimeout(() => {
        setIsFlipping(false);
      }, 350);
    }, 325);
  }, [currentPageIndex, isFlipping, onPageChange, pageSoundsEnabled]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipping) return; // Prevent clicks during animation
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    
    // Right 20% = next page, Left 20% = previous page
    if (clickX > width * 0.8) {
      handleNext();
    } else if (clickX < width * 0.2) {
      handlePrev();
    }
  }, [handleNext, handlePrev, isFlipping]);

  if (!currentPage) return null;

  return (
    <div 
      className={`book-container ${className}`}
       style={{
         perspective: '1600px',
         perspectiveOrigin: 'center center',
         maxWidth: '2400px', // Much wider to match the screenshot
         minWidth: '500px',
         aspectRatio: '30/12', // Wide panoramic aspect ratio (1.78:1)
         margin: '0 auto',
         cursor: isFlipping ? 'wait' : 'pointer',
         position: 'relative',
         filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
         borderRadius: '28px',
         background: `
           linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
           linear-gradient(45deg, rgba(0, 0, 0, 0.05) 0%, transparent 100%)
         `
       }}
      onClick={handleClick}
    >
      {/* Enhanced Book spine shadow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '8%',
          bottom: '8%',
          width: '4px',
          background: `
            linear-gradient(to bottom, 
              transparent 0%, 
              rgba(0, 0, 0, 0.3) 10%, 
              rgba(0, 0, 0, 0.4) 50%, 
              rgba(0, 0, 0, 0.3) 90%, 
              transparent 100%
            )
          `,
          transform: 'translateX(-50%)',
          zIndex: 5,
          pointerEvents: 'none',
          borderRadius: '2px',
          boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)'
        }}
      />
      
      <div 
        className="book-stage"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}
      >
        <Spread
          page={currentPage}
          nextPage={nextPage}
          isFlipping={isFlipping}
          flipDirection={flipDirection}
          highlightedWordIndex={highlightedWordIndex}
          pageNumber={currentPageIndex + 1}
          totalPages={pages.length}
          readOnlyMode={readOnlyMode}
        />
      </div>
      
      {/* Subtle page flip sound effect indicator */}
      {isFlipping && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '25%',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#22C55E',
            animation: 'pageFlipGlow 650ms ease-out',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};