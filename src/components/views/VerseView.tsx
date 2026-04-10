import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { HighlightedAcrostic } from '../shared/HighlightedAcrostic';
import { useAppContext } from '../../contexts/AppContext';
import { BIBLE_BOOKS, BIBLE_BOOK_ORDER, getAcrosticLetter } from '../../data/metadata/bibleBooks';
import { fetchBookAcrostics, fetchTestamentsOverview, BookAcrostic, TestamentsData } from '../../api/acrosticFetcher';

const DUMMY_LOREM = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export interface VerseViewProps {
  isActive: boolean;
  showAcrosticBreadcrumbs: boolean;
  hoveredLevel: string | null;
  setHoveredLevel: (level: string | null) => void;
  goToStep: (index: number) => void;
}

export const VerseView: React.FC<VerseViewProps> = ({ isActive, showAcrosticBreadcrumbs, hoveredLevel, setHoveredLevel, goToStep }) => {
  const { targetBookId, targetChapter, targetVerse, setTargetVerse, setAutoOpenListFocus } = useAppContext();
  const [hoveredVerseIndex, setHoveredVerseIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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

  const traverseVerse = (vStr: string) => {
    setTargetVerse(vStr);
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

  // Book Level Pointers
  const targetChapterNum = parseInt(targetChapter);
  const targetBookLetter = getAcrosticLetter(bookData.acrostic, targetChapterNum);

  // Chapter Data
  const chapterData = bookData.chapters[targetChapter];
  if (!chapterData) return null;
  
  // Verse Data Pointers
  const targetVerseNum = parseInt(targetVerse);
  const targetChapterLetter = getAcrosticLetter(chapterData.acrostic, targetVerseNum);
  
  const verseData = chapterData.verses[targetVerse];
  if (!verseData) return null;

  const verseCount = bookMeta.verses[targetChapterNum - 1];

  const prevVerse = targetVerseNum > 1 ? (targetVerseNum - 1).toString() : null;
  const nextVerse = targetVerseNum < verseCount ? (targetVerseNum + 1).toString() : null;

  return (
    <div ref={scrollContainerRef} className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="w-full flex flex-col items-center pb-24">
        
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
                <ChevronRight className={`hidden lg:block w-3.5 h-3.5 transition-colors duration-300 ${hoveredLevel === 'testament' ? 'text-orange-500 scale-125' : 'text-orange-300/80'}`} />

                <HighlightedAcrostic
                  text={bookData.acrostic}
                  originIndex={1} originTooltip={`${targetTestamentLetter} ⟵ Book ${localBookIndex}`} isOriginActive={hoveredLevel === 'testament'}
                  pointerIndex={targetChapterNum} pointerTooltip={`${targetBookLetter} ➔ Chapter ${targetChapter}`} isPointerActive={hoveredLevel === 'book'}
                  label="Book" subLabel={`(${bookMeta.verses.length} Chapters)`}
                  referenceLabel={bookMeta.name}
                  onHoverEnter={() => setHoveredLevel('book')} onHoverLeave={() => setHoveredLevel(null)}
                />
                <ChevronRight className={`hidden lg:block w-3.5 h-3.5 transition-colors duration-300 ${hoveredLevel === 'book' ? 'text-orange-500 scale-125' : 'text-orange-300/80'}`} />

                <HighlightedAcrostic
                  text={chapterData.acrostic}
                  originIndex={targetChapterNum} originTooltip={`${targetBookLetter} ⟵ Chapter ${targetChapterNum}`} isOriginActive={hoveredLevel === 'book'}
                  pointerIndex={targetVerseNum} pointerTooltip={`${targetChapterLetter} ➔ Verse ${targetVerse}`} isPointerActive={hoveredLevel === 'chapter'}
                  label="Chapter" subLabel={`(${verseCount} Verses)`}
                  referenceLabel={`Chapter ${targetChapter}`}
                  onHoverEnter={() => setHoveredLevel('chapter')} onHoverLeave={() => setHoveredLevel(null)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center w-full relative mb-2 md:mb-4">
            <div className="flex items-center justify-center w-full max-w-xl relative">
                <div className="absolute left-0">
                    {prevVerse ? (
                    <button 
                        onClick={() => traverseVerse(prevVerse)} 
                        className="text-slate-400 hover:text-orange-500 p-1 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    ) : null}
                </div>
                
                <div className="flex flex-col items-center mx-auto px-10">
                    <h3 className="text-slate-500 uppercase tracking-widest mb-0.5 font-semibold text-[10px] md:text-[11px]">Verse Acrostic</h3>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-slate-800 text-center">{bookMeta.name} {targetChapter}:{targetVerse}</h2>
                    <button 
                      onClick={() => { setAutoOpenListFocus(true); goToStep(4); }}
                      className="text-[10px] md:text-[11px] text-orange-400 hover:text-orange-600 uppercase tracking-widest font-semibold mt-1 hover:underline underline-offset-4 transition-colors text-center"
                    >
                      View Verse List
                    </button>
                </div>

                <div className="absolute right-0">
                    {nextVerse ? (
                    <button 
                        onClick={() => traverseVerse(nextVerse)} 
                        className="text-slate-400 hover:text-orange-500 p-1 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    ) : null}
                </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-4 md:pt-8 flex flex-col items-center">
          {/* Subtle Acrostic Word Display */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6 lg:mb-8">
            {verseData.subwords.map((item, idx) => {
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
                  <span className={`relative inline-flex justify-center items-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold transition-all duration-300 ${isVerseOriginActive ? 'scale-125 drop-shadow-md bg-orange-200 text-orange-900 px-1.5 md:px-2 rounded -translate-y-1 md:-translate-y-1.5 z-30'
                      : isHovered ? 'text-orange-600 scale-125 -translate-y-1 md:-translate-y-1.5 drop-shadow-md'
                        : 'text-orange-600/80 hover:text-orange-600'
                    }`}>
                    {item.letter}

                    {isVerseOriginActive && (
                      <span className="absolute bottom-full left-1/2 w-0 flex justify-center z-50">
                        <span className="mb-2 md:mb-3 whitespace-nowrap text-[8px] md:text-[10px] font-sans font-bold text-white bg-slate-700 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded shadow-md pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-700 animate-fade-in-up tracking-wider">
                          {targetChapterLetter} ⟵ Verse {targetVerse}
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

          {/* Mnemonic Verse Representation Box */}
          <div className="bg-white/40 backdrop-blur-md px-3 py-4 sm:px-5 sm:py-6 md:px-10 md:py-8 lg:p-10 shadow-sm border border-white/60 rounded-xl sm:rounded-2xl md:rounded-3xl w-full max-w-2xl transition-colors duration-500">
            <div className="flex flex-wrap justify-center items-end gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-6 sm:gap-y-8 md:gap-y-12 pt-1 pb-2 md:pb-4 lg:pb-6">
              {(() => {
                let currentLoremIdx = targetVerseNum;
                return verseData.subwords.map((item, idx) => {
                  const isHovered = hoveredVerseIndex === idx;
                  const isFaded = hoveredVerseIndex !== null && hoveredVerseIndex !== idx;
                  
                  let count = item.verseWordCount;
                  if (!count || count <= 0) count = (idx % 3) + 2;
                  
                  const chunkWords: string[] = [];
                  for (let i = 0; i < count; i++) {
                     chunkWords.push(DUMMY_LOREM[currentLoremIdx % DUMMY_LOREM.length]);
                     currentLoremIdx++;
                  }
                  const chunkText = chunkWords.join(" ").replace(/^./, (c) => c.toUpperCase());

                  return (
                    <div
                      key={idx}
                      className={`relative flex flex-col items-center max-w-full cursor-default transition-all duration-300 ${isFaded ? 'opacity-30 grayscale-30' : 'opacity-100'}`}
                      onMouseEnter={() => setHoveredVerseIndex(idx)}
                      onMouseLeave={() => setHoveredVerseIndex(null)}
                    >
                      <span className={`text-[12px] sm:text-[14px] leading-tight md:text-[28px] lg:text-[32px] font-serif border-b-2 md:border-b-[3px] pb-1 md:pb-1.5 px-0.5 md:px-1.5 text-center transition-all duration-300 rounded-t-lg
                        ${isHovered ? 'text-orange-950 border-orange-500 bg-orange-100/60 shadow-[0_4px_12px_-4px_rgba(251,146,60,0.3)]' : 'text-slate-800 border-orange-400/60 hover:text-orange-900'}
                      `}>
                        {chunkText}
                      </span>
                      <span className={`absolute top-full mt-1 md:mt-2 lg:mt-3 font-sans text-[7px] sm:text-[9px] md:text-[13px] lg:text-[15px] font-bold tracking-tight sm:tracking-widest uppercase select-none whitespace-nowrap transition-colors duration-300
                        ${isHovered ? 'text-orange-700' : 'text-orange-600 opacity-90'}
                      `}>
                        {item.word || "?"}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
