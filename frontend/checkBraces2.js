import { readFileSync } from 'fs';
const code = readFileSync('src/pages/tests/DepressionTest.jsx', 'utf8');
const lines = code.split(/\r?\n/);
let balance = 0;
for (let i = 110; i < 251; i++) {
  const line = lines[i];
  let change = 0;
  for (const ch of line) {
    if (ch === '{') change++;
    else if (ch === '}') change--;
  }
  balance += change;
  console.log((i+1) + ': ' + line.trim().substring(0, 120) + ' -> ' + (change>0?'+'+change:change<0?change:'0') + ' = ' + balance);
}