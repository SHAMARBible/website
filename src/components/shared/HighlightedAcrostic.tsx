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
  referenceLabel?: string;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  tooltipAlign?: 'left' | 'right' | 'center';
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
  referenceLabel,
  onHoverEnter,
  onHoverLeave,
  tooltipAlign = 'center'
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  let currentLetterIdx = 0;
  return (
    <div
      className={`relative flex flex-col items-center transition-all duration-300 cursor-default bg-white/30 px-2 py-1.5 md:px-4 md:py-2 rounded-lg sm:rounded-xl border max-w-full ${
          isHovered ? 'border-orange-300 shadow-xl bg-white/90 scale-[1.05] z-[110]' :
          (isOriginActive || isPointerActive)
          ? 'border-orange-300 shadow-md bg-white/70 scale-[1.03] z-[100]'
          : 'border-white/50 shadow-sm opacity-70 hover:opacity-100 z-10'
        }`}
      onMouseEnter={() => { setIsHovered(true); onHoverEnter(); }}
      onMouseLeave={() => { setIsHovered(false); onHoverLeave(); }}
    >
      <div className="flex flex-col items-center mb-1 md:mb-2">
        <div className="flex items-center space-x-1 md:space-x-1.5">
          <span className="text-[7px] md:text-[9px] uppercase tracking-widest text-slate-500 font-semibold">{label}</span>
          {subLabel && (
            <span className="text-[6px] md:text-[8px] uppercase tracking-widest text-orange-500/90 font-bold">
              {subLabel}
            </span>
          )}
        </div>
        {referenceLabel && (
          <span className="text-[9px] md:text-[11px] uppercase tracking-widest text-slate-700 font-bold mt-0.5 md:mt-1 font-sans">
            {referenceLabel}
          </span>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-x-0.5 sm:gap-x-1 md:gap-x-1.5 text-[8px] md:text-xs font-serif text-slate-600 leading-tight">
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

              if (isPointer) {
                charClass += "text-orange-600 font-black border-b-[2px] border-orange-400 ";
                if (isPointerActive) {
                  charClass += "bg-orange-200 text-orange-900 scale-125 rounded shadow-sm z-30 px-[1px] md:px-0.5 -translate-y-[1px] ";
                }
              }
              else if (isOrigin) {
                if (isOriginActive) {
                  charClass += "text-orange-600 font-black bg-orange-200 text-orange-900 scale-125 rounded shadow-sm z-30 px-[1px] md:px-0.5 -translate-y-[1px] ";
                }
              }

              return (
                <span key={cIdx} className={charClass}>
                  {char}

                  {isPointer && isPointerActive && pointerTooltip && (
                    <span className={`absolute top-full w-0 flex justify-center z-50 ${
                      tooltipAlign === 'left' ? 'left-0 justify-start' : 
                      tooltipAlign === 'right' ? 'right-0 justify-end' : 
                      'left-1/2 justify-center'
                    }`}>
                      <span className={`mt-1 md:mt-2 whitespace-nowrap text-[7px] md:text-[9px] font-sans font-bold text-white bg-orange-500 px-1.5 md:px-2 py-0.5 rounded shadow-md pointer-events-none animate-fade-in-up ${
                        tooltipAlign === 'left' ? 'after:left-1' : 
                        tooltipAlign === 'right' ? 'after:right-1' : 
                        'left-1/2 -translate-x-1/2 after:left-1/2 after:-translate-x-1/2'
                      } after:content-[''] after:absolute after:bottom-full after:border-4 after:border-transparent after:border-b-orange-500`}>
                        {pointerTooltip}
                      </span>
                    </span>
                  )}
                  {isOrigin && isOriginActive && originTooltip && (
                    <span className={`absolute bottom-full w-0 flex justify-center z-50 ${
                      tooltipAlign === 'left' ? 'left-0 justify-start' : 
                      tooltipAlign === 'right' ? 'right-0 justify-end' : 
                      'left-1/2 justify-center'
                    }`}>
                      <span className={`mb-1 md:mb-2 whitespace-nowrap text-[7px] md:text-[9px] font-sans font-bold text-white bg-slate-700 px-1.5 md:px-2 py-0.5 rounded shadow-md pointer-events-none animate-fade-in-up ${
                        tooltipAlign === 'left' ? 'after:left-1' : 
                        tooltipAlign === 'right' ? 'after:right-1' : 
                        'left-1/2 -translate-x-1/2 after:left-1/2 after:-translate-x-1/2'
                      } after:content-[''] after:absolute after:top-full after:border-4 after:border-transparent after:border-t-slate-700`}>
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
