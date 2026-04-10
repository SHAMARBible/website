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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [targetBookId, setTargetBookId] = useState('REV');
  const [targetChapter, setTargetChapter] = useState('2');
  const [targetVerse, setTargetVerse] = useState('10');
  const [explorationMode, setExplorationMode] = useState(false);
  const [autoOpenListFocus, setAutoOpenListFocus] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<Array<{bookId: string, chapter: string, verse: string}>>(() => {
    try {
      const saved = localStorage.getItem('shamarNavHistory');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse nav history', e);
    }
    return [];
  });

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

  // Verse of the Day (VotD) loader. Checks timestamp and switches active presentation target natively.
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const target = TARGET_SCHEDULE[today] || TARGET_SCHEDULE['default'];
    if (target) {
      setTargetBookId(target.bookId);
      setTargetChapter(target.chapter);
      setTargetVerse(target.verse);
    }
  }, []);

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
