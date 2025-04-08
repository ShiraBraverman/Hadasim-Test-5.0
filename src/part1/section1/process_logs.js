const fs = require("fs");
const readline = require("readline");
const path = require("path");

const LOG_FILE = "logs.txt";
const OUTPUT_DIR = "log_parts";
const CHUNK_SIZE = 20000;
const N = 10;

// O(L) – L = total lines in log file
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

  if (partData.length > 0) {
    fs.writeFileSync(path.join(OUTPUT_DIR, `part_${partNumber}.txt`), partData.join("\n"));
  }
}

// O(M) – M = lines in one file
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

// O(L) – total lines across all parts
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

// O(E log E) – E = unique error types
function getTopErrors(errorCounts, n) {
  return Object.entries(errorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

// O(L + E log E)
async function processLogs() {
  await splitLogFile(LOG_FILE);
  const partFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith("part_"));
  const mergedCounts = mergeErrorCounts(partFiles);
  const topErrors = getTopErrors(mergedCounts, N);
  console.log("Top", N, "Errors:", topErrors);
}

processLogs();
