import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { HighlightedAcrostic } from '../shared/HighlightedAcrostic';
import { InteractiveAcrostic } from '../shared/InteractiveAcrostic';
import { useAppContext } from '../../contexts/AppContext';
import { BIBLE_BOOKS, BIBLE_BOOK_ORDER, getAcrosticLetter } from '../../data/metadata/bibleBooks';
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
  const [showList, setShowList] = useState(false);

  // Determine Testament context
  const globalIndex = BIBLE_BOOK_ORDER.indexOf(targetBookId);
  const isOT = globalIndex < 39;
  const localBookIndex = isOT ? globalIndex + 1 : globalIndex - 39 + 1;
  const bookMeta = BIBLE_BOOKS[targetBookId];

  useEffect(() => {
    if (!isActive && !bookData) return;
    
    // We do NOT unconditionally setLoading(true) here to prevent annoying loader flashes 
    // when clicking between books quickly or reading locally cached data.
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

  return (
    <div className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="my-auto w-full flex flex-col items-center py-2 sm:py-3 md:py-4">
        {showAcrosticBreadcrumbs && (
          <div className="flex flex-wrap justify-center items-center gap-2 mb-2 sm:mb-4 md:mb-6 animate-fade-in-up w-full px-2 mt-4 md:mt-0">
            <HighlightedAcrostic
              text={testamentAcrosticString}
              pointerIndex={localBookIndex} pointerTooltip={`${targetTestamentLetter} ➔ ${bookMeta.name}`} isPointerActive={hoveredLevel === 'testament'}
              label="Testament Acrostic" subLabel={`(${isOT ? 39 : 27} Books)`}
              referenceLabel={isOT ? "Old Testament" : "New Testament"}
              onHoverEnter={() => setHoveredLevel('testament')} onHoverLeave={() => setHoveredLevel(null)}
            />
          </div>
        )}
        <h3 className="text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 font-semibold text-[10px] sm:text-xs md:text-sm">Book Acrostic</h3>
        <h2 className="text-3xl md:text-5xl font-serif mb-2 sm:mb-3 md:mb-4 text-slate-800 text-center">{bookMeta.name}</h2>
        <div className="w-full px-2 sm:px-4 mb-2 sm:mb-4 md:mb-6">
          <InteractiveAcrostic
            text={bookData.acrostic}
            hoverType="book"
            originHighlight={{ isActive: hoveredLevel === 'testament', tooltip: `${targetTestamentLetter} ⟵ ${localBookIndex}${localBookIndex === 1 ? 'st' : localBookIndex === 2 ? 'nd' : localBookIndex === 3 ? 'rd' : 'th'} Book` }}
            onAcrosticClick={(idx) => {
                if (explorationMode && idx !== null) {
                    setTargetChapter(idx.toString());
                    goToStep(3);
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
            <BookOpen size={12} className="mr-1.5 md:w-3.5 md:h-3.5" /> {bookMeta.verses.length} Chapters Preview
          </button>
        </div>
        
        {showList && (
          <div className="w-full max-w-4xl flex flex-col space-y-3 sm:space-y-4 px-2 sm:px-4 pb-12">
            {Object.keys(bookData.chapters).map((chKey, idx) => {
               const chData = bookData.chapters[chKey];
               if (!chData) return null;
               return (
                 <div key={chKey} 
                      className={`flex flex-col bg-white/40 backdrop-blur-sm border border-white/50 p-3 sm:p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${explorationMode ? 'cursor-pointer hover:scale-[1.01] hover:border-orange-300' : 'cursor-default'}`}
                      onClick={() => {
                        if (explorationMode) {
                            setTargetChapter(chKey);
                            goToStep(3);
                        }
                      }}>
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-xs sm:text-sm font-bold text-orange-700 tracking-wider">Chapter {chKey}</span>
                     <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">{bookMeta.verses[idx]} Verses</span>
                   </div>
                   <span className="text-sm sm:text-base md:text-lg font-serif text-slate-700 leading-tight">
                     {chData.acrostic || "Loading acrostic..."}
                   </span>
                 </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
