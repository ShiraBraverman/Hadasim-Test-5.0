const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const filePathCSV = path.join(__dirname, "family_data.csv");

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

// O(R) – R = number of rows in the CSV file
function saveCorrectedData(data) {
  const headers = "Person_Id,First_Name,Last_Name,Gender,Father_Id,Mother_Id,Spouse_Id";
  const output = data
    .map(
      (entry) =>
        `${entry.Person_Id},${entry.First_Name},${entry.Last_Name},${entry.Gender},${entry.Father_Id},${entry.Mother_Id},${entry.Spouse_Id}`
    )
    .join("\n");

  fs.writeFileSync("corrected_data.csv", `${headers}\n${output}`);
}

// O(R) – Fix missing spouse links (bidirectional correction)
function correctData(data) {
  const personById = {}; // O(R) to build the lookup map

  data.forEach((person) => {
    personById[person.Person_Id] = person; // O(1) insert → total O(R)
  });

  data.forEach((person) => {
    const spouseId = person.Spouse_Id;
    if (spouseId && personById[spouseId]) {
      const spouse = personById[spouseId];
      if (!spouse.Spouse_Id) {
        spouse.Spouse_Id = person.Person_Id; // O(1)
      }
    }
  });

  return data;
}

// O(R^2) – Build family tree, includes sibling detection (nested loop)
function buildFamilyTree(data) {
  const familyTree = [];

  data.forEach((person) => {
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

    // Sibling detection: for each person, scan all others → O(R^2)
    const siblings = data.filter(
      (sibling) =>
        sibling.Person_Id !== Person_Id &&
        (sibling.Father_Id === Father_Id && Father_Id ||
         sibling.Mother_Id === Mother_Id && Mother_Id)
    );

    siblings.forEach((sibling) => {
      familyTree.push({
        Person_Id,
        Relative_Id: sibling.Person_Id,
        Connection_Type:
          sibling.Gender === "Male"
            ? RELATIONSHIP_TYPES.BROTHER
            : RELATIONSHIP_TYPES.SISTER,
      });
    });
  });

  data.forEach((person) => {
    const children = data.filter(
      (child) =>
        child.Father_Id === person.Person_Id || child.Mother_Id === person.Person_Id
    );

    children.forEach((child) => {
      familyTree.push({
        Person_Id: person.Person_Id,
        Relative_Id: child.Person_Id,
        Connection_Type:
          child.Gender === "Male"
            ? RELATIONSHIP_TYPES.SON
            : RELATIONSHIP_TYPES.DAUGHTER,
      });
    });
  });

  return familyTree;
}

// O(F) – F = number of family relations generated
function saveFamilyTreeToCSV(data) {
  const headers = "Person_Id,Relative_Id,Connection_Type";
  const output = data
    .map(
      (entry) =>
        `${entry.Person_Id},${entry.Relative_Id},${entry.Connection_Type}`
    )
    .join("\n");

  fs.writeFileSync("family_tree.csv", `${headers}\n${output}`);
}

// O(R) – Read and parse CSV file
function main() {
  const data = [];

  fs.createReadStream(filePathCSV)
    .pipe(csv())
    .on("data", (row) => {
      data.push(row); // O(1) per row → total O(R)
    })
    .on("end", () => {
      const corrected = correctData(data);             // O(R)
      saveCorrectedData(corrected);                    // O(R)
      console.log("✔ corrected_data.csv saved");
      
      const familyTree = buildFamilyTree(corrected);   // O(R^2)
      saveFamilyTreeToCSV(familyTree);                 // O(F)
      console.log("✔ family_tree.csv saved");
    });
}

main();
