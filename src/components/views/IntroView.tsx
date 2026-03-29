import React, { useState } from 'react';
import { AcronymLetter } from '../shared/AcronymLetter';

export interface IntroViewProps {
  isActive: boolean;
}

export const IntroView: React.FC<IntroViewProps> = ({ isActive }) => {
  const [hoveredIntroNode, setHoveredIntroNode] = useState<string | null>(null);

  return (
    <div className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
      <div className="my-auto w-full flex flex-col items-center py-4">

        {/* Animated Acronym Spelled Out - with perfectly aligned negative margin to counteract gap */}
        <div className="flex items-end justify-center gap-3 md:gap-5 lg:gap-8 mb-6">
          <AcronymLetter letter="S" fullWord="Scripture" delayClass="delay-[100ms]" />
          <AcronymLetter letter="H" fullWord="Hierarchical" delayClass="delay-[300ms]" />
          <AcronymLetter letter="A" fullWord="Acrostic" delayClass="delay-[500ms]" />

          {/* Subtle "for" perfectly inserted using negative margins to swallow the gap padding */}
          <div className="flex flex-col justify-end pb-[2px] md:pb-1 opacity-0 animate-fade-in-up delay-[600ms] -mx-1.5 md:-mx-2.5 lg:-mx-4 z-10">
            <span className="text-sm md:text-base font-serif italic text-slate-400">for</span>
          </div>

          <AcronymLetter letter="M" fullWord="Mapping" delayClass="delay-[700ms]" />
          <AcronymLetter letter="A" fullWord="And" delayClass="delay-[900ms]" />
          <AcronymLetter letter="R" fullWord="Recall" delayClass="delay-[1100ms]" />
        </div>

        {/* Hebrew Definition Badge */}
        <div className="opacity-0 animate-fade-in-up delay-[1200ms] flex justify-center mb-10">
          <div className="px-5 py-2 md:py-2.5 bg-white/50 backdrop-blur-sm rounded-full border border-white/60 shadow-sm flex items-center space-x-2">
            <span className="font-serif italic text-orange-700 font-medium text-sm md:text-base">shâmar</span>
            <span className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">(Hebrew)</span>
            <span className="text-slate-300 mx-1">|</span>
            <span className="text-xs md:text-sm text-slate-600 font-medium tracking-wide">to guard, preserve, or keep</span>
          </div>
        </div>

        {/* Clean, Horizontal Hierarchical Node Tree */}
        <div className="relative flex flex-col items-center justify-center mb-6 opacity-0 animate-fade-in-up delay-[1400ms]">
          <div className="px-5 py-1.5 bg-white/40 backdrop-blur-sm border border-slate-200/50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm z-10">The Bible</div>
          <div className="w-px h-5 md:h-6 bg-slate-300"></div>

          <div className="flex flex-row items-center">
            <div className="relative flex flex-col items-center" onMouseEnter={() => setHoveredIntroNode('testament')} onMouseLeave={() => setHoveredIntroNode(null)}>
              <div className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-full text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-widest shadow-sm z-10 cursor-default transition-colors hover:border-orange-300">Testament</div>
              <span className={`absolute top-full mt-1.5 text-[9px] md:text-[11px] font-serif font-bold text-orange-600 transition-all duration-300 whitespace-nowrap pointer-events-none ${hoveredIntroNode === 'testament' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>New Testament</span>
            </div>

            <div className="h-px w-3 md:w-6 lg:w-10 bg-orange-300/80"></div>

            <div className="relative flex flex-col items-center" onMouseEnter={() => setHoveredIntroNode('book')} onMouseLeave={() => setHoveredIntroNode(null)}>
              <div className="px-4 py-2 bg-orange-50/80 backdrop-blur-sm border border-orange-200 rounded-full text-[10px] md:text-sm font-bold text-orange-700 uppercase tracking-widest shadow-sm z-10 cursor-default transition-colors hover:border-orange-400">Book</div>
              <span className={`absolute top-full mt-1.5 text-[9px] md:text-[11px] font-serif font-bold text-orange-600 transition-all duration-300 whitespace-nowrap pointer-events-none ${hoveredIntroNode === 'book' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>John</span>
            </div>

            <div className="h-px w-3 md:w-6 lg:w-10 bg-orange-400"></div>

            <div className="relative flex flex-col items-center" onMouseEnter={() => setHoveredIntroNode('chapter')} onMouseLeave={() => setHoveredIntroNode(null)}>
              <div className="px-5 py-2 md:py-2.5 bg-orange-400 text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-widest shadow-md z-10 cursor-default transition-transform hover:scale-105">Chapter</div>
              <span className={`absolute top-full mt-1.5 text-[9px] md:text-[11px] font-serif font-bold text-orange-600 transition-all duration-300 whitespace-nowrap pointer-events-none ${hoveredIntroNode === 'chapter' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>3</span>
            </div>

            <div className="h-px w-3 md:w-6 lg:w-10 bg-rose-400"></div>

            <div className="relative flex flex-col items-center" onMouseEnter={() => setHoveredIntroNode('verse')} onMouseLeave={() => setHoveredIntroNode(null)}>
              <div className="px-6 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full text-sm md:text-base font-bold uppercase tracking-widest shadow-lg shadow-orange-500/30 z-10 cursor-default transition-transform hover:scale-105">Verse</div>
              <span className={`absolute top-full mt-1.5 text-[9px] md:text-[11px] font-serif font-bold text-orange-600 transition-all duration-300 whitespace-nowrap pointer-events-none ${hoveredIntroNode === 'verse' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>16</span>
            </div>
          </div>
        </div>

        {/* Explanation text */}
        <div className="max-w-3xl opacity-0 animate-fade-in-up delay-[1600ms] mb-8 px-4 text-center">
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed bg-white/30 p-4 rounded-xl border border-white/50 shadow-sm backdrop-blur-sm">
            The SHAMAR system uses nested acrostics to map the hierarchical structure of Scripture. By memorizing a continuous chain of phrases, you can mentally drill down from a whole Testament into the exact wording of a single verse.
          </p>
        </div>

      </div>
    </div>
  );
};
