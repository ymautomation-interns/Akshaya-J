const str = "JavaScript string methods are very useful for text processing";

const vowels = "aeiouAEIOU";
let count = 0;

for (const ch of str) {
  if (vowels.includes(ch)) {
    count++;
  }
}

console.log("Number of vowels:", count);