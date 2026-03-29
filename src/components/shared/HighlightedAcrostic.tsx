import React from 'react';

export interface HighlightedAcrosticProps {
  text: string;
  pointerIndex: number;
  pointerTooltip?: string;
  isPointerActive: boolean;
  originIndex?: number;
  originTooltip?: string;
  isOriginActive?: boolean;
  label: string;
  subLabel?: string;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}

export const HighlightedAcrostic: React.FC<HighlightedAcrosticProps> = ({
  text,
  pointerIndex,
  pointerTooltip,
  isPointerActive,
  originIndex,
  originTooltip,
  isOriginActive,
  label,
  subLabel,
  onHoverEnter,
  onHoverLeave
}) => {
  let currentLetterIdx = 0;
  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-300 cursor-default bg-white/30 px-3 py-2 md:px-4 rounded-xl border max-w-full ${(isOriginActive || isPointerActive)
          ? 'border-orange-300 shadow-md bg-white/70 scale-[1.03] z-10'
          : 'border-white/50 shadow-sm opacity-70 hover:opacity-100'
        }`}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      <div className="flex items-center space-x-1.5 mb-1.5">
        <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-slate-500 font-semibold">{label}</span>
        {subLabel && (
          <span className="text-[7px] md:text-[8px] uppercase tracking-widest text-orange-500/90 font-bold">
            {subLabel}
          </span>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-x-1.5 text-[10px] md:text-xs font-serif text-slate-600">
        {text.split(' ').map((word, wIdx) => (
          <span key={wIdx} className="flex">
            {word.split('').map((char, cIdx) => {
              const isLetter = /[A-Za-z]/.test(char);
              if (isLetter) {
                currentLetterIdx++;
              }

              const isPointer = isLetter && currentLetterIdx === pointerIndex;
              const isOrigin = isLetter && currentLetterIdx === originIndex;

              let charClass = "relative inline-flex justify-center items-center transition-all duration-300 ";

              // Pointer (Downward link) styling
              if (isPointer) {
                charClass += "text-orange-600 font-black border-b-[2px] border-orange-400 ";
                if (isPointerActive) {
                  charClass += "bg-orange-200 text-orange-900 scale-125 rounded shadow-sm z-30 px-0.5 -translate-y-[1px] ";
                }
              }
              // Origin (Upward link) styling
              else if (isOrigin) {
                if (isOriginActive) {
                  charClass += "text-orange-600 font-black bg-orange-200 text-orange-900 scale-125 rounded shadow-sm z-30 px-0.5 -translate-y-[1px] ";
                }
              }

              return (
                <span key={cIdx} className={charClass}>
                  {char}

                  {/* Pointer Tooltip (Shows Below) */}
                  {isPointer && isPointerActive && pointerTooltip && (
                    <span className="absolute top-full left-1/2 w-0 flex justify-center z-50">
                      <span className="mt-2 whitespace-nowrap text-[8px] md:text-[9px] font-sans font-bold text-white bg-orange-500 px-2 py-0.5 rounded shadow-md pointer-events-none after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-orange-500 animate-fade-in-up">
                        {pointerTooltip}
                      </span>
                    </span>
                  )}
                  {/* Origin Tooltip (Shows Above) */}
                  {isOrigin && isOriginActive && originTooltip && (
                    <span className="absolute bottom-full left-1/2 w-0 flex justify-center z-50">
                      <span className="mb-2 whitespace-nowrap text-[8px] md:text-[9px] font-sans font-bold text-white bg-slate-700 px-2 py-0.5 rounded shadow-md pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-700 animate-fade-in-up">
                        {originTooltip}
                      </span>
                    </span>
                  )}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
};
