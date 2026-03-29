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

  // Global tracking for hierarchical breadcrumb hovers
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
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-800 selection:bg-orange-200 bg-gradient-to-b from-amber-50 via-orange-100 to-rose-200">
      <GeometricBackground />

      <div className="relative z-10 flex flex-col h-screen p-6 md:p-12">

        {/* Breadcrumb Header */}
        <header className={`shrink-0 transition-opacity duration-700 ease-in-out ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'} flex flex-wrap items-center gap-2 text-sm md:text-base text-slate-600 font-medium tracking-wide mb-4 md:mb-6`}>
          <button onClick={() => goToStep(0)} className="hover:text-orange-600 transition-colors flex items-center bg-white/40 px-3 py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-sm">
            <Home size={16} className="mr-1.5" /> Intro
          </button>
          {currentStep >= 1 && (
            <>
              <ChevronRight size={16} className="text-slate-400" />
              <button onClick={() => goToStep(1)} className={`hover:text-orange-600 transition-colors bg-white/40 px-3 py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-sm ${currentStep === 1 ? 'text-orange-800 font-bold border-orange-300' : ''}`}>
                {shamarData.testament.name}
              </button>
            </>
          )}
          {currentStep >= 2 && (
            <>
              <ChevronRight size={16} className="text-slate-400" />
              <button onClick={() => goToStep(2)} className={`hover:text-orange-600 transition-colors bg-white/40 px-3 py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-sm ${currentStep === 2 ? 'text-orange-800 font-bold border-orange-300' : ''}`}>
                {shamarData.book.name}
              </button>
            </>
          )}
          {currentStep >= 3 && (
            <>
              <ChevronRight size={16} className="text-slate-400" />
              <button onClick={() => goToStep(3)} className={`hover:text-orange-600 transition-colors bg-white/40 px-3 py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-sm ${currentStep === 3 ? 'text-orange-800 font-bold border-orange-300' : ''}`}>
                {shamarData.chapter.name}
              </button>
            </>
          )}
          {currentStep >= 4 && (
            <>
              <ChevronRight size={16} className="text-slate-400" />
              <span className="bg-orange-100/80 px-3 py-1.5 rounded-full border border-orange-300 shadow-sm backdrop-blur-sm text-orange-800 font-bold">
                {shamarData.verse.name}
              </span>
            </>
          )}
        </header>

        {/* Main Content Container */}
        <main className="flex-grow relative w-full overflow-hidden">
          <IntroView isActive={currentStep === 0} />
          
          <TestamentView isActive={currentStep === 1} />
          
          <BookView 
            isActive={currentStep === 2} 
            showAcrosticBreadcrumbs={showAcrosticBreadcrumbs}
            hoveredLevel={hoveredLevel}
            setHoveredLevel={setHoveredLevel}
          />
          
          <ChapterView 
            isActive={currentStep === 3} 
            showAcrosticBreadcrumbs={showAcrosticBreadcrumbs}
            hoveredLevel={hoveredLevel}
            setHoveredLevel={setHoveredLevel}
          />
          
          <VerseView 
            isActive={currentStep === 4} 
            showAcrosticBreadcrumbs={showAcrosticBreadcrumbs}
            hoveredLevel={hoveredLevel}
            setHoveredLevel={setHoveredLevel}
          />
        </main>

        {/* Floating Presentation Controls */}
        <div
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 transition-all duration-300 opacity-30 hover:opacity-100 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200/50 flex items-center space-x-3 z-50 group hover:scale-105"
        >
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`p-1.5 rounded-full transition-colors ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-orange-100 hover:text-orange-700'}`}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex space-x-1.5">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => goToStep(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep === idx ? 'bg-orange-500 w-4' : 'bg-slate-300 hover:bg-orange-300'}`}
                title={step.title}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className={`p-1.5 rounded-full transition-colors ${currentStep === steps.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-orange-100 hover:text-orange-700'}`}
          >
            <ChevronRight size={20} />
          </button>

          <div className="w-px h-5 bg-slate-300/80 mx-1"></div>

          <button
            onClick={toggleFullScreen}
            className="p-1.5 text-slate-500 hover:text-orange-600 transition-colors"
            title="Toggle Full Screen"
          >
            {presentationMode ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          <div className="w-px h-5 bg-slate-300/80 mx-1"></div>

          <button
            onClick={() => setShowAcrosticBreadcrumbs(!showAcrosticBreadcrumbs)}
            className={`p-1.5 transition-colors ${showAcrosticBreadcrumbs ? 'text-orange-600' : 'text-slate-500 hover:text-orange-600'}`}
            title="Toggle Acrostic Hierarchy Mapping"
          >
            {showAcrosticBreadcrumbs ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

      </div>

      {/* Custom CSS for specific Intro Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(251, 146, 60, 0.4); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(251, 146, 60, 0.7); }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
}
