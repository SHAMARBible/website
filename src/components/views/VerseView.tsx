import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { HighlightedAcrostic } from '../shared/HighlightedAcrostic';
import { shamarData, fullTestamentAcrostic } from '../../data/shamarData';

export interface VerseViewProps {
  isActive: boolean;
  showAcrosticBreadcrumbs: boolean;
  hoveredLevel: string | null;
  setHoveredLevel: (level: string | null) => void;
}

export const VerseView: React.FC<VerseViewProps> = ({ isActive, showAcrosticBreadcrumbs, hoveredLevel, setHoveredLevel }) => {
  const [hoveredVerseIndex, setHoveredVerseIndex] = useState<number | null>(null);

  return (
    <div className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="my-auto w-full flex flex-col items-center py-2 sm:py-3 md:py-4 max-w-[1400px] mx-auto px-2 sm:px-4">
        {showAcrosticBreadcrumbs && (
          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-4 md:mb-6 animate-fade-in-up w-full max-w-[1400px]">
            <HighlightedAcrostic
              text={fullTestamentAcrostic}
              pointerIndex={27} pointerTooltip="Y ➔ Revelation" isPointerActive={hoveredLevel === 'testament'}
              label="Testament Acrostic" subLabel={`(${shamarData.testament.bookCount} Books)`}
              onHoverEnter={() => setHoveredLevel('testament')} onHoverLeave={() => setHoveredLevel(null)}
            />
            <ChevronRight className={`hidden lg:block w-3.5 h-3.5 transition-colors duration-300 ${hoveredLevel === 'testament' ? 'text-orange-500 scale-125' : 'text-orange-300/80'}`} />

            <HighlightedAcrostic
              text={shamarData.book.acrostic}
              originIndex={1} originTooltip="Y ⟵ 27th Book" isOriginActive={hoveredLevel === 'testament'}
              pointerIndex={2} pointerTooltip="E ➔ Chapter 2" isPointerActive={hoveredLevel === 'book'}
              label="Book Acrostic" subLabel={`(${shamarData.book.chapters} Chapters)`}
              onHoverEnter={() => setHoveredLevel('book')} onHoverLeave={() => setHoveredLevel(null)}
            />
            <ChevronRight className={`hidden lg:block w-3.5 h-3.5 transition-colors duration-300 ${hoveredLevel === 'book' ? 'text-orange-500 scale-125' : 'text-orange-300/80'}`} />

            <HighlightedAcrostic
              text={shamarData.chapter.acrostic}
              originIndex={1} originTooltip="E ⟵ Chapter 2" isOriginActive={hoveredLevel === 'book'}
              pointerIndex={10} pointerTooltip="Y ➔ Verse 10" isPointerActive={hoveredLevel === 'chapter'}
              label="Chapter Acrostic" subLabel={`(${shamarData.chapter.verses} Verses)`}
              onHoverEnter={() => setHoveredLevel('chapter')} onHoverLeave={() => setHoveredLevel(null)}
            />
          </div>
        )}
        <h3 className="text-slate-500 uppercase tracking-widest mb-0.5 font-semibold text-[10px] md:text-[11px]">Verse Level</h3>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-2 md:mb-4 text-slate-800 text-center">{shamarData.target}</h2>

        {/* Subtle Acrostic Word Display */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 mb-2 md:mb-4 lg:mb-6">
          {shamarData.verse.subwords.map((item, idx) => {
            const isVerseOriginActive = hoveredLevel === 'chapter' && idx === 0;
            const isHovered = hoveredVerseIndex === idx;
            const isFaded = hoveredVerseIndex !== null && hoveredVerseIndex !== idx;

            return (
              <div
                key={idx}
                className={`relative flex flex-col items-center cursor-default transition-all duration-300 ${isFaded ? 'opacity-30' : 'opacity-100'}`}
                onMouseEnter={() => setHoveredVerseIndex(idx)}
                onMouseLeave={() => setHoveredVerseIndex(null)}
              >
                <span className={`relative inline-flex justify-center items-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold transition-all duration-300 ${isVerseOriginActive ? 'text-orange-600 scale-125 drop-shadow-md bg-orange-200 text-orange-900 px-1.5 md:px-2 rounded -translate-y-1 md:-translate-y-1.5 z-30'
                    : isHovered ? 'text-orange-600 scale-125 -translate-y-1 md:-translate-y-1.5 drop-shadow-md'
                      : 'text-orange-600/80 hover:text-orange-600'
                  }`}>
                  {item.letter}

                  {isVerseOriginActive && (
                    <span className="absolute bottom-full left-1/2 w-0 flex justify-center z-50">
                      <span className="mb-2 md:mb-3 whitespace-nowrap text-[8px] md:text-[10px] font-sans font-bold text-white bg-slate-700 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded shadow-md pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-700 animate-fade-in-up tracking-wider">
                        Y ⟵ 10th Verse
                      </span>
                    </span>
                  )}
                </span>
                <span className={`text-[8px] sm:text-[10px] uppercase tracking-wider transition-all duration-300 absolute mt-7 sm:mt-8 md:mt-10 lg:mt-12 ${isHovered ? 'text-orange-600 font-bold opacity-100' : 'text-slate-400 opacity-0'
                  }`}>
                  {item.word}
                </span>
              </div>
            );
          })}
        </div>

        {/* COMPLETELY REDESIGNED VERSE TEXT BOX */}
        <div className="bg-white/40 backdrop-blur-md px-3 py-4 sm:px-5 sm:py-6 md:px-10 md:py-8 lg:p-10 shadow-sm border border-white/60 rounded-xl sm:rounded-2xl md:rounded-3xl w-full max-w-[1300px] transition-colors duration-500">
          <div className="flex flex-wrap justify-center items-end gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-6 sm:gap-y-8 md:gap-y-12 pt-1 pb-2 md:pb-4 lg:pb-6">
            {shamarData.verse.subwords.map((item, idx) => {
              if (item.detail.includes("(Word chunk breakdown)")) return null;

              const isHovered = hoveredVerseIndex === idx;
              const isFaded = hoveredVerseIndex !== null && hoveredVerseIndex !== idx;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center max-w-full cursor-default transition-all duration-300 ${isFaded ? 'opacity-30 grayscale-[30%]' : 'opacity-100'}`}
                  onMouseEnter={() => setHoveredVerseIndex(idx)}
                  onMouseLeave={() => setHoveredVerseIndex(null)}
                >
                  {/* The Verse Phrase */}
                  <span className={`text-[12px] sm:text-[14px] leading-tight md:text-[28px] lg:text-[32px] font-serif border-b-[2px] md:border-b-[3px] pb-1 md:pb-1.5 px-0.5 md:px-1.5 text-center transition-all duration-300 rounded-t-lg
                    ${isHovered ? 'text-orange-950 border-orange-500 bg-orange-100/60 shadow-[0_4px_12px_-4px_rgba(251,146,60,0.3)]' : 'text-slate-800 border-orange-400/60 hover:text-orange-900'}
                  `}>
                    {item.detail}
                  </span>
                  {/* The absolute label */}
                  <span className={`absolute top-full mt-1 md:mt-2 lg:mt-3 font-sans text-[7px] sm:text-[9px] md:text-[13px] lg:text-[15px] font-bold tracking-tight sm:tracking-widest uppercase select-none whitespace-nowrap transition-colors duration-300
                    ${isHovered ? 'text-orange-700' : 'text-orange-600 opacity-90'}
                  `}>
                    {item.word}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
