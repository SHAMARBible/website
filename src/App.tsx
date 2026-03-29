import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Home, Maximize, Minimize, Eye, EyeOff } from 'lucide-react';
import { GeometricBackground } from './components/shared/GeometricBackground';
import { shamarData } from './data/shamarData';

// View Components
import { IntroView } from './components/views/IntroView';
import { TestamentView } from './components/views/TestamentView';
import { BookView } from './components/views/BookView';
import { ChapterView } from './components/views/ChapterView';
import { VerseView } from './components/views/VerseView';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const [showAcrosticBreadcrumbs, setShowAcrosticBreadcrumbs] = useState(false);
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);

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
  const goToStep = (index: number) => setCurrentStep(index);

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-800 selection:bg-orange-200 bg-linear-to-b from-amber-50 via-orange-100 to-rose-200">
      <GeometricBackground />

      <div className="relative z-10 flex flex-col h-dvh w-full max-w-dvw p-2 sm:p-4 md:p-12">

        <header className={`shrink-0 transition-all duration-700 ease-in-out flex justify-between items-start w-full gap-2 mb-2 sm:mb-4 md:mb-6 lg:mb-8`}>
          {/* Left: Breadcrumbs */}
          <div className={`flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-base text-slate-600 font-medium tracking-wide transition-opacity duration-700 ease-in-out ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'} flex-1`}>
            <button onClick={() => goToStep(0)} className="hover:text-orange-600 transition-colors flex items-center bg-white/40 px-2 flex-shrink-0 whitespace-nowrap py-1 md:px-3 md:py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-sm">
              <Home size={12} className="mr-1 md:mr-1.5 md:w-4 md:h-4" /> Intro
            </button>
            
            {currentStep >= 1 && (
              <>
                <ChevronRight size={12} className="text-slate-400 flex-shrink-0 md:w-4 md:h-4" />
                <button onClick={() => goToStep(1)} className={`flex-shrink-0 whitespace-nowrap hover:text-orange-600 transition-colors bg-white/40 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-sm ${currentStep === 1 ? 'text-orange-800 font-bold border-orange-300' : ''}`}>
                  <span className="hidden sm:inline">{shamarData.testament.name}</span>
                  <span className="sm:hidden">NT</span>
                </button>
              </>
            )}

            {currentStep >= 2 && (
              <>
                <ChevronRight size={12} className="text-slate-400 flex-shrink-0 md:w-4 md:h-4" />
                <button onClick={() => goToStep(2)} className={`flex-shrink-0 whitespace-nowrap hover:text-orange-600 transition-colors bg-white/40 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-sm ${currentStep === 2 ? 'text-orange-800 font-bold border-orange-300' : ''}`}>
                  {shamarData.book.name}
                </button>
              </>
            )}

            {currentStep >= 3 && (
              <>
                <ChevronRight size={12} className="text-slate-400 flex-shrink-0 md:w-4 md:h-4" />
                <button onClick={() => goToStep(3)} className={`flex-shrink-0 whitespace-nowrap hover:text-orange-600 transition-colors bg-white/40 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-sm ${currentStep === 3 ? 'text-orange-800 font-bold border-orange-300' : ''}`}>
                  <span className="hidden sm:inline">{shamarData.chapter.name}</span>
                  <span className="sm:hidden">Ch {shamarData.chapter.name.replace('Chapter ', '')}</span>
                </button>
              </>
            )}

            {currentStep >= 4 && (
              <>
                <ChevronRight size={12} className="text-slate-400 flex-shrink-0 md:w-4 md:h-4" />
                <span className="flex-shrink-0 whitespace-nowrap bg-orange-100/80 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-orange-300 shadow-sm backdrop-blur-sm text-orange-800 font-bold">
                  {shamarData.verse.name.replace('Verse ', 'v')}
                </span>
              </>
            )}
          </div>

          {/* Right: Subtle Navigation Utilities */}
          <div className="transition-all duration-300 bg-white/50 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-full shadow-sm border border-slate-200/50 flex flex-wrap items-center justify-end space-x-1 sm:space-x-2 md:space-x-3 shrink-0">
            <button onClick={handlePrev} disabled={currentStep === 0} className={`p-0.5 md:p-1 lg:p-1.5 rounded-full transition-colors ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-orange-100 hover:text-orange-700'}`}>
              <ChevronLeft size={16} className="md:w-5 md:h-5" />
            </button>

            <div className="flex space-x-0.5 sm:space-x-1 md:space-x-1.5 items-center">
              {steps.map((step, idx) => (
                <button key={step.id} onClick={() => goToStep(idx)} className={`w-1 h-1 md:w-2 md:h-2 lg:w-2 lg:h-2 rounded-full transition-all duration-300 ${currentStep === idx ? 'bg-orange-500 w-2 md:w-4 lg:w-4' : 'bg-slate-300 hover:bg-orange-300'}`} title={step.title} />
              ))}
            </div>

            <button onClick={handleNext} disabled={currentStep === steps.length - 1} className={`p-0.5 md:p-1 lg:p-1.5 rounded-full transition-colors ${currentStep === steps.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-orange-100 hover:text-orange-700'}`}>
              <ChevronRight size={16} className="md:w-5 md:h-5" />
            </button>

            <div className="w-px h-3 md:h-4 lg:h-5 bg-slate-300/80 mx-0.5 md:mx-1"></div>

            <button onClick={toggleFullScreen} className="p-0.5 md:p-1 lg:p-1.5 text-slate-500 hover:text-orange-600 transition-colors" title="Toggle Full Screen">
              {presentationMode ? <Minimize size={14} className="md:w-4 md:h-4" /> : <Maximize size={14} className="md:w-4 md:h-4" />}
            </button>

            <div className="w-px h-3 md:h-4 lg:h-5 bg-slate-300/80 mx-0.5 md:mx-1"></div>

            <button onClick={() => setShowAcrosticBreadcrumbs(!showAcrosticBreadcrumbs)} className={`p-0.5 md:p-1 lg:p-1.5 transition-colors ${showAcrosticBreadcrumbs ? 'text-orange-600' : 'text-slate-500 hover:text-orange-600'}`} title="Toggle Acrostic Hierarchy Mapping">
              {showAcrosticBreadcrumbs ? <EyeOff size={14} className="md:w-4 md:h-4" /> : <Eye size={14} className="md:w-4 md:h-4" />}
            </button>
          </div>
        </header>

        <main className="grow relative w-full overflow-hidden rounded-xl md:rounded-3xl">
          <IntroView isActive={currentStep === 0} />
          <TestamentView isActive={currentStep === 1} />
          <BookView isActive={currentStep === 2} showAcrosticBreadcrumbs={showAcrosticBreadcrumbs} hoveredLevel={hoveredLevel} setHoveredLevel={setHoveredLevel} />
          <ChapterView isActive={currentStep === 3} showAcrosticBreadcrumbs={showAcrosticBreadcrumbs} hoveredLevel={hoveredLevel} setHoveredLevel={setHoveredLevel} />
          <VerseView isActive={currentStep === 4} showAcrosticBreadcrumbs={showAcrosticBreadcrumbs} hoveredLevel={hoveredLevel} setHoveredLevel={setHoveredLevel} />
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
