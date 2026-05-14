import { readFileSync } from 'fs';
const code = readFileSync('src/pages/tests/PersonalityTest.jsx', 'utf8');
const lines = code.split(/\r?\n/);
let balance = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let change = 0;
  for (const ch of line) {
    if (ch === '{') change++;
    else if (ch === '}') change--;
  }
  if (i >= 370 && i <= 430) {
    console.log((i+1) + ': ' + (change>0?'+'+change:change<0?change:'0') + ' -> ' + balance + ' | ' + line.trim().substring(0,120));
  }
  balance += change;
}
console.log('Final balance:', balance);