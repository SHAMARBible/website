export interface BibleGroup {
  words: string;
  description: string;
  count: number;
  books: string[];
}

export interface TestamentData {
  name: string;
  bookCount: number;
  groups: BibleGroup[];
  description: string;
}

export interface BookData {
  name: string;
  chapters: number;
  acrostic: string;
  description: string;
}

export interface ChapterData {
  name: string;
  verses: number;
  acrostic: string;
  description: string;
}

export interface VerseSubword {
  letter: string;
  word: string;
  detail: string;
}

export interface VerseData {
  name: string;
  text: string;
  acrostic: string;
  subwords: VerseSubword[];
}

export interface ShamarData {
  target: string;
  theme: string;
  testament: TestamentData;
  book: BookData;
  chapter: ChapterData;
  verse: VerseData;
}

export const shamarData: ShamarData = {
  target: "Revelation 2:10",
  theme: "The Unveiling of Jesus Christ",
  testament: {
    name: "New Testament",
    bookCount: 27,
    groups: [
      {
        words: "JESUS",
        description: "Gospels & Acts (The Foundation)",
        count: 5,
        books: ["Matthew", "Mark", "Luke", "John", "Acts"]
      },
      {
        words: "GAVE US NEW LIFE",
        description: "Paul's Epistles (The Church Age)",
        count: 13,
        books: ["Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon"]
      },
      {
        words: "ETERNALLY",
        description: "General Epistles & Revelation (The Future)",
        count: 9,
        books: ["Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"]
      }
    ],
    description: "27 letters representing the 27 books of the New Testament."
  },
  book: {
    name: "Revelation",
    chapters: 22,
    acrostic: "YES JESUS WILL RETURN SOON",
    description: "22 letters for 22 chapters."
  },
  chapter: {
    name: "Chapter 2",
    verses: 29,
    // Removed commas so it renders continuously without vertical dividers
    acrostic: "EPHESUS SMYRNA PERGAMUM THYATIRA",
    description: "29 letters for 29 verses. Representing the four churches addressed in this chapter."
  },
  verse: {
    name: "Verse 10",
    text: "Do not fear what you are about to suffer. Behold, the devil is about to throw some of you into prison, that you may be tested, and for ten days you will have tribulation. Be faithful unto death, and I will give you the crown of life.",
    acrostic: "YIELDLESS",
    subwords: [
      { letter: "Y", word: "Yield", detail: "Do not fear" },
      { letter: "I", word: "Impending", detail: "what you are about to suffer." },
      { letter: "E", word: "Enemy", detail: "Behold, the devil" },
      { letter: "L", word: "Lockup", detail: "is about to throw some of you into prison," },
      { letter: "D", word: "Days", detail: "that you may be tested, and for ten days you will have tribulation." },
      { letter: "L", word: "Loyal", detail: "Be faithful" },
      { letter: "E", word: "End", detail: "unto death," },
      { letter: "S", word: "Sovereign", detail: "and I will give you" },
      { letter: "S", word: "Symbol", detail: "the crown of life." }
    ]
  }
};

export const ntBooksArray: string[] = [
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

export const fullTestamentAcrostic = shamarData.testament.groups.map(g => g.words).join(' ');

