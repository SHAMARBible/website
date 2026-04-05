export interface SubwordMap {
  letter: string;
  word: string;
  verseWordCount: number;
}

export interface VerseAcrostic {
  acrostic: string;
  subwords: SubwordMap[];
}

export interface ChapterAcrostic {
  acrostic: string;
  chapterPhrase: string;
  verses: Record<string, VerseAcrostic>;
}

export interface BookAcrostic {
  acrostic: string;
  chapterGroupAcrosticHints: Record<string, string>;
  chapters: Record<string, ChapterAcrostic>;
}

export interface TestamentAcrostic {
  acrostic: string;
  bookGroupAcrosticHints: Record<string, string>;
}

export interface TestamentsData {
  meta: any;
  testaments: Record<string, TestamentAcrostic>;
  bookAcrostics: Record<string, string>;
}

/**
 * Fetches the top-level testament summaries containing overall NT and OT acrostics.
 */
export const fetchTestamentsOverview = async (): Promise<TestamentsData> => {
  const url = `${import.meta.env.BASE_URL}data/acrostics/testaments.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch testaments overview`);
  return response.json();
};

/**
 * Fetches the complete chapters, verses, and subword mappings for a specific book ID (e.g., 'GEN').
 * Uses Vite's BASE_URL to automatically handle GitHub Pages repository paths safely.
 */
export const fetchBookAcrostics = async (bookId: string): Promise<BookAcrostic> => {
  const url = `${import.meta.env.BASE_URL}data/acrostics/books/${bookId}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch acrostics for book: ${bookId}`);
  return response.json();
};
