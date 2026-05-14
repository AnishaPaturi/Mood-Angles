import { readFileSync, writeFileSync } from 'fs';
const file = 'src/pages/tests/DepressionTest.jsx';
const code = readFileSync(file, 'utf8');
const lines = code.split(/\r?\n/);
let newLines = [];
for (let i = 0; i < lines.length; i++) {
  newLines.push(lines[i]);
  if (lines[i].trim() === '// ---------- Angel J ----------') {
    // Insert try { after this comment, with same indentation
    const indent = lines[i].match(/^\s*/)[0];
    newLines.push(indent + 'try {');
  }
}
writeFileSync(file, newLines.join('\r\n'));
console.log('Inserted try after Angel J comment');