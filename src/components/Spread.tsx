import React, { useState, useCallback, useRef } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { WordHighlighter } from './WordHighlighter';
import { SpreadPage } from '@/data/storyPages';
import { speechRecognition, calculateReadingAccuracy, calculateWordAccuracies, analyzeTranscriptAttempts } from '@/lib/speechRecognition';

interface SpreadProps {
  page: SpreadPage;
  nextPage?: SpreadPage;
  isFlipping: boolean;
  flipDirection: 'next' | 'prev';
  highlightedWordIndex: number;
  pageNumber: number;
  totalPages: number;
  readOnlyMode?: boolean;
}

export const Spread: React.FC<SpreadProps> = ({
  page,
  nextPage,
  isFlipping,
  flipDirection,
  highlightedWordIndex,
  pageNumber,
  totalPages,
  readOnlyMode = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [readingAccuracy, setReadingAccuracy] = useState<number | null>(null);
  const [savedAccuracy, setSavedAccuracy] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [wordAccuracies, setWordAccuracies] = useState<boolean[]>([]);
  
  // Use useRef to avoid stale closure issues
  const accumulatedTranscriptRef = useRef('');
  const [accumulatedTranscript, setAccumulatedTranscript] = useState<string>('');

  const handleMicrophoneClick = useCallback(() => {
    if (readOnlyMode) {
      console.log('Microphone clicked in read-only mode');
      return;
    }

    if (!speechRecognition.isAvailable()) {
      setFeedbackMessage('Speech recognition not available in this browser');
      return;
    }

    if (isRecording) {
      // User manually stopped - stop everything and save accuracy
      speechRecognition.stop();
      setIsRecording(false);
      
      // Save the current accuracy score
      if (readingAccuracy !== null) {
        setSavedAccuracy(readingAccuracy);
        setFeedbackMessage(`Recording stopped. Accuracy: ${Math.round(readingAccuracy)}%. Click to start again.`);
      } else {
        setFeedbackMessage('Recording stopped. Click to start again.');
      }
      return;
    }

    // User started listening
    setIsRecording(true);
    setReadingAccuracy(null);
    setLiveTranscript('');
    setWordAccuracies([]);
    setFeedbackMessage('Listening... Please read the text aloud');

    speechRecognition.start({
      onInterimResult: (transcript) => {
        setLiveTranscript(transcript);
        // Use ref to get current accumulated transcript (avoid stale closure)
        const currentAccumulated = accumulatedTranscriptRef.current;
        const fullTranscript = currentAccumulated + (currentAccumulated ? ' ' : '') + transcript;
        const accuracies = calculateWordAccuracies(fullTranscript, page.right.text);
        setWordAccuracies(accuracies);
      },
      onResult: (result) => {
        // Use ref to get current accumulated transcript
        const currentAccumulated = accumulatedTranscriptRef.current;
        const newAccumulated = currentAccumulated + (currentAccumulated ? ' ' : '') + result.transcript;
        
        // Update both ref and state
        accumulatedTranscriptRef.current = newAccumulated;
        setAccumulatedTranscript(newAccumulated);
        setLiveTranscript(''); // Clear interim transcript
        
        // Calculate accuracy based on the full accumulated transcript
        const accuracy = calculateReadingAccuracy(newAccumulated, page.right.text);
        const wordAccuracies = calculateWordAccuracies(newAccumulated, page.right.text);
        
        setReadingAccuracy(accuracy);
        setWordAccuracies(wordAccuracies);
        
        if (accuracy >= 80) {
          setFeedbackMessage(`Great reading! Accuracy: ${Math.round(accuracy)}%`);
        } else if (accuracy >= 60) {
          setFeedbackMessage(`Good try! Accuracy: ${Math.round(accuracy)}%. Try again for better accuracy.`);
        } else {
          setFeedbackMessage(`Keep practicing! Accuracy: ${Math.round(accuracy)}%. Try reading more clearly.`);
        }
      },
      onError: (error) => {
        console.error('Speech recognition error:', error);
        setFeedbackMessage(`Error: ${error}`);
        setIsRecording(false);
        setLiveTranscript('');
      },
      onStart: () => {
        console.log('Speech recognition started');
        setIsRecording(true);
      },
      onEnd: () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
        // Provide feedback that recognition has stopped
        if (readingAccuracy !== null) {
          setSavedAccuracy(readingAccuracy);
          setFeedbackMessage(`Recording completed. Accuracy: ${Math.round(readingAccuracy)}%. Click to try again.`);
        } else {
          setFeedbackMessage('Recording stopped. Click to start again.');
        }
      },
      language: 'en-US'
    });
  }, [readOnlyMode, page.right.text, isRecording, readingAccuracy]);

  // Reset accumulated transcript when page changes
  React.useEffect(() => {
    accumulatedTranscriptRef.current = '';
    setAccumulatedTranscript('');
    setLiveTranscript('');
    setWordAccuracies([]);
    setReadingAccuracy(null);
    setSavedAccuracy(null); // Reset saved accuracy for new page
    setFeedbackMessage('');
    setIsRecording(false);
    
    // Stop any ongoing speech recognition
    speechRecognition.stop();
  }, [pageNumber]);

  // Component to render text with word-by-word color feedback
  const renderTextWithFeedback = (text: string, wordAccuracies: boolean[], isDropCap: boolean = false) => {
    const words = text.split(' ');
    
    return (
      <div>
        {words.map((word, index) => {
          const isFirstWord = index === 0 && isDropCap;
          const accuracy = wordAccuracies[index];
          const hasAccuracy = index < wordAccuracies.length;
          
          if (isFirstWord) {
            return (
              <React.Fragment key={index}>
                <span
                  style={{
                    float: 'left',
                    fontSize: '5.6em',
                    lineHeight: '0.75',
                    marginRight: '10px',
                    marginTop: '8px',
                    fontWeight: '500',
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    color: hasAccuracy 
                      ? accuracy 
                        ? '#065F46' // Green for correct
                        : '#991B1B' // Red for incorrect
                      : '#2d3748' // Default color
                  }}
                >
                  {word.charAt(0)}
                </span>
                <span
                  style={{
                    backgroundColor: hasAccuracy 
                      ? accuracy 
                        ? '#D1FAE5' // Light green background
                        : '#FEE2E2' // Light red background
                      : 'transparent',
                    color: hasAccuracy 
                      ? accuracy 
                        ? '#065F46' // Dark green text
                        : '#991B1B' // Dark red text
                      : 'inherit',
                    padding: hasAccuracy ? '2px 4px' : '0',
                    borderRadius: hasAccuracy ? '4px' : '0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {word.slice(1)}
                </span>
                {index < words.length - 1 && ' '}
              </React.Fragment>
            );
          }
          
          return (
            <React.Fragment key={index}>
              <span
                style={{
                  backgroundColor: hasAccuracy 
                    ? accuracy 
                      ? '#D1FAE5' // Light green background
                      : '#FEE2E2' // Light red background
                    : 'transparent',
                  color: hasAccuracy 
                    ? accuracy 
                      ? '#065F46' // Dark green text
                      : '#991B1B' // Dark red text
                    : 'inherit',
                  padding: hasAccuracy ? '2px 4px' : '0',
                  borderRadius: hasAccuracy ? '4px' : '0',
                  transition: 'all 0.3s ease'
                }}
              >
                {word}
              </span>
              {index < words.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Accuracy Score Display at Top */}
      {savedAccuracy !== null && (
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          backgroundColor: savedAccuracy >= 80 ? '#10B981' : savedAccuracy >= 60 ? '#F59E0B' : '#EF4444',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          Reading Accuracy: {Math.round(savedAccuracy)}%
        </div>
      )}
      
      <div 
        className="spread-container"
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          overflow: 'visible',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
      {/* Left Page - Illustration (Static) */}
      <div 
        className="left-page"
        style={{
          flex: '1',
          position: 'relative',
          background: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          borderRadius: '20px 0 0 20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 1,
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <img
          src={page.left.image}
          alt={page.left.alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '12px',
            border: '2px solid white',
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'block'
          }}
          loading="lazy"
          onLoad={(e) => {
            // Ensure image fills the container properly
            const img = e.target as HTMLImageElement;
            img.style.objectFit = 'cover';
          }}
        />
      </div>

      {/* Right Page Container - This is what flips */}
      <div
        className={`right-page-container ${isFlipping ? 'flipping' : ''}`}
        style={{
          flex: '1',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transformOrigin: 'left center',
          transform: isFlipping 
            ? flipDirection === 'next' 
              ? 'rotateY(-180deg)' 
              : 'rotateY(0deg)'
            : 'rotateY(0deg)',
          transition: isFlipping 
            ? 'transform 650ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
            : 'none',
          zIndex: isFlipping ? 10 : 2
        }}
      >
        {/* Current Right Page (Front Face) */}
        <div 
          className="right-page-front"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            background: `
              linear-gradient(135deg, #fafaf7 0%, #f8f8f5 100%),
              url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `,
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: '70px',
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            borderRadius: '0 20px 20px 0',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Page curl effect */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '20px',
              height: '20px',
              background: 'linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.1) 50%)',
              borderRadius: '0 0 20px 0'
            }}
          />

          {/* Text content */}
          <div 
            style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontSize: '26px',
              lineHeight: '1.7',
              color: '#1a202c',
              maxWidth: '40ch',
              textAlign: 'center',
              letterSpacing: '0.01em',
              fontWeight: '400'
            }}
          >
            {renderTextWithFeedback(page.right.text, wordAccuracies, page.right.dropCap)}
          </div>

          {/* Microphone and Transcription Side-by-Side Layout */}
          <div style={{ 
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', 
            alignItems: 'center',
            gap: '20px',
            zIndex: 10,
            width: '90%',
            maxWidth: '500px'
          }}>
            {/* Microphone Button */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              flexShrink: 0
            }}>
              {/* Feedback Message */}
              {feedbackMessage && (
                <div
                  style={{
                    marginBottom: '12px',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'center',
                    maxWidth: '200px',
                    backgroundColor: readingAccuracy !== null 
                      ? readingAccuracy >= 80 
                        ? '#D1FAE5' // Green background for high accuracy
                        : readingAccuracy >= 60
                        ? '#FEF3C7' // Yellow background for medium accuracy
                        : '#FEE2E2' // Red background for low accuracy
                      : '#F3F4F6', // Gray background for listening
                    color: readingAccuracy !== null 
                      ? readingAccuracy >= 80 
                        ? '#065F46' // Dark green text
                        : readingAccuracy >= 60
                        ? '#92400E' // Dark yellow text
                        : '#991B1B' // Dark red text
                      : '#374151', // Dark gray text
                    border: `2px solid ${
                      readingAccuracy !== null 
                        ? readingAccuracy >= 80 
                          ? '#10B981' // Green border
                          : readingAccuracy >= 60
                          ? '#F59E0B' // Yellow border
                          : '#EF4444' // Red border
                        : '#9CA3AF' // Gray border
                    }`
                  }}
                >
                  {feedbackMessage}
                </div>
              )}
              
              <button
                onClick={handleMicrophoneClick}
                disabled={false}
                className={`flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  readOnlyMode 
                    ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'
                    : isRecording
                    ? 'bg-sky-400 hover:bg-sky-500 focus:ring-sky-300'
                    : readingAccuracy !== null && readingAccuracy >= 80
                    ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300'
                    : 'bg-[#22C55E] hover:bg-[#1FAA4B] focus:ring-[#A7F3D0]'
                }`}
                aria-label={readOnlyMode ? "Read-only mode" : isRecording ? "Stop recording" : "Start voice recording"}
                title={readOnlyMode ? "Read-only mode" : isRecording ? "Stop recording" : "Start voice recording"}
              >
                {readOnlyMode ? (
                  <Mic className="w-6 h-6" />
                ) : isRecording ? (
                  <Square className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Live Transcription Display */}
            {(isRecording || liveTranscript || accumulatedTranscript) && (
              <div
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#F8FAFC',
                  border: '2px solid #E2E8F0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#64748B',
                  minHeight: '60px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  marginBottom: '6px', 
                  color: '#475569',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>
                    Transcription: 
                    {isRecording && (
                      <span style={{ color: '#3B82F6', marginLeft: '6px' }}>🎤</span>
                    )}
                  </span>
                </div>
                <div style={{ textAlign: 'left' }}>
                  {/* Show accumulated transcript in normal style */}
                  {accumulatedTranscript && (
                    <span style={{ fontStyle: 'normal', color: '#374151' }}>
                      {accumulatedTranscript}
                    </span>
                  )}
                  {/* Show current live transcript in italic */}
                  {liveTranscript && (
                    <span style={{ fontStyle: 'italic', color: '#64748B' }}>
                      {accumulatedTranscript ? ' ' : ''}{liveTranscript}
                    </span>
                  )}
                  {/* Show listening indicator if no transcript yet */}
                  {!accumulatedTranscript && !liveTranscript && isRecording && 'Listening...'}
                </div>
              </div>
            )}
          </div>

          {/* Page number */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '28px',
              fontSize: '14px',
              color: '#a0aec0',
              fontFamily: 'system-ui, sans-serif'
            }}
          >
            {pageNumber}
          </div>
        </div>

        {/* Next Right Page (Back Face) - Shows when flipping */}
        {nextPage && (
          <div 
            className="right-page-back"
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: `
                linear-gradient(135deg, #fafaf7 0%, #f8f8f5 100%),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
              `,
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: '60px',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              borderRadius: '0 20px 20px 0',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Page curl effect */}
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '20px',
                height: '20px',
                background: 'linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.1) 50%)',
                borderRadius: '0 0 20px 0'
              }}
            />

            {/* Next page text content */}
            <div 
              style={{
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontSize: '32px',
                lineHeight: '1.7',
                color: '#1a202c',
                maxWidth: '46ch',
                textAlign: 'center',
                letterSpacing: '0.01em',
                fontWeight: '400'
              }}
            >
              {nextPage.right.dropCap ? (
                <div>
                  <span
                    style={{
                      float: 'left',
                      fontSize: '5.6em',
                      lineHeight: '0.75',
                      marginRight: '10px',
                      marginTop: '8px',
                      fontWeight: '500',
                      color: '#2d3748',
                      fontFamily: '"Georgia", "Times New Roman", serif'
                    }}
                  >
                    {nextPage.right.text.charAt(0)}
                  </span>
                  <WordHighlighter
                    text={nextPage.right.text.slice(1)}
                    highlightedWordIndex={-1}
                  />
                </div>
              ) : (
                <WordHighlighter
                  text={nextPage.right.text}
                  highlightedWordIndex={-1}
                />
              )}
            </div>


            {/* Next page number */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '28px',
                fontSize: '14px',
                color: '#a0aec0',
                fontFamily: 'system-ui, sans-serif'
              }}
            >
              {pageNumber + 1}
            </div>
          </div>
        )}

        {/* Dynamic shadow during flip */}
        {isFlipping && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%, transparent 50%)',
              borderRadius: '0 20px 20px 0',
              pointerEvents: 'none',
              opacity: 0.6,
              zIndex: -1
            }}
          />
        )}
      </div>
    </div>
    </div>
  );
};