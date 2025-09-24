import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Play, Pause, MoreVertical, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReadAloudState, ReadAloudControls } from './ReadAloudEngine';

interface TopBarProps {
  onBack: () => void;
  currentPage: number;
  totalPages: number;
  readAloudState: ReadAloudState;
  readAloudControls: ReadAloudControls;
  storyTitle?: string;
  pageImage?: string;
  storyId?: string;
}

// Color extraction and harmonization utilities
const extractDominantColor = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('#F59E0B'); // Fallback warm color
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let r = 0, g = 0, b = 0;
      const sampleSize = 10; // Sample every 10th pixel for performance
      let count = 0;

      for (let i = 0; i < data.length; i += 4 * sampleSize) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      // Convert to warm, high-energy hue
      const warmColor = harmonizeToWarm(r, g, b);
      resolve(warmColor);
    };
    img.onerror = () => resolve('#F59E0B'); // Fallback
    img.src = imageUrl;
  });
};

const harmonizeToWarm = (r: number, g: number, b: number): string => {
  // Convert to HSL
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const diff = max - min;
  
  let h = 0;
  if (diff !== 0) {
    if (max === r / 255) h = ((g / 255 - b / 255) / diff) % 6;
    else if (max === g / 255) h = (b / 255 - r / 255) / diff + 2;
    else h = (r / 255 - g / 255) / diff + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // Shift to warm range (20-60 degrees for orange/yellow)
  const warmHue = 30 + (h % 30); // Keep in warm range
  const saturation = Math.max(0.7, (max - min)); // High saturation
  const lightness = Math.min(0.6, Math.max(0.4, (max + min) / 2)); // Medium lightness

  return `hsl(${warmHue}, ${saturation * 100}%, ${lightness * 100}%)`;
};

const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation - in production, use a proper WCAG calculator
  const rgb = backgroundColor.match(/\d+/g);
  if (!rgb) return '#000000';
  
  const [r, g, b] = rgb.map(Number);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Get story-specific emoji and avatar
const getStoryTheme = (storyId: string) => {
  const themes = {
    '1': { emoji: '🥚', avatar: '🐉' }, // Reese & Geyser Eggs - eggs for progress, dragon avatar
    '2': { emoji: '🍌', avatar: '🐵' }, // Banana Monkey - bananas for progress, monkey avatar
    '3': { emoji: '🏫', avatar: '👩‍🏫' }, // Mischievous Teacher - school for progress, teacher avatar
    '4': { emoji: '❄️', avatar: '🧊' }, // Ice Monster - snowflakes for progress, ice avatar
    '5': { emoji: '🌟', avatar: '👭' }, // Mila & Vivienne - stars for progress, sisters avatar
  };
  
  return themes[storyId as keyof typeof themes] || { emoji: '📖', avatar: '📚' };
};

export const TopBar: React.FC<TopBarProps> = ({
  onBack,
  currentPage,
  totalPages,
  readAloudState,
  readAloudControls,
  storyTitle = "Story Adventure",
  pageImage,
  storyId = "1"
}) => {
  const [showGrownUpsMenu, setShowGrownUpsMenu] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#F59E0B');
  const [textColor, setTextColor] = useState('#000000');
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(5);
  const menuRef = useRef<HTMLDivElement>(null);

  // Extract color from page image
  useEffect(() => {
    if (pageImage) {
      extractDominantColor(pageImage).then(color => {
        setBackgroundColor(color);
        setTextColor(getContrastColor(color));
      });
    }
  }, [pageImage]);

  // Show XP on page change (simulate)
  useEffect(() => {
    if (currentPage > 1) {
      setShowXP(true);
      const timer = setTimeout(() => setShowXP(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowGrownUpsMenu(false);
      }
    };

    if (showGrownUpsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showGrownUpsMenu]);

  const handleListenClick = () => {
    if (readAloudState.isPlaying) {
      readAloudControls.pause();
    } else {
      readAloudControls.play();
    }
  };

  // Get story theme
  const storyTheme = getStoryTheme(storyId);
  
  // Generate progress indicators (totalPages - 1 to exclude final karaoke page)
  const progressCount = totalPages - 1;
  const progressIndicators = Array.from({ length: progressCount }, (_, i) => {
    const filled = i < currentPage && currentPage <= progressCount;
    return (
      <div
        key={i}
        style={{
          width: '24px',
          height: '24px',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: filled ? 'none' : 'grayscale(1) opacity(0.3)',
          transition: 'all 200ms ease'
        }}
      >
        {storyTheme.emoji}
      </div>
    );
  });

  const surfaceColor = textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const hoverColor = textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';

  return (
    <div 
      className="top-bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '72px',
        backgroundColor,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        padding: '0 clamp(12px, 3vw, 16px)',
        gap: 'clamp(8px, 2vw, 12px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        animation: 'slideDown 300ms ease-out',
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'max(clamp(12px, 3vw, 16px), env(safe-area-inset-left))',
        paddingRight: 'max(clamp(12px, 3vw, 16px), env(safe-area-inset-right))',
        overflowX: 'hidden'
      }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          minWidth: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: surfaceColor,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          cursor: 'pointer',
          transition: 'all 200ms ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverColor}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = surfaceColor}
        onFocus={(e) => e.currentTarget.style.outline = `2px solid ${textColor}`}
        onBlur={(e) => e.currentTarget.style.outline = 'none'}
        aria-label="Back"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Avatar + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 8px)', minWidth: 0, flexShrink: 1 }}>
        <div style={{ 
          width: 'clamp(28px, 6vw, 32px)', 
          height: 'clamp(28px, 6vw, 32px)', 
          borderRadius: '50%', 
          backgroundColor: surfaceColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(16px, 4vw, 20px)',
          flexShrink: 0
        }}>
          {storyTheme.avatar}
        </div>
        <span style={{ 
          color: textColor, 
          fontSize: 'clamp(14px, 3.5vw, 18px)', 
          fontWeight: '600',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 'clamp(120px, 25vw, 200px)',
          minWidth: 0
        }}>
          {storyTitle}
        </span>
      </div>

      {/* Progress Section - Responsive with horizontal scroll */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'clamp(8px, 2vw, 16px)', 
        flex: 1, 
        justifyContent: 'center',
        minWidth: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <span style={{ 
          color: textColor, 
          fontSize: 'clamp(14px, 3.5vw, 18px)', 
          fontWeight: '600',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          Page {currentPage} of {totalPages}
        </span>
        <div style={{ 
          display: 'flex', 
          gap: 'clamp(2px, 1vw, 4px)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          flexShrink: 0
        }}>
          {progressIndicators}
        </div>
      </div>

      {/* XP Chip */}
      {showXP && (
        <div style={{
          backgroundColor: '#10B981',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          animation: 'xpPop 1s ease-out'
        }}>
          ⭐ +{xpAmount}
        </div>
      )}

      {/* Hear Story Button - Responsive */}
      <button
        onClick={handleListenClick}
        style={{
          height: 'clamp(44px, 10vw, 48px)',
          padding: '0 clamp(12px, 4vw, 20px)',
          borderRadius: 'clamp(22px, 5vw, 24px)',
          backgroundColor: '#10B981',
          color: 'white',
          border: 'none',
          fontSize: 'clamp(14px, 3.5vw, 18px)',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(4px, 1.5vw, 8px)',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          outline: 'none',
          animation: readAloudState.isPlaying ? 'none' : 'pulse 2s infinite',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          minWidth: '44px'
        }}
        onFocus={(e) => e.currentTarget.style.outline = `2px solid ${textColor}`}
        onBlur={(e) => e.currentTarget.style.outline = 'none'}
        aria-label={readAloudState.isPlaying ? "Pause" : "Hear Story"}
      >
        {readAloudState.isPlaying ? <Pause size={20} /> : <Volume2 size={20} />}
        <span className="hidden xs:inline">
          {readAloudState.isPlaying ? 'Pause' : 'Hear Story'}
        </span>
        {readAloudState.isPlaying && (
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 6px',
            borderRadius: '8px',
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            marginLeft: '4px'
          }}
          className="hidden sm:inline">
            0:15
          </span>
        )}
      </button>

      {/* For Grown-ups Menu */}
      <div style={{ position: 'relative' }} ref={menuRef}>
        <button
          onClick={() => setShowGrownUpsMenu(!showGrownUpsMenu)}
          style={{
            minWidth: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: surfaceColor,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textColor,
            cursor: 'pointer',
            transition: 'all 200ms ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverColor}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = surfaceColor}
          onFocus={(e) => e.currentTarget.style.outline = `2px solid ${textColor}`}
          onBlur={(e) => e.currentTarget.style.outline = 'none'}
          aria-label="For Grown-ups"
        >
          <MoreVertical size={20} />
        </button>

        {/* Dropdown Menu */}
        {showGrownUpsMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            width: '280px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            padding: '16px',
            zIndex: 100,
            animation: 'fadeInUp 200ms ease-out'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
              Settings & Help
            </h3>
            
            {/* Speed Control */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px' }}>
                Reading Speed
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0.8, 1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => readAloudControls.setSpeed(speed)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: readAloudState.speed === speed ? '#10B981' : 'white',
                      color: readAloudState.speed === speed ? 'white' : '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Auto page turn</span>
                <button
                  onClick={() => readAloudControls.setAutoPageTurn(!readAloudState.autoPageTurn)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: readAloudState.autoPageTurn ? '#10B981' : '#E5E7EB',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: '2px',
                    left: readAloudState.autoPageTurn ? '22px' : '2px',
                    transition: 'all 200ms ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }} />
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Page flip sounds</span>
                <button
                  onClick={() => readAloudControls.setPageSounds(!readAloudState.pageSounds)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: readAloudState.pageSounds ? '#10B981' : '#E5E7EB',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: '2px',
                    left: readAloudState.pageSounds ? '22px' : '2px',
                    transition: 'all 200ms ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes xpPop {
          0% { transform: scale(0) rotate(-12deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(-6deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        /* Hide scrollbars for progress section */
        .top-bar div::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 640px) {
          .top-bar {
            padding: 0 12px !important;
            gap: 6px !important;
            height: 64px !important;
          }
        }
        
        @media (max-width: 480px) {
          .top-bar {
            padding: 0 8px !important;
            gap: 4px !important;
          }
        }
      `}</style>
    </div>
  );
};