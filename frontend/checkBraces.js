import { readFileSync } from 'fs';
const code = readFileSync('src/pages/tests/DepressionTest.jsx', 'utf8');
const lines = code.split(/\r?\n/);
let balance = 0;
for (let i = 110; i < 251; i++) {
  const line = lines[i];
  for (const ch of line) {
    if (ch === '{') balance++;
    else if (ch === '}') balance--;
  }
  // print every line or just when balance changes?
  console.log((i+1) + ' balance: ' + balance + ' -> ' + line.trim().substring(0, 120));
}
console.log('Final balance:', balance);