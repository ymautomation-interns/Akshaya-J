const employeeNames = [
  "  Akash Kumar  ",
  "Priya Sharma",
  "John David",
  "Anu Priya",
  "Kiran Kumar",
  "Nivetha S",
  "Poorani Thirumurugan",
  "Tanisha Rafiq",
  "Arun Prakash",
  "Meena Lakshmi"
];
function stringMethods() {
  for (let i = 0; i < employeeNames.length; i++) {
    let name = employeeNames[i];
    console.log("Original Name :", name);

    let reverse = name.split("").reverse().join("");
    console.log("Reverse :", reverse);

    let words = name.trim().split(" ");
    console.log("Word Count :", words.length);

    let capitalize = name.trim().charAt(0).toUpperCase() + 
                     name.trim().slice(1);
    console.log("Capitalize :", capitalize);

    let removeSpaces = name.trim();
    console.log("Remove Extra Spaces :", removeSpaces);

    let original = name.trim().toLowerCase();
    let reversed = original.split("").reverse().join("");

    if (original === reversed) {
      console.log("Palindrome : Yes");
    }
    else {
      console.log("Palindrome : No");
    }

    let vowelCount = 0;
    for (let char of name.toLowerCase()) {
      if ("aeiou".includes(char)) {
        vowelCount++;
      }

    }
    console.log("Vowels :", vowelCount);

    let consonantCount = 0;

    for (let char of name.toLowerCase()) {

      if (
        char >= "a" &&
        char <= "z" &&
        !"aeiou".includes(char)
      ) {
        consonantCount++;
      }

    }

    console.log("Consonants :", consonantCount);

    let unique = "";

    for (let char of name) {

      if (!unique.includes(char)) {
        unique += char;
      }

    }

    console.log("Remove Duplicate :", unique);

  }

}
stringMethods();