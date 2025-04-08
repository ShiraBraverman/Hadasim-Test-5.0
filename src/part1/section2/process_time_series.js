const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const parquet = require("parquetjs");
const moment = require("moment");

const filePathCSV = path.join(__dirname, "time_series.csv");
const filePathParquet = path.join(__dirname, "time_series.parquet");
const outputCSVFile = path.join(__dirname, "result_csv.csv");
const outputParquetFile = path.join(__dirname, "result_parquet.csv");

let allCSVData = []; 
let allParquetData = []; 

// O(1) – constant time per row
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
    data: { timestamp: dateTimestamp, value },
  };
}

// O(1) – moment formatting is constant time
function formatTimestamp(timestamp) {
  return moment(timestamp).format("DD/MM/YYYY HH:mm");
}

// O(N) – N = number of output rows
function saveToCSVFile(data) {
  const csvData = data
    .map(({ start_time, average }) => `${start_time},${average}`)
    .join("\n");

  fs.writeFileSync(outputCSVFile, "start_time,average\n" + csvData);
}

// O(N) – N = number of output rows
function saveToParquetFile(data) {
  const csvData = data
    .map(({ start_time, average }) => `${start_time},${average}`)
    .join("\n");

  fs.writeFileSync(outputParquetFile, "start_time,average\n" + csvData);
}

// O(R) – R = number of CSV rows
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
              start_time: formatTimestamp(hour), 
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

// O(R) – R = number of Parquet rows
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
          start_time: formatTimestamp(hour), 
          average,
        });
      });
    });

    saveToParquetFile(allParquetData);
  } catch (err) {
    console.log("Error processing Parquet file:", err);
  }
}

// O(1) – fixed parsing logic
function parseTimestamp(timestamp) {
  const [day, month, year, hour, minute] = timestamp.split(/[\/: ]/);
  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

processCSVFile(filePathCSV)
  .then(() => {
    console.log("Finished processing CSV file.");
    return processParquetFile(filePathParquet);
  })
  .then(() => {
    console.log("Finished processing Parquet file.");
  })
  .catch((err) => console.log("Error processing files:", err));

// כאשר הנתונים מתקבלים בצורה של זרימה, כל שורה שנכנסת מעובדת מיד - מחושבת לה השעה המתאימה (בדיוק כמו קודם),
// ומעדכנים במבנה נתונים בזיכרון את הסכום והכמות של הערכים לאותה שעה. אחת לכמה זמן (או כשהשעה מתחלפת),
// ניתן לשמור את הממוצע לקובץ או לבסיס נתונים, כך שלא נחכה לסיום קובץ אלא מעבדים הכל בזמן אמת.
