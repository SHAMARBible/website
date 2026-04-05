import React, { useState } from 'react';
import { BIBLE_BOOKS, BIBLE_BOOK_ORDER } from '../../data/metadata/bibleBooks';

export interface OriginHighlight {
  isActive: boolean;
  tooltip?: string;
}

export interface InteractiveAcrosticProps {
  text: string;
  hoverType: 'testament' | 'testament-card' | 'book' | 'chapter';
  startIdxOffset?: number;
  originHighlight?: OriginHighlight | null;
  naked?: boolean;
  textClass?: string;
  justifyClass?: string;
  onHoverChange?: (idx: number | null) => void;
  externalHoverIdx?: number | null;
  onAcrosticClick?: (idx: number) => void;
  interactiveClass?: string;
}

export const InteractiveAcrostic: React.FC<InteractiveAcrosticProps> = ({
  text,
  hoverType,
  startIdxOffset = 0,
  originHighlight = null,
  naked = false,
  textClass = "text-[1.1rem] leading-none sm:text-xl md:text-3xl lg:text-4xl font-serif text-slate-800 tracking-wide font-medium",
  justifyClass = "justify-center",
  onHoverChange,
  externalHoverIdx = null,
  onAcrosticClick,
  interactiveClass = ""
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sections = text.split(',');
  const totalLetters = text.replace(/[^A-Za-z]/g, '').length;
  let globalLetterIdx = 0;

  const content = (
    <>
      {sections.map((section, sIdx) => (
        <React.Fragment key={sIdx}>
          {sIdx > 0 && <span className="text-orange-300/60 font-light text-xl sm:text-2xl md:text-4xl mx-0.5 sm:mx-1 md:mx-3 select-none">|</span>}
          <div className="flex flex-wrap justify-center gap-x-0.5 sm:gap-x-1 md:gap-x-3 gap-y-3 sm:gap-y-4 md:gap-y-6">
            {section.trim().split(' ').map((word, wIdx) => (
              <span key={wIdx} className={`flex ${textClass}`}>
                {word.split('').map((char, cIdx) => {
                  const isLetter = /[A-Za-z]/.test(char);
                  if (isLetter) globalLetterIdx++;

                  const currentGlobalIdx = globalLetterIdx + startIdxOffset;
                  const isFirstLetter = isLetter && globalLetterIdx === 1;
                  const showOrigin = isFirstLetter && originHighlight?.isActive;
                  const isHovered = hoveredIdx === currentGlobalIdx || externalHoverIdx === currentGlobalIdx;

                  let subText = "";
                  if (hoverType === 'testament') {
                    const bookId = BIBLE_BOOK_ORDER[currentGlobalIdx - 1];
                    subText = bookId ? BIBLE_BOOKS[bookId].name : `Bk ${currentGlobalIdx}`;
                  }
                  else if (hoverType === 'book') subText = `Ch ${currentGlobalIdx}`;
                  else if (hoverType === 'chapter') subText = `Vs ${currentGlobalIdx}`;

                  return (
                    <span
                      key={cIdx}
                      className={`relative inline-flex flex-col items-center justify-center ${interactiveClass}`}
                      onMouseEnter={() => {
                        if (isLetter) {
                          setHoveredIdx(currentGlobalIdx);
                          if (onHoverChange) onHoverChange(currentGlobalIdx);
                        }
                      }}
                      onMouseLeave={() => {
                        if (isLetter) {
                          setHoveredIdx(null);
                          if (onHoverChange) onHoverChange(null);
                        }
                      }}
                      onClick={() => {
                        if (isLetter && onAcrosticClick) {
                            onAcrosticClick(currentGlobalIdx);
                        }
                      }}
                    >
                      <span className={`relative transition-all duration-300 ${showOrigin ? 'text-orange-600 scale-125 drop-shadow-md bg-orange-200 text-orange-900 px-[1px] md:px-1.5 rounded -translate-y-1 z-30 font-bold'
                          : isHovered ? 'text-orange-600 scale-125 -translate-y-1 drop-shadow-md z-20 font-bold'
                            : 'hover:text-orange-600'
                        }`}>
                        {char}

                        {showOrigin && originHighlight?.tooltip && !isHovered && (
                          <span className="absolute bottom-full left-1/2 w-0 flex justify-center z-50">
                            <span className="mb-2 md:mb-3 whitespace-nowrap text-[8px] md:text-[10px] font-sans font-bold text-white bg-slate-700 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded shadow-md pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-700 animate-fade-in-up tracking-wider">
                              {originHighlight.tooltip}
                            </span>
                          </span>
                        )}
                      </span>

                      {isLetter && subText && (
                        <span className={`absolute top-full mt-0.5 sm:mt-1 md:mt-2 text-[6px] sm:text-[7px] md:text-[9px] font-sans font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 pointer-events-none ${isHovered ? 'opacity-100 text-orange-600 translate-y-0' : 'opacity-0 text-slate-400 -translate-y-1'
                          }`}>
                          {subText}
                        </span>
                      )}
                    </span>
                  );
                })}
              </span>
            ))}
          </div>
        </React.Fragment>
      ))}
    </>
  );

  if (naked) {
    return <div className={`flex flex-wrap items-center gap-y-2 sm:gap-y-4 md:gap-y-6 ${justifyClass}`}>{content}</div>;
  }

  return (
    <div className="flex justify-center w-full relative pt-2 sm:pt-3">
      <div className="relative flex flex-wrap justify-center items-center w-full gap-x-1 sm:gap-x-3 gap-y-2 sm:gap-y-3 bg-white/40 px-3 pt-4 sm:pt-5 pb-3 sm:pb-4 md:px-10 md:pt-6 md:pb-5 rounded-xl sm:rounded-3xl border border-white/60 shadow-sm backdrop-blur-md max-w-5xl">
        <div className="absolute -top-2 sm:-top-2.5 md:-top-3 left-1/2 -translate-x-1/2 pointer-events-none z-10 mt-0.5">
          <span className="flex items-center px-2 py-0.5 sm:px-3 sm:py-1 shadow-sm rounded-full border border-orange-100 bg-white/90 text-orange-700 text-[7px] sm:text-[9px] md:text-[11px] tracking-widest font-bold uppercase whitespace-nowrap">
            {totalLetters} Letters
          </span>
        </div>
        {content}
      </div>
    </div>
  );
};
