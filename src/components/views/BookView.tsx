import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
  const { targetBookId, setTargetBookId, setTargetChapter, setTargetVerse, explorationMode, autoOpenListFocus, setAutoOpenListFocus } = useAppContext();
  const [bookData, setBookData] = useState<BookAcrostic | null>(null);
  const [testamentData, setTestamentData] = useState<TestamentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'acrostic' | 'list'>('acrostic');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isActive && autoOpenListFocus) {
      setViewMode('list');
      setAutoOpenListFocus(false);
      setTimeout(() => {
        const el = document.getElementById(`chapter-item-1`);
        if (el && scrollContainerRef.current) {
           el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [isActive, autoOpenListFocus, setAutoOpenListFocus]);

  const traverseBook = (bId: string) => {
    setTargetBookId(bId);
    setTargetChapter('1');
    setTargetVerse('1');
  };

  if (loading || !bookData || !testamentData) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Loader2 className="animate-spin text-orange-500 w-8 h-8 md:w-12 md:h-12" />
      </div>
    );
  }

  const testamentAcrosticString = isOT ? testamentData.testaments.OT.acrostic : testamentData.testaments.NT.acrostic;
  const targetTestamentLetter = getAcrosticLetter(testamentAcrosticString, localBookIndex);

  const prevBookId = globalIndex > 0 ? BIBLE_BOOK_ORDER[globalIndex - 1] : null;
  const nextBookId = globalIndex < BIBLE_BOOK_ORDER.length - 1 ? BIBLE_BOOK_ORDER[globalIndex + 1] : null;

  return (
    <div ref={scrollContainerRef} className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="w-full flex flex-col items-center pb-4">
        
        {/* Header Section */}
        <div className="w-full flex flex-col items-center py-4 px-2 sm:px-4">
          {/* Breadcrumbs and Top Actions */}
          <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-center items-center mb-4 md:mb-6 mt-4 md:mt-0 gap-4 relative">
            {showAcrosticBreadcrumbs && (
              <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-3 animate-fade-in-up">
                <HighlightedAcrostic
                  text={testamentAcrosticString}
                  pointerIndex={localBookIndex} pointerTooltip={`${targetTestamentLetter} ➔ ${bookMeta.name}`} isPointerActive={hoveredLevel === 'testament'}
                  label="Testament" subLabel={`(${isOT ? 39 : 27} Books)`}
                  referenceLabel={isOT ? "Old Testament" : "New Testament"}
                  onHoverEnter={() => setHoveredLevel('testament')} onHoverLeave={() => setHoveredLevel(null)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center w-full relative mb-2 md:mb-4">
            <div className="flex items-center justify-center w-full max-w-xl relative">
                <div className="absolute left-0">
                    {prevBookId ? (
                    <button 
                        onClick={() => traverseBook(prevBookId)} 
                        className="text-slate-400 hover:text-orange-500 p-1 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    ) : null}
                </div>
                
                <div className="flex flex-col items-center mx-auto px-10">
                    <h3 className="text-slate-500 uppercase tracking-widest mb-0.5 font-semibold text-[10px] md:text-[11px]">Book Acrostic</h3>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-800 text-center">{bookMeta.name}</h2>
                    <button 
                      onClick={() => { setAutoOpenListFocus(true); goToStep(2); }}
                      className="text-[10px] md:text-[11px] text-orange-400 hover:text-orange-600 uppercase tracking-widest font-semibold mt-1 hover:underline underline-offset-4 transition-colors text-center"
                    >
                      View Book List
                    </button>
                </div>

                <div className="absolute right-0">
                    {nextBookId ? (
                    <button 
                        onClick={() => traverseBook(nextBookId)} 
                        className="text-slate-400 hover:text-orange-500 p-1 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    ) : null}
                </div>
            </div>
          </div>
        </div>
        <div className="w-full px-2 sm:px-4 mb-2 sm:mb-4 md:mb-6">
          <InteractiveAcrostic
            text={bookData.acrostic}
            hoverType="book"
            originHighlight={{ isActive: hoveredLevel === 'testament', tooltip: `${targetTestamentLetter} ⟵ ${localBookIndex}${localBookIndex === 1 ? 'st' : localBookIndex === 2 ? 'nd' : localBookIndex === 3 ? 'rd' : 'th'} Book` }}
            onAcrosticClick={(idx) => {
                if (explorationMode && idx !== null) {
                    setTargetChapter(idx.toString());
                    setTargetVerse('1');
                    goToStep(4);
                }
            }}
            interactiveClass={explorationMode ? "cursor-pointer" : "cursor-default"}
          />
        </div>

        <div className="flex justify-center items-center gap-4 mb-4 sm:mb-6 md:mb-10 w-full max-w-4xl px-2 pb-1 sm:pb-2">
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'acrostic' : 'list')}
            className={`flex items-center text-[9px] sm:text-[10px] md:text-xs font-medium tracking-widest uppercase pb-1 sm:pb-2 border-b-2 transition-colors ${viewMode === 'list' ? 'text-orange-700 border-orange-500 font-bold' : 'text-orange-600/70 border-transparent hover:text-orange-600'}`}
          >
            <BookOpen size={12} className="mr-1.5 md:w-3.5 md:h-3.5" /> {bookMeta.verses.length} Chapters Preview
          </button>
        </div>
        
        {viewMode === 'list' && (
          <div className="w-full max-w-4xl flex flex-col space-y-3 sm:space-y-4 px-2 sm:px-4 pb-4">
            {Object.keys(bookData.chapters).map((chKey, idx) => {
               const chData = bookData.chapters[chKey];
               if (!chData) return null;
               return (
                 <div key={chKey} 
                      className={`flex flex-col bg-white/40 backdrop-blur-sm border border-white/50 p-3 sm:p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${explorationMode ? 'cursor-pointer hover:scale-[1.01] hover:border-orange-300' : 'cursor-default'}`}
                      onClick={() => {
                        if (explorationMode) {
                            setTargetChapter(chKey);
                            setTargetVerse('1');
                            goToStep(4);
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
