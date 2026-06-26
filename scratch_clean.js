const fs = require('fs');

function stripComments(code) {
  return code.replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`|\/\*[\s\S]*?\*\/)|(\/\/.*)/g, (match, g1) => {
    if (g1 && !g1.startsWith('/*')) {
      return g1;
    }
    return '';
  });
}

// Test cases
const testCode = `
const url = "http://google.com"; // This is a URL comment
/* Multi-line
comment here */
const x = 10; // normal comment
const msg = 'hello // inside string';
const template = \`
  // inside template
  /* inside template block */
  http://test.com
\`;
`;

console.log("ORIGINAL:");
console.log(testCode);
console.log("-------------------");
console.log("CLEANED:");
console.log(stripComments(testCode));
