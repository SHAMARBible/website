import React, { useState, useEffect } from 'react';
import { Layers, BookOpen, Loader2 } from 'lucide-react';
import { InteractiveAcrostic } from '../shared/InteractiveAcrostic';
import { useAppContext } from '../../contexts/AppContext';
import { BIBLE_BOOKS, BIBLE_BOOK_ORDER, NT_GROUPS, OT_GROUPS } from '../../data/metadata/bibleBooks';
import { fetchTestamentsOverview, TestamentsData } from '../../api/acrosticFetcher';

export interface TestamentViewProps {
  isActive: boolean;
  goToStep: (index: number) => void;
}

export const TestamentView: React.FC<TestamentViewProps> = ({ isActive, goToStep }) => {
  const { targetBookId, setTargetBookId, explorationMode } = useAppContext();
  const [hoveredGroupIndex, setHoveredGroupIndex] = useState<number | null>(null);
  const [hoveredBookIdx, setHoveredBookIdx] = useState<number | null>(null);
  const [data, setData] = useState<TestamentsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine if active target is OT or NT
  const isOT = BIBLE_BOOK_ORDER.indexOf(targetBookId) < 39;
  const groupsToUse = isOT ? OT_GROUPS : NT_GROUPS;
  const testamentDisplay = isOT ? "Old Testament" : "New Testament";
  const testamentBookCount = isOT ? 39 : 27;

  useEffect(() => {
    fetchTestamentsOverview()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed Testaments Fetch:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Loader2 className="animate-spin text-orange-500 w-8 h-8 md:w-12 md:h-12" />
      </div>
    );
  }

  const rawAcrostic = isOT ? data?.testaments.OT.acrostic : data?.testaments.NT.acrostic;
  if (!rawAcrostic) return null;

  return (
    <div className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="my-auto w-full flex flex-col items-center py-2 sm:py-3 md:py-4">
        <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2 md:mb-3">
          <Layers className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5" />
          <h3 className="text-slate-500 uppercase tracking-widest font-semibold text-[10px] sm:text-xs md:text-sm">Testament Level</h3>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-2 sm:mb-3 md:mb-4 text-slate-800 text-center leading-tight">
          {testamentDisplay}
        </h2>
        <div className="flex items-center text-orange-600 font-medium tracking-widest uppercase mb-4 sm:mb-6 md:mb-10 text-[9px] sm:text-[10px] md:text-xs border-b border-orange-200 pb-1 sm:pb-2">
          <BookOpen size={12} className="mr-1 sm:mr-2 md:w-3.5 md:h-3.5" /> {testamentBookCount} Books
        </div>

        <div className="mb-4 sm:mb-6 md:mb-10 w-full max-w-4xl px-2 sm:px-4">
          <InteractiveAcrostic text={rawAcrostic} hoverType="testament" />
        </div>

        <div className="w-full max-w-4xl flex flex-col space-y-2 sm:space-y-3 md:space-y-4 px-2 sm:px-4">
          {groupsToUse.map((group, idx) => {
            const isGroupHovered = hoveredGroupIndex === idx;
            // Running offset tracks the starting letter index (1-based globally for the acronym logic)
            const runningOffset = groupsToUse.slice(0, idx).reduce((acc, curr) => acc + curr.books.length, 0);

            let activeLocalIdx = null;
            if (hoveredBookIdx !== null && hoveredBookIdx > runningOffset && hoveredBookIdx <= runningOffset + group.books.length) {
                activeLocalIdx = hoveredBookIdx;
            }
            
            // Map the active global book index back into this local group's array
            const activeBookId = activeLocalIdx ? group.books[activeLocalIdx - runningOffset - 1] : null;
            const activeBookName = activeBookId ? BIBLE_BOOKS[activeBookId].name : null;

            return (
              <div
                key={idx}
                className="flex flex-col bg-white/40 backdrop-blur-sm border border-white/50 p-3 sm:p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 group cursor-default"
                onMouseEnter={() => setHoveredGroupIndex(idx)}
                onMouseLeave={() => setHoveredGroupIndex(null)}
              >
                <div className="flex flex-col md:flex-row items-center justify-between w-full">
                  <div className="flex-1 text-center md:text-left mb-2 md:mb-0 w-full max-w-full pl-1 sm:pl-2 md:pl-3">
                    <InteractiveAcrostic
                      text={group.words}
                      hoverType="testament-card"
                      startIdxOffset={runningOffset}
                      naked={true}
                      justifyClass="justify-center md:justify-start"
                      textClass="text-base sm:text-xl md:text-2xl lg:text-3xl font-serif text-orange-700 font-semibold tracking-widest"
                      onHoverChange={(i) => setHoveredBookIdx(i)}
                      externalHoverIdx={hoveredBookIdx}
                    />
                  </div>

                  <div className="relative flex flex-col items-center md:items-end text-center md:text-right min-w-35 md:min-w-55 min-h-[36px] md:min-h-11 justify-center">
                    <div className={`absolute transition-all duration-300 ${activeBookName ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
                      <span className="text-xs sm:text-sm md:text-base font-bold text-orange-700 bg-orange-100/90 px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl border border-orange-300/60 shadow-sm tracking-wider block">
                        {activeBookName}
                      </span>
                    </div>
                    <div className={`flex flex-col items-center md:items-end transition-all duration-300 ${activeBookName ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                      <span className="text-slate-600 font-medium tracking-wide uppercase text-[8px] sm:text-[10px] md:text-xs mb-1 text-center md:text-right">{group.description}</span>
                      <span className="text-[7.5px] sm:text-[9px] md:text-[10px] font-bold text-orange-600/80 bg-orange-100/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-orange-200/50 block w-max">
                        {group.books.length} BOOKS
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`w-full overflow-hidden transition-all duration-500 ease-in-out flex justify-center md:justify-start ${isGroupHovered || activeBookName ? 'max-h-24 opacity-100 mt-2 sm:mt-3 md:mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                  <div className="text-[8px] sm:text-[9px] md:text-xs text-slate-500 font-medium tracking-wide flex flex-wrap justify-center md:justify-start gap-x-1 sm:gap-x-1.5 gap-y-0.5 sm:gap-y-1 text-center md:text-left px-2 sm:px-3 py-1.5">
                    {group.books.map((bId, bIdx) => {
                      const localGlobalIdx = runningOffset + bIdx + 1;
                      const isThisBookHovered = hoveredBookIdx === localGlobalIdx;
                      return (
                        <React.Fragment key={bIdx}>
                          {bIdx > 0 && <span className="text-slate-300 pointer-events-none">•</span>}
                          <span
                            className={`inline-block transition-all duration-300 uppercase ${explorationMode ? 'cursor-pointer' : 'cursor-default'} ${isThisBookHovered ? 'text-orange-600 font-bold drop-shadow-sm scale-105' : 'hover:text-orange-400'}`}
                            onMouseEnter={() => setHoveredBookIdx(localGlobalIdx)}
                            onMouseLeave={() => setHoveredBookIdx(null)}
                            onClick={() => {
                                if (explorationMode) {
                                    setTargetBookId(bId);
                                    goToStep(2); // Jump to Book View
                                }
                            }}
                          >
                            {BIBLE_BOOKS[bId].name}
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 sm:mt-6 md:mt-8 text-[8px] sm:text-[10px] md:text-xs text-slate-500 max-w-2xl text-center font-light uppercase tracking-widest px-4">
          Hierarchical structure showing the overarching {testamentBookCount} books of the {testamentDisplay}.
        </p>
      </div>
    </div>
  );
};
