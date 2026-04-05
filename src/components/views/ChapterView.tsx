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
  const [showList, setShowList] = useState(false);

  // Determine Testament context
  const globalIndex = BIBLE_BOOK_ORDER.indexOf(targetBookId);
  const isOT = globalIndex < 39;
  const localBookIndex = isOT ? globalIndex + 1 : globalIndex - 39 + 1;
  const bookMeta = BIBLE_BOOKS[targetBookId];

  useEffect(() => {
    if (!isActive && !bookData) return;
    
    // Prevent loading flash if cached
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
        <h3 className="text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 font-semibold text-[10px] sm:text-xs md:text-sm">Chapter Acrostic</h3>
        <h2 className="text-3xl md:text-5xl font-serif mb-2 sm:mb-3 md:mb-4 text-slate-800 text-center">{bookMeta.name} {targetChapter}</h2>
        <div className="w-full px-2 sm:px-4 mb-2 sm:mb-4 md:mb-6">
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
        </div>

        <div className="flex justify-center items-center mb-4 sm:mb-6 md:mb-10 w-full max-w-4xl px-2">
          <button 
            onClick={() => setShowList(!showList)}
            className={`flex items-center text-[9px] sm:text-[10px] md:text-xs font-medium tracking-widest uppercase pb-1 sm:pb-2 border-b-2 transition-colors ${showList ? 'text-orange-700 border-orange-500 font-bold' : 'text-orange-600 border-transparent hover:border-orange-300 hover:text-orange-700'}`}
          >
            <BookOpen size={12} className="mr-1.5 md:w-3.5 md:h-3.5" /> {verseCount} Verses Preview
          </button>
        </div>

        {showList && (
          <div className="w-full max-w-4xl flex flex-col space-y-3 sm:space-y-4 px-2 sm:px-4 pb-12">
            {Array.from({ length: verseCount }, (_, i) => (i + 1).toString()).map((verseKey) => {
               const vData = chapterData.verses[verseKey];
               if (!vData) return null;
               return (
                 <div key={verseKey} 
                      className={`flex flex-col bg-white/40 backdrop-blur-sm border border-white/50 p-3 sm:p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${explorationMode ? 'cursor-pointer hover:scale-[1.01] hover:border-orange-300' : 'cursor-default'}`}
                      onClick={() => {
                        if (explorationMode) {
                            setTargetVerse(verseKey);
                            goToStep(4);
                        }
                      }}>
                   <div className="flex flex-col mb-3 pb-2 border-b border-orange-200/50">
                     <div className="flex justify-between items-end mb-1">
                       <span className="text-xs sm:text-sm font-bold text-orange-700 tracking-wider">Verse {verseKey}</span>
                       <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">{vData.subwords.length} Letters</span>
                     </div>
                     <span className="text-base sm:text-lg font-serif text-slate-800 tracking-wider uppercase">
                       <span className="text-orange-600 font-bold">{vData.acrostic.charAt(0)}</span>
                       {vData.acrostic.slice(1)}
                     </span>
                   </div>
                   <div className="flex flex-wrap gap-x-3 gap-y-1">
                     {vData.subwords.map((sub, i) => (
                       <div key={i} className="flex items-baseline">
                         <span className="text-orange-600 font-bold text-sm tracking-tight">{sub.word.charAt(0).toUpperCase()}</span>
                         <span className="text-[11px] text-slate-600 uppercase tracking-widest ml-[1px]">{sub.word.slice(1)}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
