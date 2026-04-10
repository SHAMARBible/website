import React, { createContext, useContext, useState, useEffect } from 'react';
import { TARGET_SCHEDULE } from '../data/metadata/bibleBooks';

interface AppContextType {
  targetBookId: string;
  targetChapter: string;
  targetVerse: string;
  setTargetBookId: (id: string) => void;
  setTargetChapter: (ch: string) => void;
  setTargetVerse: (vs: string) => void;
  explorationMode: boolean;
  setExplorationMode: (mode: boolean) => void;
  autoOpenListFocus: boolean;
  setAutoOpenListFocus: (mode: boolean) => void;
  navigationHistory: Array<{bookId: string, chapter: string, verse: string}>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = () => {
    try {
        const saved = localStorage.getItem('shamarNavHistory');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.length > 0) {
                return { history: parsed, active: parsed[0] };
            }
        }
    } catch (e) {
        console.error('Failed to parse nav history', e);
    }
    return { 
        history: [], 
        active: { bookId: 'JHN', chapter: '3', verse: '16' }
    };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const init = getInitialState();
  const [targetBookId, setTargetBookId] = useState(init.active.bookId);
  const [targetChapter, setTargetChapter] = useState(init.active.chapter);
  const [targetVerse, setTargetVerse] = useState(init.active.verse);
  const [explorationMode, setExplorationMode] = useState(true);
  const [autoOpenListFocus, setAutoOpenListFocus] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<Array<{bookId: string, chapter: string, verse: string}>>(init.history);

  // Track History
  useEffect(() => {
    setNavigationHistory(prev => {
      const current = { bookId: targetBookId, chapter: targetChapter, verse: targetVerse };
      if (prev[0]?.bookId === current.bookId && prev[0]?.chapter === current.chapter && prev[0]?.verse === current.verse) {
        return prev;
      }
      const newHistory = [current, ...prev].slice(0, 100); // keep last 100
      localStorage.setItem('shamarNavHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, [targetBookId, targetChapter, targetVerse]);

  return (
    <AppContext.Provider value={{
      targetBookId, setTargetBookId,
      targetChapter, setTargetChapter,
      targetVerse, setTargetVerse,
      explorationMode, setExplorationMode,
      autoOpenListFocus, setAutoOpenListFocus,
      navigationHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
