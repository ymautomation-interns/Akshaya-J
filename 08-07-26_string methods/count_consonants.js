const str = "JavaScript string methods are very useful for text processing";

const vowels = "aeiou";
const consonantCount = str
  .toLowerCase()
  .split("")
  .filter(
    ch =>
      ch >= "a" &&
      ch <= "z" &&
      !vowels.includes(ch)
  ).length;

console.log("Number of consonants:", consonantCount);