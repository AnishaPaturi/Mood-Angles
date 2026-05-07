const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('frontend/src');
let changed = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Replace definition of API_BASE
  content = content.replace(/(const|let)\s+API_BASE\s*=\s*["']http:\/\/localhost:5000["'];?/g, 'const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";');
  
  // Look for inline hardcoded fetch requests
  // e.g. axios.post("http://localhost:5000/api/...")
  // This is a bit trickier because we need template literals: \`${API_BASE}/api/...\`
  content = content.replace(/["']http:\/\/localhost:5000(\/api\/[^"']+)["']/g, '`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}$1`');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    changed++;
    console.log('Updated', file);
  }
});
console.log('Changed files:', changed);
