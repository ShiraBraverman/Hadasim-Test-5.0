const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const parquet = require("parquetjs");
const moment = require("moment");

const filePathCSV = path.join(__dirname, "time_series.csv");
const filePathParquet = path.join(__dirname, "time_series.parquet");
const outputCSVFile = path.join(__dirname, "result_csv.csv");
const outputParquetFile = path.join(__dirname, "result_parquet.csv");

let allCSVData = []; // כל הנתונים שיתאספו עבור CSV
let allParquetData = []; // כל הנתונים שיתאספו עבור Parquet

// פיצול הנתונים
function splitDataByDay(row) {
  let timestamp = null;

  Object.keys(row).forEach((key) => {
    const cleanKey = key.trim();
    if (cleanKey === "timestamp") {
      timestamp = row[key];
    }
  });

  const value = parseFloat(row["value"]);

  if (!timestamp || isNaN(value)) return null;

  const dateTimestamp = moment(parseTimestamp(timestamp)).toDate();
  const dayKey = moment(dateTimestamp).format("YYYY-MM-DD");

  return {
    dayKey,
    data: { timestamp: dateTimestamp, value }
  };
}

// המרת זמן לפורמט קריא (לדוגמה: 28/06/2025 01:00)
function formatTimestamp(timestamp) {
  return moment(timestamp).format("DD/MM/YYYY HH:mm");
}

// שמירת נתונים בקובץ CSV
function saveToCSVFile(data) {
  const csvData = data
    .map(({ start_time, average }) => `${start_time},${average}`)
    .join("\n");

  fs.writeFileSync(
    outputCSVFile,
    "start_time,average\n" + csvData
  );
}

// שמירת נתונים בקובץ Parquet
function saveToParquetFile(data) {
  const csvData = data
    .map(({ start_time, average }) => `${start_time},${average}`)
    .join("\n");

  fs.writeFileSync(
    outputParquetFile,
    "start_time,average\n" + csvData
  );
}

// עיבוד קובץ CSV ויצירת קובץ סופי
function processCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const dailyData = {};

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const splitData = splitDataByDay(row);
        if (splitData) {
          if (!dailyData[splitData.dayKey]) {
            dailyData[splitData.dayKey] = [];
          }
          dailyData[splitData.dayKey].push(splitData.data);
        }
      })
      .on("end", () => {
        Object.keys(dailyData).forEach((dayKey) => {
          const hourlyData = {};

          dailyData[dayKey].forEach((row) => {
            const hour = moment(row.timestamp).startOf("hour").toISOString();
            if (!hourlyData[hour]) hourlyData[hour] = { sum: 0, count: 0 };
            hourlyData[hour].sum += row.value;
            hourlyData[hour].count += 1;
          });

          Object.entries(hourlyData).forEach(([hour, { sum, count }]) => {
            const average = (sum / count).toFixed(2);
            allCSVData.push({
              start_time: formatTimestamp(hour), // שימוש בפורמט קריא
              average,
            });
          });
        });

        saveToCSVFile(allCSVData);
        resolve();
      })
      .on("error", reject);
  });
}

// עיבוד קובץ Parquet ויצירת קובץ סופי
async function processParquetFile(filePath) {
  try {
    const reader = await parquet.ParquetReader.openFile(filePath);
    const cursor = reader.getCursor();
    const dailyData = {};

    let record;
    while ((record = await cursor.next())) {
      const splitData = splitDataByDay(record);
      if (splitData) {
        if (!dailyData[splitData.dayKey]) {
          dailyData[splitData.dayKey] = [];
        }
        dailyData[splitData.dayKey].push(splitData.data);
      }
    }

    await reader.close();

    Object.keys(dailyData).forEach((dayKey) => {
      const hourlyData = {};

      dailyData[dayKey].forEach((row) => {
        const hour = moment(row.timestamp).startOf("hour").toISOString();
        if (!hourlyData[hour]) hourlyData[hour] = { sum: 0, count: 0 };
        hourlyData[hour].sum += row.value;
        hourlyData[hour].count += 1;
      });

      Object.entries(hourlyData).forEach(([hour, { sum, count }]) => {
        const average = (sum / count).toFixed(2);
        allParquetData.push({
          start_time: formatTimestamp(hour), // שימוש בפורמט קריא
          average,
        });
      });
    });

    saveToParquetFile(allParquetData);
  } catch (err) {
    console.error("Error processing Parquet file:", err);
  }
}

// המרת timestamp לפורמט סטנדרטי
function parseTimestamp(timestamp) {
  const [day, month, year, hour, minute] = timestamp.split(/[\/: ]/);
  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

// הפעלת תהליך העיבוד
processCSVFile(filePathCSV)
  .then(() => {
    console.log("Finished processing CSV file.");
    return processParquetFile(filePathParquet);
  })
  .then(() => {
    console.log("Finished processing Parquet file.");
  })
  .catch((err) => console.error("Error processing files:", err));

/**
 * ניתוח סיבוכיות זמן ריצה:
 * - קריאת כל שורה: O(N) (עובר על N שורות בקובץ)
 * - סידור לקבוצות שעות: O(N)
 * - חישוב ממוצע לכל שעה: O(N)
 * - כתיבה לקובץ CSV: O(N)
 * - כתיבה לקובץ Parquet: O(N)
 * -> סה"כ: O(N)
 * 
 * זמן הריצה כאן תלוי בכמות השורות שיש בקובץ.
 * אם מדובר בנתונים המתקבלים בזרימה (stream), אז נוכל לבצע את העיבוד בזמן אמת.
 * הזמן הכולל תלוי בעיקר בגודל הקובץ.
 */
