import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_PATH = path.join(__dirname, '../src/data/bibleMnemonics.json');
const DEST_DIR = path.join(__dirname, '../public/data/acrostics');
const BOOKS_DEST_DIR = path.join(DEST_DIR, 'books');

// Setup directories
if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });
if (!fs.existsSync(BOOKS_DEST_DIR)) fs.mkdirSync(BOOKS_DEST_DIR, { recursive: true });

console.log('Reading source massive JSON...');
const rawData = fs.readFileSync(SOURCE_PATH, 'utf-8');
const data = JSON.parse(rawData);

console.log('Processing testaments...');
const testaments = {
  meta: data.meta,
  testaments: {}
};

// Process testaments
for (const [key, t] of Object.entries(data.testaments || {})) {
  testaments.testaments[key] = {
    acrostic: t.mnemonic || '',
    bookGroupAcrosticHints: t.bookGroupMnemonicHints || {}
  };
}
fs.writeFileSync(path.join(DEST_DIR, 'testaments.json'), JSON.stringify(testaments, null, 2));

console.log('Processing 66 books...');
let totalPopulatedVerses = 0;

for (const [bookId, b] of Object.entries(data.books || {})) {
  const processedBook = {
    acrostic: b.mnemonic || '',
    chapterGroupAcrosticHints: b.chapterGroupMnemonicHints || {},
    chapters: {}
  };

  for (const [chapId, c] of Object.entries(b.chapters || {})) {
    processedBook.chapters[chapId] = {
      acrostic: c.mnemonic || '',
      verses: {}
    };

    for (const [verseNum, v] of Object.entries(c.verses || {})) {
      const acrostic = (v.mnemonic || '').trim();
      if (acrostic) totalPopulatedVerses++;
      
      processedBook.chapters[chapId].verses[verseNum] = {
        acrostic: acrostic,
        subwords: []
      };
    }
  }

  // Write individual book to public/data/acrostics/books/GEN.json
  const bookPath = path.join(BOOKS_DEST_DIR, `${bookId}.json`);
  fs.writeFileSync(bookPath, JSON.stringify(processedBook, null, 2));
}

console.log(`Success! Extracted 66 books and testaments into discrete JSON files.`);
console.log(`Total Populated Verses Migrated: ${totalPopulatedVerses}`);
