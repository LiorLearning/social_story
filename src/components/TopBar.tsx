import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Play, Pause, ChevronDown, Volume2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReadAloudState, ReadAloudControls } from './ReadAloudEngine';

interface TopBarProps {
  onBack: () => void;
  currentPage: number;
  totalPages: number;
  readAloudState: ReadAloudState;
  readAloudControls: ReadAloudControls;
}

export const TopBar: React.FC<TopBarProps> = ({
  onBack,
  currentPage,
  totalPages,
  readAloudState,
  readAloudControls
}) => {
  const [showListenMenu, setShowListenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowListenMenu(false);
      }
    };

    if (showListenMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showListenMenu]);

  // Close menu on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowListenMenu(false);
      }
    };

    if (showListenMenu) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showListenMenu]);

  const handleListenClick = () => {
    if (readAloudState.isPlaying) {
      readAloudControls.pause();
    } else {
      readAloudControls.play();
    }
  };

  const progressDots = Array.from({ length: totalPages }, (_, i) => (
    <div
      key={i}
      className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
        i === currentPage - 1 ? 'bg-white' : 'bg-white/30'
      }`}
    />
  ));

  return (
    <div 
      className="top-bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}
    >
      {/* Left: Back button */}
      <Button
        onClick={onBack}
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/10 focus:ring-white/20"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* Center: Page counter and progress dots */}
      <div className="flex items-center gap-4">
        <span className="text-white font-medium">
          {currentPage}/{totalPages}
        </span>
        <div className="flex items-center gap-1">
          {progressDots}
        </div>
      </div>

      {/* Right: Listen button with menu */}
      <div className="relative" ref={menuRef}>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleListenClick}
            disabled={!readAloudState.isSupported}
            className="bg-[#22C55E] hover:bg-[#1FAA4B] text-white font-medium px-4 py-2 rounded-full focus:ring-[#A7F3D0]"
            aria-label={readAloudState.isPlaying ? "Pause read-aloud" : "Play read-aloud"}
          >
            {readAloudState.isPlaying ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Listen
          </Button>
          
          <Button
            onClick={() => setShowListenMenu(!showListenMenu)}
            disabled={!readAloudState.isSupported}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 focus:ring-white/20 p-1"
            aria-label="Listen settings"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Listen Menu Dropdown */}
        {showListenMenu && (
          <div
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
            style={{ animation: 'fadeIn 150ms ease-out' }}
          >
            {/* Voice Selection */}
            <div className="px-4 py-2 border-b border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice
              </label>
              <select
                value={readAloudState.selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = readAloudState.voices.find(v => v.name === e.target.value);
                  if (voice) readAloudControls.setVoice(voice);
                }}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {readAloudState.voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Speed Selection */}
            <div className="px-4 py-2 border-b border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed
              </label>
              <div className="flex gap-2">
                {[0.8, 1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => readAloudControls.setSpeed(speed)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      readAloudState.speed === speed
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Auto page turn</span>
                <button
                  onClick={() => readAloudControls.setAutoPageTurn(!readAloudState.autoPageTurn)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    readAloudState.autoPageTurn ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      readAloudState.autoPageTurn ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Page flip sound</span>
                <button
                  onClick={() => readAloudControls.setPageSounds(!readAloudState.pageSounds)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    readAloudState.pageSounds ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      readAloudState.pageSounds ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};


