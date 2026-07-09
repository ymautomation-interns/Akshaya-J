const str = "programming";

const result = str
  .split("")
  .filter((char, index) => str.indexOf(char) === index)
  .join("");

console.log(result);