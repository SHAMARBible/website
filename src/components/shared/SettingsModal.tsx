import React, { useState } from 'react';
import { X, Pencil } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { BIBLE_BOOKS, BIBLE_BOOK_ORDER } from '../../data/metadata/bibleBooks';

export const SettingsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { targetBookId, setTargetBookId, targetChapter, setTargetChapter, targetVerse, setTargetVerse } = useAppContext();

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

  return (
    <div className="relative">
      <button 
        onClick={handleOpen} 
        className="group flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1.5 hover:bg-orange-50/50 rounded-xl transition-all" 
        title="Edit Focus Target"
      >
        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase hidden md:block">Focus:</span>
        <div className="flex items-center gap-2 text-base md:text-xl font-serif text-slate-800 group-hover:text-orange-600 font-bold transition-colors">
          <span>{bookData?.name || targetBookId} {targetChapter}:{targetVerse}</span>
          <Pencil size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 mt-2 w-72 md:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-orange-200 p-4 z-100">
          <div className="flex justify-between items-center mb-4 border-b border-orange-100 pb-2">
            <h3 className="font-bold text-orange-900 text-sm md:text-base">Focus Target</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Book</label>
              <select 
                value={tempBook}
                onChange={(e) => {
                    setTempBook(e.target.value);
                    setTempChapter("1");
                    setTempVerse("1");
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-300"
              >
                {BIBLE_BOOK_ORDER.map(id => (
                  <option key={id} value={id}>{BIBLE_BOOKS[id].name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Chapter</label>
                    <select 
                        value={tempChapter}
                        onChange={(e) => {
                            setTempChapter(e.target.value);
                            setTempVerse("1");
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-300"
                    >
                        {Array.from({length: maxChapters}, (_, i) => i + 1).map(num => (
                            <option key={num} value={num.toString()}>{num}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Verse</label>
                    <select 
                        value={tempVerse}
                        onChange={(e) => setTempVerse(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-300"
                    >
                        {Array.from({length: maxVerses}, (_, i) => i + 1).map(num => (
                            <option key={num} value={num.toString()}>{num}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button 
                onClick={handleApply}
                className="w-full mt-4 bg-linear-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white font-bold py-2 rounded-xl transition-all shadow-md active:scale-95"
            >
                Apply Target
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
