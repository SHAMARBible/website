import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Home, Maximize, Minimize, Map, Settings } from 'lucide-react';
import { GeometricBackground } from './components/shared/GeometricBackground';
import { SettingsModal } from './components/shared/SettingsModal';
import { useAppContext } from './contexts/AppContext';
import { BIBLE_BOOKS } from './data/metadata/bibleBooks';

// View Components
import { IntroView } from './components/views/IntroView';
import { BibleExplorerView } from './components/views/BibleExplorerView';
import { TestamentView } from './components/views/TestamentView';
import { BookView } from './components/views/BookView';
import { ChapterView } from './components/views/ChapterView';
import { VerseView } from './components/views/VerseView';

export default function App() {
  const { targetBookId, targetChapter, targetVerse, explorationMode, setExplorationMode } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const [showAcrosticBreadcrumbs, setShowAcrosticBreadcrumbs] = useState(false);
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);

  const activeBookName = BIBLE_BOOKS[targetBookId]?.name || "Book";

  useEffect(() => {
    const handleFullscreenChange = () => {
      setPresentationMode(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const steps = [
    { id: 'intro', title: 'Introduction' },
    { id: 'testament', title: 'Testament Level' },
    { id: 'book', title: 'Book Level' },
    { id: 'chapter', title: 'Chapter Level' },
    { id: 'verse', title: 'Verse Level' }
  ];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const goToStep = (index: number) => {
    setCurrentStep(index);
    if (index === 0 || index === 1) {
      setHoveredLevel(null);
    }
  };

  const handleTopMenuClick = (index: number) => {
    goToStep(index);
    // Grab all direct view containers by tag or class and reset their scroll
    const containers = document.querySelectorAll('.custom-scrollbar');
    containers.forEach(c => c.scrollTo({ top: 0, behavior: 'instant' }));
  };

  return (
    <div className="min-h-dvh relative overflow-hidden font-sans text-slate-800 selection:bg-orange-200 bg-linear-to-b from-amber-50 via-orange-100 to-rose-200">
      <GeometricBackground />

      <div className="relative z-10 flex flex-col h-dvh w-full max-w-dvw p-2 sm:p-4 md:p-12">

        <header className="relative z-50 shrink-0 transition-all duration-700 ease-in-out flex flex-col md:flex-row justify-between items-center w-full gap-2 md:gap-4 mb-1 sm:mb-2">
          
          {/* Left: View Switcher Container */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-medium tracking-wide flex-1 order-2 md:order-1">
            <button 
                onClick={() => handleTopMenuClick(0)} 
                className={`hover:text-orange-600 transition-colors px-2 py-1 md:px-3 md:py-1.5 rounded-full border shadow-sm backdrop-blur-sm shrink-0 whitespace-nowrap
                ${currentStep === 0 ? 'bg-orange-100/90 text-orange-800 border-orange-300 font-bold' : 'bg-white/50 border-white/60 text-slate-600'}`}>
              <span className="hidden sm:inline">Introduction</span>
              <span className="sm:hidden">Intro</span>
            </button>
            <button 
                onClick={() => handleTopMenuClick(1)} 
                className={`hover:text-orange-600 transition-colors px-2 py-1 md:px-3 md:py-1.5 rounded-full border shadow-sm backdrop-blur-sm shrink-0 whitespace-nowrap
                ${currentStep === 1 ? 'bg-orange-100/90 text-orange-800 border-orange-300 font-bold' : 'bg-white/50 border-white/60 text-slate-600'}`}>
              Bible
            </button>
            <button 
                onClick={() => handleTopMenuClick(2)} 
                className={`hover:text-orange-600 transition-colors px-2 py-1 md:px-3 md:py-1.5 rounded-full border shadow-sm backdrop-blur-sm shrink-0 whitespace-nowrap
                ${currentStep === 2 ? 'bg-orange-100/90 text-orange-800 border-orange-300 font-bold' : 'bg-white/50 border-white/60 text-slate-600'}`}>
              <span className="hidden sm:inline">Testament</span>
              <span className="sm:hidden">Test.</span>
            </button>
            <button 
                onClick={() => handleTopMenuClick(3)} 
                className={`hover:text-orange-600 transition-colors px-2 py-1 md:px-3 md:py-1.5 rounded-full border shadow-sm backdrop-blur-sm shrink-0 whitespace-nowrap
                ${currentStep === 3 ? 'bg-orange-100/90 text-orange-800 border-orange-300 font-bold' : 'bg-white/50 border-white/60 text-slate-600'}`}>
              Book
            </button>
            <button 
                onClick={() => handleTopMenuClick(4)} 
                className={`hover:text-orange-600 transition-colors px-2 py-1 md:px-3 md:py-1.5 rounded-full border shadow-sm backdrop-blur-sm shrink-0 whitespace-nowrap
                ${currentStep === 4 ? 'bg-orange-100/90 text-orange-800 border-orange-300 font-bold' : 'bg-white/50 border-white/60 text-slate-600'}`}>
              <span className="hidden sm:inline">Chapter</span>
              <span className="sm:hidden">Chap.</span>
            </button>
            <button 
                onClick={() => handleTopMenuClick(5)} 
                className={`hover:text-orange-600 transition-colors px-2 py-1 md:px-3 md:py-1.5 rounded-full border shadow-sm backdrop-blur-sm shrink-0 whitespace-nowrap
                ${currentStep === 5 ? 'bg-orange-100/90 text-orange-800 border-orange-300 font-bold' : 'bg-white/50 border-white/60 text-slate-600'}`}>
              Verse
            </button>
          </div>

          {/* Center: The Global Settings Modal acts as the App Title Dropdown now */}
          <div className="flex justify-center items-center shrink-0 md:flex-1 order-1 md:order-2">
            <SettingsModal />
          </div>

          {/* Right: Utility Toggles */}
          <div className="flex justify-center md:justify-end items-center shrink-0 md:flex-1 order-3">
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 transition-all duration-300 bg-white/50 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm border border-slate-200/50">
              <button onClick={() => setShowAcrosticBreadcrumbs(!showAcrosticBreadcrumbs)} className={`flex items-center gap-1.5 p-1 md:px-2 md:py-1 rounded-md transition-colors ${showAcrosticBreadcrumbs ? 'text-orange-600 bg-orange-50' : 'text-slate-500 hover:text-orange-600 hover:bg-white/60'}`} title="Map">
                <Map size={16} />
                <span className="hidden lg:inline text-xs font-semibold uppercase tracking-wider">Map</span>
              </button>
              
              <div className="w-px h-4 md:h-5 bg-slate-300/80"></div>

              <button onClick={toggleFullScreen} className="flex items-center p-1 md:p-1.5 rounded-md text-slate-500 hover:text-orange-600 hover:bg-white/60 transition-colors" title="Full Screen">
                {presentationMode ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
            </div>
          </div>

        </header>

        <main className="grow relative w-full overflow-hidden rounded-xl md:rounded-3xl z-10">
          <IntroView isActive={currentStep === 0} setExplorationMode={setExplorationMode} goToStep={goToStep} />
          <BibleExplorerView isActive={currentStep === 1} goToStep={goToStep} />
          <TestamentView isActive={currentStep === 2} goToStep={goToStep} />
          <BookView isActive={currentStep === 3} showAcrosticBreadcrumbs={showAcrosticBreadcrumbs} hoveredLevel={hoveredLevel} setHoveredLevel={setHoveredLevel} goToStep={goToStep} />
          <ChapterView isActive={currentStep === 4} showAcrosticBreadcrumbs={showAcrosticBreadcrumbs} hoveredLevel={hoveredLevel} setHoveredLevel={setHoveredLevel} goToStep={goToStep} />
          <VerseView isActive={currentStep === 5} showAcrosticBreadcrumbs={showAcrosticBreadcrumbs} hoveredLevel={hoveredLevel} setHoveredLevel={setHoveredLevel} goToStep={goToStep} />
        </main>



      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(251, 146, 60, 0.4); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(251, 146, 60, 0.7); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}} />
    </div>
  );
}
