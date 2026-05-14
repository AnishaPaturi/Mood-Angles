import { readFileSync } from 'fs';
const code = readFileSync('src/pages/tests/ADHDTest.jsx', 'utf8');
const lines = code.split(/\r?\n/);
const start = 347; // 0-indexed, line 348 is index 347
const end = 402;   // line 403 index 402
for (let i = start; i <= end; i++) {
  console.log(JSON.stringify(lines[i]));
}