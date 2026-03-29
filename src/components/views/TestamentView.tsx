import React, { useState } from 'react';
import { Layers, BookOpen } from 'lucide-react';
import { InteractiveAcrostic } from '../shared/InteractiveAcrostic';
import { shamarData, fullTestamentAcrostic, ntBooksArray } from '../../data/shamarData';

export interface TestamentViewProps {
  isActive: boolean;
}

export const TestamentView: React.FC<TestamentViewProps> = ({ isActive }) => {
  const [hoveredGroupIndex, setHoveredGroupIndex] = useState<number | null>(null);
  const [hoveredBookIdx, setHoveredBookIdx] = useState<number | null>(null);

  return (
    <div className={`absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <div className="my-auto w-full flex flex-col items-center py-4">
        <div className="flex items-center space-x-2 mb-3">
          <Layers className="text-orange-500" size={20} />
          <h3 className="text-slate-500 uppercase tracking-widest font-semibold text-sm">Testament Level</h3>
        </div>

        <h2 className="text-4xl md:text-5xl font-serif mb-4 text-slate-800">{shamarData.testament.name}</h2>
        <div className="flex items-center text-orange-600 font-medium tracking-widest uppercase mb-10 text-xs border-b border-orange-200 pb-2">
          <BookOpen size={14} className="mr-2" /> {shamarData.testament.bookCount} Books
        </div>

        <div className="mb-10 w-full max-w-4xl px-4">
          <InteractiveAcrostic text={fullTestamentAcrostic} hoverType="testament" />
        </div>

        <div className="w-full max-w-4xl flex flex-col space-y-4 px-4">
          {shamarData.testament.groups.map((group, idx) => {
            const isGroupHovered = hoveredGroupIndex === idx;
            const runningOffset = shamarData.testament.groups.slice(0, idx).reduce((acc, curr) => acc + curr.count, 0);

            // Check if a book within this specific group is currently hovered
            const activeLocalIdx = hoveredBookIdx !== null && hoveredBookIdx > runningOffset && hoveredBookIdx <= runningOffset + group.count ? hoveredBookIdx : null;
            const activeBookName = activeLocalIdx ? ntBooksArray[activeLocalIdx - 1] : null;

            return (
              <div
                key={idx}
                className="flex flex-col bg-white/40 backdrop-blur-sm border border-white/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 group cursor-default"
                onMouseEnter={() => setHoveredGroupIndex(idx)}
                onMouseLeave={() => setHoveredGroupIndex(null)}
              >
                <div className="flex flex-col md:flex-row items-center justify-between w-full">
                  <div className="flex-1 text-center md:text-left mb-3 md:mb-0">
                    <InteractiveAcrostic
                      text={group.words}
                      hoverType="testament-card" // Custom type so it suppresses default lower tooltip
                      startIdxOffset={runningOffset}
                      naked={true}
                      justifyClass="justify-center md:justify-start"
                      textClass="text-xl md:text-2xl lg:text-3xl font-serif text-orange-700 font-semibold tracking-widest"
                      onHoverChange={(idx) => setHoveredBookIdx(idx)}
                      externalHoverIdx={hoveredBookIdx}
                    />
                  </div>

                  {/* Dynamic Right Side: Cross-fades between Group Info and Specific Book Name */}
                  <div className="relative flex flex-col items-center md:items-end text-center md:text-right min-w-[220px] min-h-[44px] justify-center">
                    <div className={`absolute transition-all duration-300 ${activeBookName ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
                      <span className="text-sm md:text-base font-bold text-orange-700 bg-orange-100/90 px-4 py-1.5 rounded-xl border border-orange-300/60 shadow-sm tracking-wider block">
                        {activeBookName}
                      </span>
                    </div>
                    <div className={`flex flex-col items-center md:items-end transition-all duration-300 ${activeBookName ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                      <span className="text-slate-600 font-medium tracking-wide uppercase text-xs mb-1">{group.description}</span>
                      <span className="text-[10px] font-bold text-orange-600/80 bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200/50">
                        {group.count} BOOKS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Smooth Expanding Dropdown for Book List with Bidirectional Interactive Hover */}
                <div className={`w-full overflow-hidden transition-all duration-500 ease-in-out flex justify-center md:justify-start ${isGroupHovered || activeBookName ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                  <div className="text-[10px] md:text-xs text-slate-500 font-medium tracking-wide uppercase flex flex-wrap justify-center md:justify-start gap-x-1.5 gap-y-1">
                    {group.books.map((bookName, bIdx) => {
                      const localGlobalIdx = runningOffset + bIdx + 1;
                      const isThisBookHovered = hoveredBookIdx === localGlobalIdx;
                      return (
                        <React.Fragment key={bIdx}>
                          {bIdx > 0 && <span className="text-slate-300 pointer-events-none">•</span>}
                          <span
                            className={`cursor-pointer transition-all duration-300 ${isThisBookHovered ? 'text-orange-600 font-bold drop-shadow-sm scale-105' : 'hover:text-orange-400'}`}
                            onMouseEnter={() => setHoveredBookIdx(localGlobalIdx)}
                            onMouseLeave={() => setHoveredBookIdx(null)}
                          >
                            {bookName}
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

        <p className="mt-8 text-xs text-slate-500 max-w-2xl text-center font-light uppercase tracking-widest px-4">
          {shamarData.testament.description}
        </p>
      </div>
    </div>
  );
};
