import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { BIBLE_BOOKS, BIBLE_BOOK_ORDER } from '../../data/metadata/bibleBooks';

export interface BibleExplorerViewProps {
  isActive: boolean;
  goToStep: (index: number) => void;
}

export const BibleExplorerView: React.FC<BibleExplorerViewProps> = ({ isActive, goToStep }) => {
  const { targetBookId, setTargetBookId, targetChapter, setTargetChapter, setTargetVerse, setExplorationMode } = useAppContext();
  
  const [selectedTestament, setSelectedTestament] = useState<'OT' | 'NT'>('NT');
  const [selectedBook, setSelectedBook] = useState<string>('REV');
  const [selectedChapter, setSelectedChapter] = useState<string>('1');

  // Sync state when entering view and enable explorationMode globally
  useEffect(() => {
    if (isActive) {
      setExplorationMode(true);
      if (targetBookId && BIBLE_BOOK_ORDER.indexOf(targetBookId) < 39) setSelectedTestament('OT');
      else setSelectedTestament('NT');
      setSelectedBook(targetBookId || 'REV');
      setSelectedChapter(targetChapter || '1');
    }
  }, [isActive, targetBookId, targetChapter, setExplorationMode]);

  if (!isActive) return null;

  const testamentBooks = selectedTestament === 'OT' ? BIBLE_BOOK_ORDER.slice(0, 39) : BIBLE_BOOK_ORDER.slice(39);
  const bookMeta = BIBLE_BOOKS[selectedBook];
  const chapters = Array.from({ length: bookMeta.verses.length }, (_, i) => (i + 1).toString());
  const chapterIdx = parseInt(selectedChapter) - 1;
  const verseCount = bookMeta.verses[chapterIdx] || 0;
  const verses = Array.from({ length: verseCount }, (_, i) => (i + 1).toString());

  const handleVerseClick = (v: string) => {
    setTargetBookId(selectedBook);
    setTargetChapter(selectedChapter);
    setTargetVerse(v);
    goToStep(5); // Jump directly to Verse View
  };

  return (
    <div className={`absolute inset-0 flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      
      <div className="w-[85vw] md:w-1/4 h-full shrink-0 snap-start flex flex-col border-r border-white/40 bg-white/30 backdrop-blur-md p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        <h3 className="text-slate-500 uppercase tracking-widest font-semibold text-[10px] md:text-xs mb-4">Testament</h3>
        <button 
          onClick={() => { setSelectedTestament('OT'); setSelectedBook('GEN'); setSelectedChapter('1'); }}
          className={`text-left px-4 py-4 rounded-xl mb-3 transition-all font-serif text-xl md:text-2xl ${selectedTestament === 'OT' ? 'bg-orange-100/80 text-orange-900 font-bold shadow-sm border border-orange-200' : 'hover:bg-white/60 text-slate-700 bg-white/40 border border-white/50'}`}>
          Old Testament
        </button>
        <button 
          onClick={() => { setSelectedTestament('NT'); setSelectedBook('MAT'); setSelectedChapter('1'); }}
          className={`text-left px-4 py-4 rounded-xl transition-all font-serif text-xl md:text-2xl ${selectedTestament === 'NT' ? 'bg-orange-100/80 text-orange-900 font-bold shadow-sm border border-orange-200' : 'hover:bg-white/60 text-slate-700 bg-white/40 border border-white/50'}`}>
          New Testament
        </button>
      </div>

      {/* Col 2: Books */}
      <div className="w-[85vw] md:w-1/4 h-full shrink-0 snap-start flex flex-col border-r border-white/40 bg-white/40 backdrop-blur-md p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        <h3 className="text-slate-500 uppercase tracking-widest font-semibold text-[10px] md:text-xs mb-4">Book</h3>
        <div className="flex flex-col space-y-1.5 pb-20">
          {testamentBooks.map(bookId => (
            <button 
              key={bookId}
              onClick={() => { setSelectedBook(bookId); setSelectedChapter('1'); }}
              className={`text-left px-4 py-2.5 rounded-lg transition-all font-serif md:text-lg ${selectedBook === bookId ? 'bg-orange-100/90 text-orange-900 font-bold shadow-sm border border-orange-200' : 'hover:bg-white/70 text-slate-700 bg-white/30 border border-transparent'}`}>
              {BIBLE_BOOKS[bookId].name}
            </button>
          ))}
        </div>
      </div>

      {/* Col 3: Chapters */}
      <div className="w-[85vw] md:w-1/4 h-full shrink-0 snap-start flex flex-col border-r border-white/40 bg-white/50 backdrop-blur-md p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        <h3 className="text-slate-500 uppercase tracking-widest font-semibold text-[10px] md:text-xs mb-4">Chapter</h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 gap-2 pb-20">
          {chapters.map(ch => (
            <button 
              key={ch}
              onClick={() => setSelectedChapter(ch)}
              className={`py-2 rounded-lg text-center transition-all font-serif md:text-lg ${selectedChapter === ch ? 'bg-orange-200/90 text-orange-900 font-bold shadow-sm border border-orange-300' : 'hover:bg-white/80 bg-white/50 text-slate-700 border border-white/60'}`}>
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Col 4: Verses */}
      <div className="w-[85vw] md:w-1/4 h-full shrink-0 snap-start flex flex-col bg-white/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        <h3 className="text-slate-500 uppercase tracking-widest font-semibold text-[10px] md:text-xs mb-4">Verse</h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 gap-2 pb-20">
          {verses.map(v => (
            <button 
              key={v}
              onClick={() => handleVerseClick(v)}
              className={`py-2 rounded-lg text-center transition-all hover:bg-orange-500 hover:text-white bg-white/60 text-slate-700 border border-white/80 shadow-sm font-serif md:text-lg hover:scale-[1.05] active:scale-95`}>
              {v}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
