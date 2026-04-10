import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
  const { targetBookId, targetChapter, setTargetChapter, targetVerse, setTargetVerse, explorationMode, autoOpenListFocus, setAutoOpenListFocus } = useAppContext();
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

  useEffect(() => {
    if (isActive && autoOpenListFocus) {
      setViewMode('list');
      setAutoOpenListFocus(false);
      setTimeout(() => {
        const el = document.getElementById(`verse-item-${targetVerse}`);
        if (el && scrollContainerRef.current) {
           el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [isActive, autoOpenListFocus, targetVerse, setAutoOpenListFocus]);

  const traverseChapter = (chStr: string) => {
    setTargetChapter(chStr);
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
  const targetChapterNum = parseInt(targetChapter);
  const targetBookLetter = getAcrosticLetter(bookData.acrostic, targetChapterNum);
  const chapterData = bookData.chapters[targetChapter];
  if (!chapterData) return null;

  const verseCount = bookMeta.verses[targetChapterNum - 1];
  const prevChapter = targetChapterNum > 1 ? (targetChapterNum - 1).toString() : null;
  const nextChapter = targetChapterNum < bookMeta.verses.length ? (targetChapterNum + 1).toString() : null;

  return (
    <div ref={scrollContainerRef} className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="w-full flex flex-col items-center pb-4">
        
        <div className="w-full flex flex-col items-center py-4 px-2 sm:px-4">
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
                <ChevronRight className={`hidden lg:block w-3.5 h-3.5 transition-colors duration-300 ${hoveredLevel === 'testament' ? 'text-orange-500 scale-125' : 'text-orange-300/80'}`} />
                <HighlightedAcrostic
                  text={bookData.acrostic}
                  originIndex={1} originTooltip={`${targetTestamentLetter} ⟵ Book ${localBookIndex}`} isOriginActive={hoveredLevel === 'testament'}
                  pointerIndex={targetChapterNum} pointerTooltip={`${targetBookLetter} ➔ Chapter ${targetChapter}`} isPointerActive={hoveredLevel === 'book'}
                  label="Book" subLabel={`(${bookMeta.verses.length} Chapters)`}
                  referenceLabel={bookMeta.name}
                  onHoverEnter={() => setHoveredLevel('book')} onHoverLeave={() => setHoveredLevel(null)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center w-full relative mb-2 md:mb-4">
            <div className="flex items-center justify-center w-full max-w-xl relative">
                <div className="absolute left-0">
                    {prevChapter ? (
                    <button 
                        onClick={() => traverseChapter(prevChapter)} 
                        className="text-slate-400 hover:text-orange-500 p-1 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    ) : null}
                </div>
                
                <div className="flex flex-col items-center mx-auto px-10">
                    <h3 className="text-slate-500 uppercase tracking-widest mb-0.5 font-semibold text-[10px] md:text-[11px]">Chapter Acrostic</h3>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-800 text-center">{bookMeta.name} {targetChapter}</h2>
                    <button 
                      onClick={() => { setAutoOpenListFocus(true); goToStep(3); }}
                      className="text-[10px] md:text-[11px] text-orange-400 hover:text-orange-600 uppercase tracking-widest font-semibold mt-1 hover:underline underline-offset-4 transition-colors text-center"
                    >
                      View Chapter List
                    </button>
                </div>

                <div className="absolute right-0">
                    {nextChapter ? (
                    <button 
                        onClick={() => traverseChapter(nextChapter)} 
                        className="text-slate-400 hover:text-orange-500 p-1 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    ) : null}
                </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl px-2 sm:px-4 origin-top flex justify-center mb-4 sm:mb-6 md:mb-8">
          <InteractiveAcrostic
            text={chapterData.acrostic}
            hoverType="chapter"
            originHighlight={{ isActive: hoveredLevel === 'book', tooltip: `${targetBookLetter} ⟵ Chapter ${targetChapterNum}` }}
            onAcrosticClick={(idx) => {
                if (explorationMode && idx !== null && chapterData.verses[idx.toString()]) {
                    setTargetVerse(idx.toString());
                    goToStep(5);
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
            <BookOpen size={12} className="mr-1.5 md:w-3.5 md:h-3.5" /> {verseCount} Verses Preview
          </button>
        </div>

        {viewMode === 'list' && (
          <div className="w-full max-w-4xl flex flex-col space-y-3 sm:space-y-4 px-2 sm:px-4 pb-4">
            {Object.keys(chapterData.verses).map((verseKey) => {
               const vData = chapterData.verses[verseKey];
               if (!vData) return null;
               return (
                 <div key={verseKey} id={`verse-item-${verseKey}`}
                      className={`flex flex-col bg-white/40 backdrop-blur-sm border border-white/50 p-3 sm:p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${explorationMode ? 'cursor-pointer hover:scale-[1.01] hover:border-orange-300' : 'cursor-default'}`}
                      onClick={() => {
                        if (explorationMode) {
                            setTargetVerse(verseKey);
                            goToStep(5);
                        }
                      }}>
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-xs sm:text-sm font-bold text-orange-700 tracking-wider">Verse {verseKey}</span>
                     <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">{vData.subwords.length} Letters</span>
                   </div>
                   <div className="flex flex-wrap gap-x-3 gap-y-1">
                     {vData.subwords.map((sub, i) => (
                       <div key={i} className="flex space-x-1 items-baseline">
                         <span className="text-orange-600 font-bold text-sm">{sub.letter}</span>
                         <span className="text-[11px] text-slate-600 uppercase tracking-widest">{sub.word}</span>
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
