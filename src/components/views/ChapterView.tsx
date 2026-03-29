import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { HighlightedAcrostic } from '../shared/HighlightedAcrostic';
import { InteractiveAcrostic } from '../shared/InteractiveAcrostic';
import { shamarData, fullTestamentAcrostic } from '../../data/shamarData';

export interface ChapterViewProps {
  isActive: boolean;
  showAcrosticBreadcrumbs: boolean;
  hoveredLevel: string | null;
  setHoveredLevel: (level: string | null) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({ isActive, showAcrosticBreadcrumbs, hoveredLevel, setHoveredLevel }) => {
  return (
    <div className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="my-auto w-full flex flex-col items-center py-2 sm:py-3 md:py-4">
        {showAcrosticBreadcrumbs && (
          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-4 md:mb-6 animate-fade-in-up w-full max-w-5xl px-1">
            <HighlightedAcrostic
              text={fullTestamentAcrostic}
              pointerIndex={27} pointerTooltip="Y ➔ Revelation" isPointerActive={hoveredLevel === 'testament'}
              label="Testament Acrostic" subLabel={`(${shamarData.testament.bookCount} Books)`}
              onHoverEnter={() => setHoveredLevel('testament')} onHoverLeave={() => setHoveredLevel(null)}
            />
            <ChevronRight className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-colors duration-300 ${hoveredLevel === 'testament' ? 'text-orange-500 scale-125' : 'text-orange-300/80'}`} />
            <HighlightedAcrostic
              text={shamarData.book.acrostic}
              originIndex={1} originTooltip="Y ⟵ 27th Book" isOriginActive={hoveredLevel === 'testament'}
              pointerIndex={2} pointerTooltip="E ➔ Chapter 2" isPointerActive={hoveredLevel === 'book'}
              label="Book Acrostic" subLabel={`(${shamarData.book.chapters} Chapters)`}
              onHoverEnter={() => setHoveredLevel('book')} onHoverLeave={() => setHoveredLevel(null)}
            />
          </div>
        )}
        <h3 className="text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 font-semibold text-[10px] sm:text-xs md:text-sm">Chapter Level</h3>
        <h2 className="text-3xl md:text-5xl font-serif mb-2 sm:mb-3 md:mb-4 text-slate-800 text-center">{shamarData.book.name} {shamarData.chapter.name.replace('Chapter ', '')}</h2>
        <div className="flex items-center text-orange-600 font-medium tracking-widest uppercase mb-4 sm:mb-6 md:mb-10 text-[9px] sm:text-[10px] md:text-xs border-b border-orange-200 pb-1 sm:pb-2">
          <BookOpen size={12} className="mr-1 sm:mr-2 md:w-3.5 md:h-3.5" /> {shamarData.chapter.verses} Verses
        </div>
        <div className="w-full px-2 sm:px-4">
          <InteractiveAcrostic
            text={shamarData.chapter.acrostic}
            hoverType="chapter"
            originHighlight={{ isActive: hoveredLevel === 'book', tooltip: 'E ⟵ Chapter 2' }}
          />
          <p className="mt-4 sm:mt-6 md:mt-8 text-[8px] sm:text-[10px] md:text-xs text-slate-500 max-w-2xl mx-auto text-center font-light uppercase tracking-widest px-4">
            {shamarData.chapter.description}
          </p>
        </div>
      </div>
    </div>
  );
};
