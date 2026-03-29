import React, { useState } from 'react';
import { ntBooksArray } from '../../data/shamarData';

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
}

export const InteractiveAcrostic: React.FC<InteractiveAcrosticProps> = ({
  text,
  hoverType,
  startIdxOffset = 0,
  originHighlight = null,
  naked = false,
  textClass = "text-2xl md:text-3xl lg:text-4xl font-serif text-slate-800 tracking-wide font-medium",
  justifyClass = "justify-center",
  onHoverChange,
  externalHoverIdx = null
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sections = text.split(',');
  const totalLetters = text.replace(/[^A-Za-z]/g, '').length;
  let globalLetterIdx = 0;

  const content = (
    <>
      {sections.map((section, sIdx) => (
        <React.Fragment key={sIdx}>
          {sIdx > 0 && <span className="text-orange-300/60 font-light text-2xl md:text-4xl mx-1 md:mx-3 select-none">|</span>}
          <div className="flex flex-wrap justify-center gap-x-2 md:gap-x-3 gap-y-6">
            {section.trim().split(' ').map((word, wIdx) => (
              <span key={wIdx} className={`flex ${textClass}`}>
                {word.split('').map((char, cIdx) => {
                  const isLetter = /[A-Za-z]/.test(char);
                  if (isLetter) globalLetterIdx++;

                  const currentGlobalIdx = globalLetterIdx + startIdxOffset;
                  const isFirstLetter = isLetter && globalLetterIdx === 1;
                  const showOrigin = isFirstLetter && originHighlight?.isActive;
                  const isHovered = hoveredIdx === currentGlobalIdx || externalHoverIdx === currentGlobalIdx;

                  // Determine what text to show below the letter when hovered
                  let subText = "";
                  if (hoverType === 'testament') subText = ntBooksArray[currentGlobalIdx - 1];
                  else if (hoverType === 'book') subText = `Ch ${currentGlobalIdx}`;
                  else if (hoverType === 'chapter') subText = `Vs ${currentGlobalIdx}`;

                  return (
                    <span
                      key={cIdx}
                      className="relative inline-flex flex-col items-center justify-center cursor-default"
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
                    >
                      <span className={`relative transition-all duration-300 ${showOrigin ? 'text-orange-600 scale-125 drop-shadow-md bg-orange-200 text-orange-900 px-1.5 rounded -translate-y-1 z-30 font-bold'
                          : isHovered ? 'text-orange-600 scale-125 -translate-y-1 drop-shadow-md z-20 font-bold'
                            : 'hover:text-orange-600'
                        }`}>
                        {char}

                        {/* Origin Upward Tooltip */}
                        {showOrigin && originHighlight?.tooltip && !isHovered && (
                          <span className="absolute bottom-full left-1/2 w-0 flex justify-center z-50">
                            <span className="mb-3 whitespace-nowrap text-[9px] md:text-[10px] font-sans font-bold text-white bg-slate-700 px-2.5 py-1 rounded shadow-md pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-700 animate-fade-in-up tracking-wider">
                              {originHighlight.tooltip}
                            </span>
                          </span>
                        )}
                      </span>

                      {/* Interactive Subword Tooltip */}
                      {isLetter && subText && (
                        <span className={`absolute top-full mt-1 md:mt-2 text-[8px] md:text-[9px] font-sans font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 pointer-events-none ${isHovered ? 'opacity-100 text-orange-600 translate-y-0' : 'opacity-0 text-slate-400 -translate-y-1'
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
    return <div className={`flex flex-wrap items-center gap-y-6 ${justifyClass}`}>{content}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full">
      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-3 bg-white/40 px-6 pt-5 pb-8 md:px-10 md:pt-6 md:pb-10 rounded-3xl border border-white/60 shadow-sm backdrop-blur-md max-w-5xl">
        {content}
      </div>
      <div className="px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50/70 text-orange-800 text-xs tracking-widest font-semibold uppercase shadow-sm">
        {totalLetters} Letters
      </div>
    </div>
  );
};
