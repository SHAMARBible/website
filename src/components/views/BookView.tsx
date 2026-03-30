import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { HighlightedAcrostic } from '../shared/HighlightedAcrostic';
import { InteractiveAcrostic } from '../shared/InteractiveAcrostic';
import { useAppContext } from '../../contexts/AppContext';
import { BIBLE_BOOKS, BIBLE_BOOK_ORDER, getAbsoluteCharIndex } from '../../data/metadata/bibleBooks';
import { fetchBookAcrostics, fetchTestamentsOverview, BookAcrostic, TestamentsData } from '../../api/acrosticFetcher';

export interface BookViewProps {
  isActive: boolean;
  showAcrosticBreadcrumbs: boolean;
  hoveredLevel: string | null;
  setHoveredLevel: (level: string | null) => void;
  goToStep: (index: number) => void;
}

export const BookView: React.FC<BookViewProps> = ({ isActive, showAcrosticBreadcrumbs, hoveredLevel, setHoveredLevel, goToStep }) => {
  const { targetBookId, setTargetChapter, explorationMode } = useAppContext();
  const [bookData, setBookData] = useState<BookAcrostic | null>(null);
  const [testamentData, setTestamentData] = useState<TestamentsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine Testament context
  const globalIndex = BIBLE_BOOK_ORDER.indexOf(targetBookId);
  const isOT = globalIndex < 39;
  const localBookIndex = isOT ? globalIndex + 1 : globalIndex - 39 + 1;
  const bookMeta = BIBLE_BOOKS[targetBookId];

  useEffect(() => {
    if (!isActive && !bookData) return; // Don't fetch until we enter the view branch (or keep simple)
    
    setLoading(true);
    Promise.all([
      fetchBookAcrostics(targetBookId),
      fetchTestamentsOverview()
    ]).then(([bd, td]) => {
      setBookData(bd);
      setTestamentData(td);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [targetBookId, isActive]);

  if (loading || !bookData || !testamentData) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Loader2 className="animate-spin text-orange-500 w-8 h-8 md:w-12 md:h-12" />
      </div>
    );
  }

  const testamentAcrosticString = isOT ? testamentData.testaments.OT.acrostic : testamentData.testaments.NT.acrostic;
  const targetCharIndex = getAbsoluteCharIndex(testamentAcrosticString, localBookIndex);
  const targetLetter = targetCharIndex !== -1 ? testamentAcrosticString[targetCharIndex] : '?';

  return (
    <div className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="my-auto w-full flex flex-col items-center py-2 sm:py-3 md:py-4">
        {showAcrosticBreadcrumbs && (
          <div className="flex flex-wrap justify-center items-center gap-2 mb-2 sm:mb-4 md:mb-6 animate-fade-in-up w-full px-2 mt-4 md:mt-0">
            <HighlightedAcrostic
              text={testamentAcrosticString}
              pointerIndex={targetCharIndex} 
              pointerTooltip={`${targetLetter} ➔ ${bookMeta.name}`} 
              isPointerActive={hoveredLevel === 'testament'}
              label="Testament Acrostic" 
              subLabel={`(${isOT ? 39 : 27} Books)`}
              onHoverEnter={() => setHoveredLevel('testament')} 
              onHoverLeave={() => setHoveredLevel(null)}
            />
          </div>
        )}
        <h3 className="text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 font-semibold text-[10px] sm:text-xs md:text-sm">Book Level</h3>
        <h2 className="text-3xl md:text-5xl font-serif mb-2 sm:mb-3 md:mb-4 text-slate-800 text-center">{bookMeta.name}</h2>
        <div className="flex items-center text-orange-600 font-medium tracking-widest uppercase mb-4 sm:mb-6 md:mb-10 text-[9px] sm:text-[10px] md:text-xs border-b border-orange-200 pb-1 sm:pb-2">
          <BookOpen size={12} className="mr-1 sm:mr-2 md:w-3.5 md:h-3.5" /> {bookMeta.verses.length} Chapters
        </div>
        <div className="w-full px-2 sm:px-4">
          <InteractiveAcrostic
            text={bookData.acrostic}
            hoverType="book"
            originHighlight={{ isActive: hoveredLevel === 'testament', tooltip: `${targetLetter} ⟵ ${localBookIndex}${localBookIndex === 1 ? 'st' : localBookIndex === 2 ? 'nd' : localBookIndex === 3 ? 'rd' : 'th'} Book` }}
            onHoverChange={(idx) => {
              // We could show chapter pill highlights if we matched Chapters to letters!
            }}
            onAcrosticClick={(idx) => {
                if (explorationMode && idx !== null) {
                    setTargetChapter(idx.toString());
                    goToStep(3);
                }
            }}
            interactiveClass={explorationMode ? "cursor-pointer" : "cursor-default"}
          />
          <p className="mt-4 sm:mt-6 md:mt-8 text-[8px] sm:text-[10px] md:text-xs text-slate-500 max-w-2xl mx-auto text-center font-light uppercase tracking-widest px-4">
            {bookData.acrostic.replace(/ /g, '').length} Letters for {bookMeta.verses.length} Chapters.
          </p>
        </div>
      </div>
    </div>
  );
};
