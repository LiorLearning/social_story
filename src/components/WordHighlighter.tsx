import React from 'react';

interface WordHighlighterProps {
  text: string;
  highlightedWordIndex: number;
  className?: string;
}

export const WordHighlighter: React.FC<WordHighlighterProps> = ({
  text,
  highlightedWordIndex,
  className = ''
}) => {
  const words = text.split(/(\s+)/).filter(part => part.length > 0);
  let wordIndex = 0;

  return (
    <div className={className}>
      {words.map((part, index) => {
        const isWord = /\S/.test(part);
        
        if (isWord) {
          const isHighlighted = wordIndex === highlightedWordIndex;
          const currentWordIndex = wordIndex;
          wordIndex++;
          
          return (
            <span
              key={index}
              className={
                isHighlighted 
                  ? 'bg-yellow-200 rounded px-1 transition-colors duration-200' 
                  : ''
              }
              data-word-index={currentWordIndex}
            >
              {part}
            </span>
          );
        }
        
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};



