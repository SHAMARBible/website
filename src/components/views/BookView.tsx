import React from 'react';
import { BookOpen } from 'lucide-react';
import { HighlightedAcrostic } from '../shared/HighlightedAcrostic';
import { InteractiveAcrostic } from '../shared/InteractiveAcrostic';
import { shamarData, fullTestamentAcrostic } from '../../data/shamarData';

export interface BookViewProps {
  isActive: boolean;
  showAcrosticBreadcrumbs: boolean;
  hoveredLevel: string | null;
  setHoveredLevel: (level: string | null) => void;
}

export const BookView: React.FC<BookViewProps> = ({ isActive, showAcrosticBreadcrumbs, hoveredLevel, setHoveredLevel }) => {
  return (
    <div className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="my-auto w-full flex flex-col items-center py-2 sm:py-3 md:py-4">
        {showAcrosticBreadcrumbs && (
          <div className="flex flex-wrap justify-center items-center gap-2 mb-2 sm:mb-4 md:mb-6 animate-fade-in-up w-full px-2">
            <HighlightedAcrostic
              text={fullTestamentAcrostic}
              pointerIndex={27} pointerTooltip="Y ➔ Revelation" isPointerActive={hoveredLevel === 'testament'}
              label="Testament Acrostic" subLabel={`(${shamarData.testament.bookCount} Books)`}
              onHoverEnter={() => setHoveredLevel('testament')} onHoverLeave={() => setHoveredLevel(null)}
            />
          </div>
        )}
        <h3 className="text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 font-semibold text-[10px] sm:text-xs md:text-sm">Book Level</h3>
        <h2 className="text-3xl md:text-5xl font-serif mb-2 sm:mb-3 md:mb-4 text-slate-800 text-center">{shamarData.book.name}</h2>
        <div className="flex items-center text-orange-600 font-medium tracking-widest uppercase mb-4 sm:mb-6 md:mb-10 text-[9px] sm:text-[10px] md:text-xs border-b border-orange-200 pb-1 sm:pb-2">
          <BookOpen size={12} className="mr-1 sm:mr-2 md:w-3.5 md:h-3.5" /> {shamarData.book.chapters} Chapters
        </div>
        <div className="w-full px-2 sm:px-4">
          <InteractiveAcrostic
            text={shamarData.book.acrostic}
            hoverType="book"
            originHighlight={{ isActive: hoveredLevel === 'testament', tooltip: 'Y ⟵ 27th Book' }}
          />
        </div>
      </div>
    </div>
  );
};
