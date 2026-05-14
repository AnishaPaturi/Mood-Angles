import { readFileSync } from 'fs';
const code = readFileSync('src/pages/tests/PersonalityTest.jsx', 'utf8');
const lines = code.split(/\r?\n/);
let pOpen = 0, pClose = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (const ch of line) {
    if (ch === '(') pOpen++;
    else if (ch === ')') pClose++;
  }
  if (i >= 370 && i <= 430) {
    const net = pOpen - pClose;
    console.log((i+1) + ' (parens net=' + net + '): ' + line.trim().substring(0,120));
  }
}
console.log('Total open:', pOpen, 'close:', pClose);