import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEST_DIR = path.join(__dirname, '../public/data/acrostics');
const BOOKS_DEST_DIR = path.join(DEST_DIR, 'books');

const SHEET_ID = process.env.SHAMAR_SHEET_ID;
if (!SHEET_ID) {
  throw new Error("SHAMAR_SHEET_ID environment variable is missing in .env");
}

const getCsvUrl = (sheet) => `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheet}`;

async function fetchCsv(sheet) {
  console.log(`📡 Fetching ${sheet} tab...`);
  const url = getCsvUrl(sheet);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch sheet ${sheet} (Status: ${response.status})`);
  return await response.text();
}

const nameToId = {
  "Genesis": "GEN", "Exodus": "EXO", "Leviticus": "LEV", "Numbers": "NUM", "Deuteronomy": "DEU",
  "Joshua": "JOS", "Judges": "JDG", "Ruth": "RUT", "1 Samuel": "1SA", "2 Samuel": "2SA",
  "1 Kings": "1KI", "2 Kings": "2KI", "1 Chronicles": "1CH", "2 Chronicles": "2CH", "Ezra": "EZR",
  "Nehemiah": "NEH", "Esther": "EST", "Job": "JOB", "Psalms": "PSA", "Proverbs": "PRO",
  "Ecclesiastes": "ECC", "Song of Solomon": "SNG", "Isaiah": "ISA", "Jeremiah": "JER",
  "Lamentations": "LAM", "Ezekiel": "EZK", "Daniel": "DAN", "Hosea": "HOS", "Joel": "JOL",
  "Amos": "AMO", "Obadiah": "OBA", "Jonah": "JON", "Micah": "MIC", "Nahum": "NAM",
  "Habakkuk": "HAB", "Zephaniah": "ZEP", "Haggai": "HAG", "Zechariah": "ZEC", "Malachi": "MAL",
  "Matthew": "MAT", "Mark": "MRK", "Luke": "LUK", "John": "JHN", "Acts": "ACT",
  "Romans": "ROM", "1 Corinthians": "1CO", "2 Corinthians": "2CO", "Galatians": "GAL",
  "Ephesians": "EPH", "Philippians": "PHP", "Colossians": "COL", "1 Thessalonians": "1TH",
  "2 Thessalonians": "2TH", "1 Timothy": "1TI", "2 Timothy": "2TI", "Titus": "TIT",
  "Philemon": "PHM", "Hebrews": "HEB", "James": "JAS", "1 Peter": "1PE", "2 Peter": "2PE",
  "1 John": "1JN", "2 John": "2JN", "3 John": "3JN", "Jude": "JUD", "Revelation": "REV"
};

async function main() {
  if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });
  if (!fs.existsSync(BOOKS_DEST_DIR)) fs.mkdirSync(BOOKS_DEST_DIR, { recursive: true });

  // 1. Fetch data
  const booksCsv = await fetchCsv("Books");
  const otCsv = await fetchCsv("OT");
  const ntCsv = await fetchCsv("NT");

  // 2. Parse Testaments & Books Acrostics from 'Books' Tab
  console.log(`🧩 Parsing Books summary tab...`);
  const booksData = parse(booksCsv, { skip_empty_lines: true });
  
  const testaments = {
    meta: {
      version: "1.0",
      description: "Hierarchical acrostics for Shamar Bible memorization fetched from Google Sheets"
    },
    testaments: {
      OT: { acrostic: "", bookGroupAcrosticHints: {} },
      NT: { acrostic: "", bookGroupAcrosticHints: {} }
    }
  };

  const finalBooks = {};

  let currentTestamentId = null;
  for (let i = 1; i < booksData.length; i++) {
    const row = booksData[i];
    const nameCol = (row[0] || "").trim();
    const acrosticCol = (row[2] || "").trim();

    if (nameCol.toUpperCase() === "OLD TESTAMENT") {
      currentTestamentId = "OT";
      testaments.testaments.OT.acrostic = acrosticCol;
      continue;
    } else if (nameCol.toUpperCase() === "NEW TESTAMENT") {
      currentTestamentId = "NT";
      testaments.testaments.NT.acrostic = acrosticCol;
      continue;
    }

    const id = nameToId[nameCol];
    if (id) {
      finalBooks[id] = {
        acrostic: acrosticCol,
        chapterPhrase: "",
        chapterGroupAcrosticHints: {},
        chapters: {}
      };
    }
  }

  // 3. Process Chapters and Verses (OT and NT Tabs)
  const processTestamentTab = (tabName, csvData) => {
    console.log(`🧩 Parsing ${tabName} tab...`);
    const data = parse(csvData, { skip_empty_lines: true });

    let currentBookId = null;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const bookNameRaw = (row[0] || "").trim();
      const chapterNumRaw = (row[1] || "").trim();
      
      // If column A has a name, update context
      if (bookNameRaw && nameToId[bookNameRaw]) {
        currentBookId = nameToId[bookNameRaw];
      }

      // If B has a chapter number, it's a chapter row
      if (chapterNumRaw && parseInt(chapterNumRaw) > 0 && currentBookId) {
        const chapterNum = parseInt(chapterNumRaw).toString();
        const chapterAcrostic = (row[3] || "").trim();
        const chapterPhrase = (row[8] || "").trim(); // Col I

        if (!finalBooks[currentBookId].chapters) {
          finalBooks[currentBookId].chapters = {};
        }

        const verses = {};

        // Verses start at Col J (idx 9)
        // Let's iterate outward to grab all verses defined
        let verseCounter = 1;
        for (let colIdx = 9; colIdx < row.length; colIdx++) {
           const cellContent = (row[colIdx] || "").trim();
           if (!cellContent) {
             // Empty cell, we should still register the verse structure if it has a count?
             // Actually if it's completely empty we can emit empty structure!
             verses[verseCounter.toString()] = { acrostic: "", subwords: [] };
             verseCounter++;
             continue;
           }

           // Example: "LETTER: Lord, Elect, To"
           let verseAcrostic = "";
           const subwordsRaw = [];

           const splitIndex = cellContent.indexOf(':');
           if (splitIndex !== -1) {
             verseAcrostic = cellContent.substring(0, splitIndex).trim();
             const rest = cellContent.substring(splitIndex + 1).trim();
             if (rest) {
               const parts = rest.split(',');
               let letterIdx = 0;
               for (const part of parts) {
                 const rawWord = part.trim();
                 if (rawWord) {
                   let cleanWord = rawWord;
                   let wordCount = 0;
                   
                   // Match syntax like "Yield(3)" or "Yield (3)"
                   const match = rawWord.match(/^(.+?)(?:\s*\((\d+)\))?$/);
                   if (match) {
                     cleanWord = match[1].trim();
                     if (match[2]) {
                       wordCount = parseInt(match[2], 10);
                     }
                   }

                   const charIdx = Math.min(letterIdx, verseAcrostic.length - 1);
                   const assignedLetter = verseAcrostic.charAt(charIdx) || cleanWord.charAt(0) || "";
                   
                   subwordsRaw.push({
                     letter: assignedLetter.toUpperCase(),
                     word: cleanWord,
                     verseWordCount: wordCount
                   });
                   letterIdx++;
                 }
               }
             }
           } else {
             // Just an acrostic with no colon
             verseAcrostic = cellContent;
           }

           verses[verseCounter.toString()] = {
             acrostic: verseAcrostic,
             subwords: subwordsRaw
           };

           verseCounter++;
        }

        finalBooks[currentBookId].chapters[chapterNum] = {
          acrostic: chapterAcrostic,
          chapterPhrase: chapterPhrase,
          verses: verses
        };
      }
    }
  };

  processTestamentTab("OT", otCsv);
  processTestamentTab("NT", ntCsv);

  // 4. Write data natively
  fs.writeFileSync(path.join(DEST_DIR, 'testaments.json'), JSON.stringify(testaments, null, 2));
  
  let booksWritten = 0;
  for (const [id, bookData] of Object.entries(finalBooks)) {
    fs.writeFileSync(path.join(BOOKS_DEST_DIR, `${id}.json`), JSON.stringify(bookData, null, 2));
    booksWritten++;
  }

  console.log(`✅ Success! Wrote ${booksWritten} book datasets from Google Sheets.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
