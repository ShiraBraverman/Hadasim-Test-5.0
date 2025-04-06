const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const _ = require("lodash");
const moment = require("moment");

const filePathCSV = path.join(__dirname, "data.csv");

const RELATIONSHIP_TYPES = {
  FATHER: "אב",
  MOTHER: "אם",
  SPOUSE: "בן זוג",
  SPOUSE_F: "בת זוג",
  BROTHER: "אח",
  SISTER: "אחות",
  SON: "בן",
  DAUGHTER: "בת",
};

// קריאה וניתוח של קובץ ה-CSV
function processCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        familyData = rows;
        resolve();
      })
      .on("error", (err) => reject(err));
  });
}

// טבלה לעיבוד הנתונים
let familyData = [];

// קריאה וניתוח של קובץ ה-CSV
function buildFamilyTree() {
  const familyTree = [];

  familyData.forEach((person) => {
    const { Person_Id, Father_Id, Mother_Id, Spouse_Id } = person;

    if (Father_Id) {
      familyTree.push({
        Person_Id,
        Relative_Id: Father_Id,
        Connection_Type: RELATIONSHIP_TYPES.FATHER,
      });
    }
    if (Mother_Id) {
      familyTree.push({
        Person_Id,
        Relative_Id: Mother_Id,
        Connection_Type: RELATIONSHIP_TYPES.MOTHER,
      });
    }
    if (Spouse_Id) {
      familyTree.push({
        Person_Id,
        Relative_Id: Spouse_Id,
        Connection_Type: RELATIONSHIP_TYPES.SPOUSE,
      });
    }
    const siblings = familyData.filter(
      (sibling) =>
        sibling.Person_Id !== Person_Id &&
        (sibling.Father_Id === Father_Id || sibling.Mother_Id === Mother_Id)
    );
    siblings.forEach((sibling) => {
      familyTree.push({
        Person_Id,
        Relative_Id: sibling.Person_Id,
        Connection_Type:
          sibling.Gender === "זכר"
            ? RELATIONSHIP_TYPES.BROTHER
            : RELATIONSHIP_TYPES.SISTER,
      });
    });
  });

  return familyTree;
}

// תרגיל 2 - השלמת בני זוג
function completeSpouses() {
  familyData.forEach((person) => {
    const { Person_Id, Spouse_Id } = person;

    if (Spouse_Id) {
      const spouse = familyData.find((p) => p.Person_Id === Spouse_Id);
      if (spouse) {
        if (!spouse.Spouse_Id) {
          spouse.Spouse_Id = Person_Id;
        }
      }
    }
  });
}

// שמירת התוצאות לקובץ CSV
function saveToCSV(data) {
  const headers = "Person_Id,Relative_Id,Connection_Type";
  const output = data
    .map(
      (entry) =>
        `${entry.Person_Id},${entry.Relative_Id},${entry.Connection_Type}`
    )
    .join("\n");

  fs.writeFileSync("family_tree_result.csv", `${headers}\n${output}`);
}

const main = async () => {
  try {
    await processCSV(filePathCSV);
    const familyTree = buildFamilyTree();
    completeSpouses();
    saveToCSV(familyTree);
    console.log(
      "The family tree has been built and saved to family_tree_result.csv"
    );
  } catch (err) {
    alert("Error processing the CSV file", err);
  }
};

main();
