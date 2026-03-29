import React from 'react';

interface AcronymLetterProps {
  letter: string;
  fullWord: string;
  delayClass: string;
}

export const AcronymLetter: React.FC<AcronymLetterProps> = ({ letter, fullWord, delayClass }) => (
  <div className={`flex flex-col items-center opacity-0 animate-fade-in-up ${delayClass}`}>
    <span className="text-5xl md:text-7xl font-serif font-bold text-orange-600 drop-shadow-sm mb-2 md:mb-3 leading-none">
      {letter}
    </span>
    {/* Full word with first letter bolded & orange to emphasize the connection */}
    <span className="text-xs md:text-sm font-medium tracking-widest text-slate-500 uppercase flex items-baseline">
      <strong className="text-orange-600 text-sm md:text-base mr-[1px] font-bold">{fullWord.charAt(0)}</strong>
      {fullWord.slice(1)}
    </span>
  </div>
);
