import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { HighlightedAcrostic } from '../shared/HighlightedAcrostic';
import { InteractiveAcrostic } from '../shared/InteractiveAcrostic';
import { useAppContext } from '../../contexts/AppContext';
import { BIBLE_BOOKS, BIBLE_BOOK_ORDER, getAcrosticLetter } from '../../data/metadata/bibleBooks';
import { fetchBookAcrostics, fetchTestamentsOverview, BookAcrostic, TestamentsData } from '../../api/acrosticFetcher';

export interface ChapterViewProps {
  isActive: boolean;
  showAcrosticBreadcrumbs: boolean;
  hoveredLevel: string | null;
  setHoveredLevel: (level: string | null) => void;
  goToStep: (index: number) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({ isActive, showAcrosticBreadcrumbs, hoveredLevel, setHoveredLevel, goToStep }) => {
  const { targetBookId, targetChapter, setTargetVerse, explorationMode } = useAppContext();
  const [bookData, setBookData] = useState<BookAcrostic | null>(null);
  const [testamentData, setTestamentData] = useState<TestamentsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine Testament context
  const globalIndex = BIBLE_BOOK_ORDER.indexOf(targetBookId);
  const isOT = globalIndex < 39;
  const localBookIndex = isOT ? globalIndex + 1 : globalIndex - 39 + 1;
  const bookMeta = BIBLE_BOOKS[targetBookId];

  useEffect(() => {
    if (!isActive && !bookData) return;
    
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
  
  const targetTestamentLetter = getAcrosticLetter(testamentAcrosticString, localBookIndex);

  // Book Level Pointers
  const targetChapterNum = parseInt(targetChapter);
  const targetBookLetter = getAcrosticLetter(bookData.acrostic, targetChapterNum);

  // Chapter Data
  const chapterData = bookData.chapters[targetChapter];
  if (!chapterData) return null; // Fallback if active target is out of bounds

  const verseCount = bookMeta.verses[targetChapterNum - 1];

  return (
    <div className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="my-auto w-full flex flex-col items-center py-2 sm:py-3 md:py-4">
        {showAcrosticBreadcrumbs && (
          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-4 md:mb-6 animate-fade-in-up w-full max-w-5xl px-1 mt-4 md:mt-0">
            <HighlightedAcrostic
              text={testamentAcrosticString}
              pointerIndex={localBookIndex} pointerTooltip={`${targetTestamentLetter} ➔ ${bookMeta.name}`} isPointerActive={hoveredLevel === 'testament'}
              label="Testament Acrostic" subLabel={`(${isOT ? 39 : 27} Books)`}
              referenceLabel={isOT ? "Old Testament" : "New Testament"}
              onHoverEnter={() => setHoveredLevel('testament')} onHoverLeave={() => setHoveredLevel(null)}
            />
            <ChevronRight className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-colors duration-300 ${hoveredLevel === 'testament' ? 'text-orange-500 scale-125' : 'text-orange-300/80'}`} />
            <HighlightedAcrostic
              text={bookData.acrostic}
              originIndex={1} originTooltip={`${targetTestamentLetter} ⟵ ${localBookIndex}${localBookIndex === 1 ? 'st' : localBookIndex === 2 ? 'nd' : localBookIndex === 3 ? 'rd' : 'th'} Book`} isOriginActive={hoveredLevel === 'testament'}
              pointerIndex={targetChapterNum} pointerTooltip={`${targetBookLetter} ➔ Chapter ${targetChapter}`} isPointerActive={hoveredLevel === 'book'}
              label="Book Acrostic" subLabel={`(${bookMeta.verses.length} Chapters)`}
              referenceLabel={bookMeta.name}
              onHoverEnter={() => setHoveredLevel('book')} onHoverLeave={() => setHoveredLevel(null)}
            />
          </div>
        )}
        <h3 className="text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 font-semibold text-[10px] sm:text-xs md:text-sm">Chapter Level</h3>
        <h2 className="text-3xl md:text-5xl font-serif mb-2 sm:mb-3 md:mb-4 text-slate-800 text-center">{bookMeta.name} {targetChapter}</h2>
        <div className="flex items-center text-orange-600 font-medium tracking-widest uppercase mb-4 sm:mb-6 md:mb-10 text-[9px] sm:text-[10px] md:text-xs border-b border-orange-200 pb-1 sm:pb-2">
          <BookOpen size={12} className="mr-1 sm:mr-2 md:w-3.5 md:h-3.5" /> {verseCount} Verses
        </div>
        <div className="w-full px-2 sm:px-4">
          <InteractiveAcrostic
            text={chapterData.acrostic}
            hoverType="chapter"
            originHighlight={{ isActive: hoveredLevel === 'book', tooltip: `${targetBookLetter} ⟵ Chapter ${targetChapterNum}` }}
            onAcrosticClick={(idx) => {
                if (explorationMode && idx !== null && chapterData.verses[idx.toString()]) {
                    setTargetVerse(idx.toString());
                    goToStep(4);
                }
            }}
            interactiveClass={explorationMode ? "cursor-pointer" : "cursor-default"}
          />
          <p className="mt-4 sm:mt-6 md:mt-8 text-[8px] sm:text-[10px] md:text-xs text-slate-500 max-w-2xl mx-auto text-center font-light uppercase tracking-widest px-4">
            {chapterData.acrostic.replace(/ /g, '').length} Letters for {verseCount} Verses.
          </p>
        </div>
      </div>
    </div>
  );
};
