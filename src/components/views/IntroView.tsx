import React, { useState } from 'react';
import { AcronymLetter } from '../shared/AcronymLetter';

export interface IntroViewProps {
  isActive: boolean;
  setExplorationMode: (mode: boolean) => void;
  goToStep: (index: number) => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ isActive, setExplorationMode, goToStep }) => {
  const [hoveredIntroNode, setHoveredIntroNode] = useState<string | null>(null);

  return (
    <div className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
      <div className="my-auto w-full flex flex-col items-center py-1 sm:py-2 md:py-4">

        <div className="flex items-end justify-center gap-1 sm:gap-3 md:gap-5 lg:gap-8 mb-2 sm:mb-3 md:mb-4 lg:mb-5">
          <AcronymLetter letter="S" fullWord="Scripture" delayClass="delay-100" />
          <AcronymLetter letter="H" fullWord="Hierarchical" delayClass="delay-300" />
          <AcronymLetter letter="A" fullWord="Acrostic" delayClass="delay-500" />

        <div className="flex flex-col justify-end pb-px md:pb-1 opacity-0 animate-fade-in-up delay-600 -mx-1 sm:-mx-1.5 md:-mx-2.5 lg:-mx-4 z-10">
            <span className="text-[9px] sm:text-xs md:text-base lg:text-2xl font-serif italic text-slate-400">for</span>
          </div>

          <AcronymLetter letter="M" fullWord="Mapping" delayClass="delay-700" />
          <AcronymLetter letter="A" fullWord="And" delayClass="delay-900" />
          <AcronymLetter letter="R" fullWord="Recall" delayClass="delay-1100" />
        </div>

        <div className="opacity-0 animate-fade-in-up delay-1200 flex justify-center mb-3 sm:mb-5 md:mb-6">
          <div className="px-2 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 bg-white/50 backdrop-blur-sm rounded-full border border-white/60 shadow-sm flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <span className="font-serif italic text-orange-700 font-medium text-[10px] sm:text-xs md:text-xl lg:text-2xl">shâmar</span>
            <span className="text-[6px] sm:text-[8px] md:text-xs lg:text-sm text-slate-500 uppercase tracking-widest font-bold mt-0.5">(Hebrew)</span>
            <span className="text-slate-300 mx-0.5 sm:mx-1 md:mx-1.5 md:text-xl lg:text-2xl">|</span>
            <span className="text-[8px] sm:text-[10px] md:text-base lg:text-xl text-slate-600 font-medium tracking-wide">to guard, preserve, or keep</span>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center mb-4 sm:mb-5 md:mb-10 lg:mb-12 opacity-0 animate-fade-in-up delay-1400">
          <div className="px-2 py-0.5 md:px-6 md:py-2 bg-white/40 backdrop-blur-sm border border-slate-200/50 rounded-full text-[7px] md:text-sm font-bold text-slate-500 uppercase tracking-widest shadow-sm z-10">The Bible</div>
          <div className="w-px h-3 sm:h-4 md:h-8 bg-slate-300"></div>

          <div className="flex flex-row items-center">
            <div className="relative flex flex-col items-center" onMouseEnter={() => setHoveredIntroNode('testament')} onMouseLeave={() => setHoveredIntroNode(null)}>
              <div className="px-1.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-full text-[7px] sm:text-[9px] md:text-sm font-bold text-slate-600 uppercase tracking-widest shadow-sm z-10 cursor-default transition-colors hover:border-orange-300">Testament</div>
              <span className={`absolute top-1/2 mt-3 sm:mt-4 md:mt-7 lg:mt-9 text-[9px] sm:text-xs md:text-base lg:text-xl font-serif font-bold text-orange-600 transition-all duration-300 whitespace-nowrap pointer-events-none ${hoveredIntroNode === 'testament' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>New Testament</span>
            </div>

            <div className="h-px w-2 sm:w-3 md:w-6 lg:w-8 bg-orange-300/80"></div>

            <div className="relative flex flex-col items-center" onMouseEnter={() => setHoveredIntroNode('book')} onMouseLeave={() => setHoveredIntroNode(null)}>
              <div className="px-1.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-orange-50/80 backdrop-blur-sm border border-orange-200 rounded-full text-[7px] sm:text-[9px] md:text-base font-bold text-orange-700 uppercase tracking-widest shadow-sm z-10 cursor-default transition-colors hover:border-orange-400">Book</div>
              <span className={`absolute top-1/2 mt-3 sm:mt-4 md:mt-7 lg:mt-9 text-[9px] sm:text-xs md:text-base lg:text-xl font-serif font-bold text-orange-600 transition-all duration-300 whitespace-nowrap pointer-events-none ${hoveredIntroNode === 'book' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>John</span>
            </div>

            <div className="h-px w-2 sm:w-3 md:w-6 lg:w-8 bg-orange-400"></div>

            <div className="relative flex flex-col items-center" onMouseEnter={() => setHoveredIntroNode('chapter')} onMouseLeave={() => setHoveredIntroNode(null)}>
              <div className="px-2 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-orange-400 text-white rounded-full text-[8px] sm:text-[10px] md:text-lg font-bold uppercase tracking-widest shadow-md z-10 cursor-default transition-transform hover:scale-105">Chapter</div>
              <span className={`absolute top-1/2 mt-3 sm:mt-4 md:mt-7 lg:mt-9 text-[9px] sm:text-xs md:text-base lg:text-xl font-serif font-bold text-orange-600 transition-all duration-300 whitespace-nowrap pointer-events-none ${hoveredIntroNode === 'chapter' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>3</span>
            </div>

            <div className="h-px w-2 sm:w-3 md:w-6 lg:w-8 bg-rose-400"></div>

            <div className="relative flex flex-col items-center" onMouseEnter={() => setHoveredIntroNode('verse')} onMouseLeave={() => setHoveredIntroNode(null)}>
              <div className="px-2.5 py-1.5 sm:px-5 sm:py-2 md:px-8 md:py-4 bg-linear-to-r from-orange-500 to-rose-500 text-white rounded-full text-[9px] sm:text-xs md:text-2xl font-bold uppercase tracking-widest shadow-lg shadow-orange-500/30 z-10 cursor-default transition-transform hover:scale-105">Verse</div>
              <span className={`absolute top-1/2 mt-3 sm:mt-4 md:mt-7 lg:mt-9 text-[9px] sm:text-xs md:text-base lg:text-xl font-serif font-bold text-orange-600 transition-all duration-300 whitespace-nowrap pointer-events-none ${hoveredIntroNode === 'verse' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>16</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl w-full opacity-0 animate-fade-in-up delay-1600 mb-2 sm:mb-3 md:mb-4 px-2 md:px-6 text-center">
          <p className="text-[10px] sm:text-xs md:text-xl text-slate-600 font-medium leading-normal sm:leading-relaxed bg-white/30 p-2 sm:p-3 md:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-white/50 shadow-sm backdrop-blur-sm">
            The SHAMAR system uses nested acrostics to map the hierarchical structure of Scripture. By memorizing a continuous chain of phrases, you can mentally drill down from a whole Testament into the exact wording of a single verse.
          </p>

          <div className="mt-4 md:mt-8 flex justify-center">
            <button 
              onClick={() => {
                setExplorationMode(true);
                goToStep(1);
              }}
              className="text-xs md:text-base font-bold text-orange-600 border border-orange-300 bg-white/50 hover:bg-orange-100 hover:text-orange-700 rounded-full px-6 py-2 transition-all shadow-sm"
            >
              How this works (Explorer Mode)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
