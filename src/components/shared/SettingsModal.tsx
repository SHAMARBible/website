import React, { useState } from 'react';
import { X, Pencil, ChevronDown, Check, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { BIBLE_BOOKS, BIBLE_BOOK_ORDER } from '../../data/metadata/bibleBooks';

export const SettingsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { targetBookId, setTargetBookId, targetChapter, setTargetChapter, targetVerse, setTargetVerse, navigationHistory } = useAppContext();

  // Selected State (allows user to cancel before applying)
  const [tempBook, setTempBook] = useState(targetBookId);
  const [tempChapter, setTempChapter] = useState(targetChapter);
  const [tempVerse, setTempVerse] = useState(targetVerse);

  const handleOpen = () => {
    setTempBook(targetBookId);
    setTempChapter(targetChapter);
    setTempVerse(targetVerse);
    setIsOpen(true);
  };

  const handleApply = () => {
    setTargetBookId(tempBook);
    setTargetChapter(tempChapter);
    setTargetVerse(tempVerse);
    setIsOpen(false);
  };

  const bookData = BIBLE_BOOKS[tempBook];
  const maxChapters = bookData ? bookData.verses.length : 1;
  const maxVerses = bookData ? bookData.verses[parseInt(tempChapter) - 1] || 1 : 1;

  // Fix bounds if switching books
  if (parseInt(tempChapter) > maxChapters) setTempChapter("1");
  if (parseInt(tempVerse) > maxVerses) setTempVerse("1");

  const activeBookData = BIBLE_BOOKS[targetBookId];

  return (
    <div className="relative">
      <button 
        onClick={handleOpen} 
        className="group flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1.5 hover:bg-orange-50/50 rounded-xl transition-all" 
        title="Edit Focus Target"
      >
        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase hidden md:block">Focus:</span>
        <div className="flex items-center gap-2 text-base md:text-xl font-serif text-slate-800 group-hover:text-orange-600 font-bold transition-colors">
          <span>{activeBookData?.name || targetBookId} {targetChapter}:{targetVerse}</span>
          <Pencil size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 mt-2 w-72 md:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-orange-200 p-5 z-50 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-orange-100">
              <h3 className="font-bold text-slate-800 tracking-wide text-sm md:text-base flex items-center">
                 <Pencil className="w-4 h-4 mr-2 text-orange-500" /> Focus Target
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 p-1.5 rounded-full transition-colors hidden sm:block">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto custom-scrollbar flex-shrink px-1 py-1">
              {/* Dropdowns */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Book</label>
                <div className="relative">
                  <select 
                    value={tempBook}
                    onChange={(e) => {
                        setTempBook(e.target.value);
                        setTempChapter("1");
                        setTempVerse("1");
                    }}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:bg-white transition-all cursor-pointer"
                  >
                    {BIBLE_BOOK_ORDER.map(id => (
                      <option key={id} value={id}>{BIBLE_BOOKS[id].name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
                </div>
              </div>

              <div className="flex gap-3">
                  <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Chapter</label>
                      <div className="relative">
                        <select 
                            value={tempChapter}
                            onChange={(e) => {
                                setTempChapter(e.target.value);
                                setTempVerse("1");
                            }}
                            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:bg-white transition-all cursor-pointer"
                        >
                            {Array.from({length: maxChapters}, (_, i) => i + 1).map(num => (
                                <option key={num} value={num.toString()}>{num}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
                      </div>
                  </div>
                  <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Verse</label>
                      <div className="relative">
                        <select 
                            value={tempVerse}
                            onChange={(e) => setTempVerse(e.target.value)}
                            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:bg-white transition-all cursor-pointer"
                        >
                            {Array.from({length: maxVerses}, (_, i) => i + 1).map(num => (
                                <option key={num} value={num.toString()}>{num}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
                      </div>
                  </div>
              </div>

              {navigationHistory.length > 1 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Recent Visits</label>
                  <div className="flex flex-col gap-1 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                    {navigationHistory.slice(1).map((loc, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTargetBookId(loc.bookId);
                          setTargetChapter(loc.chapter);
                          setTargetVerse(loc.verse);
                          setIsOpen(false);
                        }}
                        className="text-left text-xs sm:text-sm font-medium text-slate-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>{BIBLE_BOOKS[loc.bookId]?.name} {loc.chapter}:{loc.verse}</span>
                        <ChevronRight size={14} className="opacity-0 hover:opacity-100 text-orange-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actons */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex gap-3 shrink-0">
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-xl transition-colors"
                >
                Cancel
              </button>
              <button 
                onClick={handleApply}
                className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 font-bold py-2 rounded-xl transition-all flex justify-center items-center gap-2"
              >
                <Check size={16} /> Navigate
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
