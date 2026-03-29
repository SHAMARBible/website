import React from 'react';

interface AcronymLetterProps {
  letter: string;
  fullWord: string;
  delayClass: string;
}

export const AcronymLetter: React.FC<AcronymLetterProps> = ({ letter, fullWord, delayClass }) => (
  <div className={`flex flex-col items-center opacity-0 animate-fade-in-up ${delayClass}`}>
    <span className="text-[2.5rem] leading-none sm:text-6xl md:text-7xl lg:text-[7.5rem] font-serif font-bold text-orange-600 drop-shadow-sm mb-0 sm:mb-2 md:mb-1">
      {letter}
    </span>
    {/* Full word with first letter bolded & orange to emphasize the connection */}
    <span className="text-[9px] sm:text-xs md:text-base lg:text-xl font-medium tracking-widest text-slate-500 uppercase flex items-baseline mt-1 sm:mt-0">
      <strong className="text-orange-600 text-[11px] sm:text-sm md:text-lg lg:text-2xl mr-px font-bold">{fullWord.charAt(0)}</strong>
      {fullWord.slice(1)}
    </span>
  </div>
);
