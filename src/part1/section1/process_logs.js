const fs = require("fs");
const readline = require("readline");
const path = require("path");

const LOG_FILE = "logs.txt";
const OUTPUT_DIR = "log_parts"; // תיקייה לאחסון קבצים מחולקים
const CHUNK_SIZE = 20000; // מספר שורות בכל חלק
const N = 10; // מספר שגיאות נפוצות להצגה

// חלוקת קובץ הלוגים לקבצים קטנים יותר
async function splitLogFile(logFile) {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const inputStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({ input: inputStream });

  let partNumber = 0;
  let lineCount = 0;
  let partData = [];

  for await (const line of rl) {
    partData.push(line);
    lineCount++;
    
    if (lineCount >= CHUNK_SIZE) {
      fs.writeFileSync(path.join(OUTPUT_DIR, `part_${partNumber}.txt`), partData.join("\n"));
      partNumber++;
      partData = [];
      lineCount = 0;
    }
  }

  // שמירת השורות האחרונות שלא הגיעו למגבלת CHUNK_SIZE
  if (partData.length > 0) {
    fs.writeFileSync(path.join(OUTPUT_DIR, `part_${partNumber}.txt`), partData.join("\n"));
  }
}

// סופרת מופעים של כל קוד שגיאה בקובץ
function countErrorsInFile(filename) {
  const errorCounts = {};
  const lines = fs.readFileSync(filename, "utf-8").split("\n");

  for (const line of lines) {
    if (line.trim()) {
      errorCounts[line] = (errorCounts[line] || 0) + 1;
    }
  }
  
  return errorCounts;
}

// ממזג את ספירת השגיאות מכל חלקי הלוגים
function mergeErrorCounts(parts) {
  const globalCounts = {};

  for (const part of parts) {
    const partCounts = countErrorsInFile(path.join(OUTPUT_DIR, part));

    for (const [error, count] of Object.entries(partCounts)) {
      globalCounts[error] = (globalCounts[error] || 0) + count;
    }
  }

  return globalCounts;
}

// מציאת ה-N שגיאות הנפוצות ביותר
function getTopErrors(errorCounts, n) {
  return Object.entries(errorCounts)
    .sort((a, b) => b[1] - a[1]) // ממיין בסדר יורד לפי כמות המופעים
    .slice(0, n);
}

// הפעלת תהליך עיבוד הלוגים
async function processLogs() {
  await splitLogFile(LOG_FILE); // חלוקת הלוגים לקבצים קטנים יותר
  const partFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith("part_"));
  const mergedCounts = mergeErrorCounts(partFiles); // מיזוג ספירות השגיאות
  const topErrors = getTopErrors(mergedCounts, N); // חישוב השגיאות הנפוצות ביותר
  console.log("Top", N, "Errors:", topErrors);
}

processLogs();
