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
      <div className="my-auto w-full flex flex-col items-center py-4">
        {showAcrosticBreadcrumbs && (
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-4 md:mb-6 animate-fade-in-up w-full max-w-5xl">
            <HighlightedAcrostic
              text={fullTestamentAcrostic}
              pointerIndex={27} pointerTooltip="Y ➔ Revelation" isPointerActive={hoveredLevel === 'testament'}
              label="Testament Acrostic" subLabel={`(${shamarData.testament.bookCount} Books)`}
              onHoverEnter={() => setHoveredLevel('testament')} onHoverLeave={() => setHoveredLevel(null)}
            />
            <ChevronRight size={14} className={`hidden md:block transition-colors duration-300 ${hoveredLevel === 'testament' ? 'text-orange-500 scale-125' : 'text-orange-300/80'}`} />
            <HighlightedAcrostic
              text={shamarData.book.acrostic}
              originIndex={1} originTooltip="Y ⟵ 27th Book" isOriginActive={hoveredLevel === 'testament'}
              pointerIndex={2} pointerTooltip="E ➔ Chapter 2" isPointerActive={hoveredLevel === 'book'}
              label="Book Acrostic" subLabel={`(${shamarData.book.chapters} Chapters)`}
              onHoverEnter={() => setHoveredLevel('book')} onHoverLeave={() => setHoveredLevel(null)}
            />
          </div>
        )}
        <h3 className="text-slate-500 uppercase tracking-widest mb-2 font-semibold text-sm">Chapter Level</h3>
        <h2 className="text-4xl md:text-5xl font-serif mb-4 text-slate-800">{shamarData.book.name} {shamarData.chapter.name.replace('Chapter ', '')}</h2>
        <div className="flex items-center text-orange-600 font-medium tracking-widest uppercase mb-10 text-xs border-b border-orange-200 pb-2">
          <BookOpen size={14} className="mr-2" /> {shamarData.chapter.verses} Verses
        </div>
        <div className="w-full px-4">
          <InteractiveAcrostic
            text={shamarData.chapter.acrostic}
            hoverType="chapter"
            originHighlight={{ isActive: hoveredLevel === 'book', tooltip: 'E ⟵ Chapter 2' }}
          />
          <p className="mt-8 mx-auto max-w-xl text-sm text-slate-600 text-center font-light bg-white/40 px-5 py-2 rounded-full border border-white/50">{shamarData.chapter.description}</p>
        </div>
      </div>
    </div>
  );
};
