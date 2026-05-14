import { readFileSync, writeFileSync } from 'fs';
import { resolve, basename } from 'path';

// List of files to update
const files = [
  'frontend/src/pages/tests/AnxietyTest.jsx',
  'frontend/src/pages/tests/ADHDTest.jsx',
  'frontend/src/pages/tests/BipolarTest.jsx',
  'frontend/src/pages/tests/DepressionTest.jsx',
  'frontend/src/pages/tests/EQTest.jsx',
  'frontend/src/pages/tests/MentalHeathTodayTest.jsx',
  'frontend/src/pages/tests/NeuroTest.jsx',
  'frontend/src/pages/tests/PersonalityTest.jsx'
];

// Extract styles object from AutismTest.jsx
const autismTestPath = resolve('frontend/src/pages/tests/AutismTest.jsx');
let autismTestContent = readFileSync(autismTestPath, 'utf8');

// Find styles object boundaries (const styles = { ... })
const stylesStartMatch = autismTestContent.match(/const styles = {\s*/);
if (!stylesStartMatch) {
  console.error('Could not find styles object in AutismTest.jsx');
  process.exit(1);
}
let stylesStartIndex = stylesStartMatch.index + stylesStartMatch[0].length;
let braceCount = 1;
let i = stylesStartIndex;
while (i < autismTestContent.length && braceCount > 0) {
  if (autismTestContent[i] === '{') braceCount++;
  else if (autismTestContent[i] === '}') braceCount--;
  i++;
}
if (braceCount !== 0) {
  console.error('Could not find end of styles object in AutismTest.jsx');
  process.exit(1);
}
const autismStylesObject = autismTestContent.slice(stylesStartMatch.index, i);
const autismStylesInner = autismTestContent.slice(stylesStartMatch.index + stylesStartMatch[0].length, i - 1);

// Extract each required style property
const styleProperties = {};
const requiredStyles = [
  'heroScore', 'heroTitle', 'gaugeContainer', 'gaugeScore', 'gaugeTotal', 'gaugeLabels', 'heroBadge',
  'meaningSection', 'nextStepsSection', 'sectionTitle', 'meaningText',
  'stepsList', 'stepItem', 'stepIcon', 'stepText',
  'timingBox', 'toolsBox'
];

for (const styleName of requiredStyles) {
  const match = autismStylesInner.match(new RegExp(`${styleName}:\\s*([^},]+)(?:,|\\s*})`));
  if (match) {
    styleProperties[styleName] = match[1].trim();
  } else {
    console.warn(`Style property ${styleName} not found in AutismTest styles`);
  }
}

// Process each file
for (const filePath of files) {
  const fullPath = resolve(filePath);
  let content = readFileSync(fullPath, 'utf8');
  
  // Update styles object
  const stylesStartMatch = content.match(/const styles = {\s*/);
  if (stylesStartMatch) {
    let stylesStartIndex = stylesStartMatch.index + stylesStartMatch[0].length;
    let braceCount = 1;
    let i = stylesStartIndex;
    while (i < content.length && braceCount > 0) {
      if (content[i] === '{') braceCount++;
      else if (content[i] === '}') braceCount--;
      i++;
    }
    if (braceCount === 0) {
      const stylesObject = content.slice(stylesStartMatch.index, i);
      const stylesInnerStart = stylesStartMatch.index + stylesStartMatch[0].length;
      const stylesInnerEnd = i - 1;
      let stylesInner = content.slice(stylesInnerStart, stylesInnerEnd);
      
      // Add missing styles
      let additions = '';
      for (const [styleName, styleValue] of Object.entries(styleProperties)) {
        if (!stylesInner.includes(`${styleName}:`)) {
          additions += `  ${styleName}: ${styleValue},\n`;
        }
      }
      if (additions) {
        // Add before the closing brace (after the last property)
        stylesInner = stylesInner.trimEnd();
        if (stylesInner.endsWith(',')) {
          stylesInner += '\n';
        } else if (stylesInner.length > 0) {
          stylesInner += ',\n';
        }
        stylesInner += additions;
        const newStylesObject = `const styles = {${stylesInner}};`;
        content = content.replace(stylesObject, newStylesObject);
      }
    }
  }
  
  // Find result section: starts with '{result && ('
  const resultStartIndex = content.indexOf('{result && (');
  if (resultStartIndex === -1) {
    console.warn(`Could not find result section start in ${filePath}`);
    continue;
  }
  
  // Find matching end by counting braces and parentheses
  let braceCount = 1; // we have the opening brace from '{result && ('
  let parenCount = 1; // we have the opening parenthesis from '{result && ('
  let i = resultStartIndex + '{result && ('.length;
  
  while (i < content.length && (braceCount > 0 || parenCount > 0)) {
    const char = content[i];
    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
    else if (char === '(') parenCount++;
    else if (char === ')') parenCount--;
    i++;
  }
  
  if (braceCount !== 0 || parenCount !== 0) {
    console.warn(`Could not find matching end for result section in ${filePath}`);
    continue;
  }
  
  // Extract test name from file path
  const fileName = basename(filePath, '.jsx');
  const testName = fileName.replace(/Test$/, '');
  const heroTitle = `Your ${testName} Score`;
  
  // Determine score field
  let scoreField = 'result.score';
  if (fileName === 'PersonalityTest') {
    scoreField = 'result.scorePercent';
  }
  
  // Determine decision field name
  let decisionField = 'AngelJDecision';
  const decisionFieldMatch = content.match(/result\.([A-Za-z]+)Decision/);
  if (decisionFieldMatch) {
    decisionField = decisionFieldMatch[1] + 'Decision';
  }
  
  // Build new result section
  const newResultSection = `{result && (
  <>
    <div style={styles.heroScore}>
      <p style={styles.heroTitle}>${heroTitle}</p>
      <div style={styles.gaugeContainer}>
        <p style={styles.gaugeScore}>{${scoreField}}</p>
        <p style={styles.gaugeTotal}>/100</p>
      </div>
      <div style={styles.gaugeLabels}>
        <p>0</p>
        <p>50</p>
        <p>100</p>
      </div>
      {${scoreField} !== null && (
        <p style={styles.heroBadge}>
          {interpretLevel(${scoreField})}
        </p>
      )}
    </div>
    <p style={{ marginTop: 20, color: '#666', fontSize: 14 }}>
      Disclaimer: This test is not a diagnostic tool and should not be used as a substitute for professional medical advice.
    </p>
    <div style={styles.meaningSection}>
      <p style={styles.sectionTitle}>What This Means</p>
      <p style={styles.meaningText}>{${decisionField}.meaning}</p>
    </div>
    <div style={styles.nextStepsSection}>
      <p style={styles.sectionTitle}>Suggested Next Steps</p>
      <div style={styles.stepsList}>
        {${decisionField}.nextSteps.map((step, index) => (
          <div key={index} style={styles.stepItem}>
            <span style={styles.stepIcon}>✓</span>
            <span style={styles.stepText}>{step}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={styles.timingBox}>
      <p style={styles.sectionTitle}>When to connect with care</p>
      <p style={styles.meaningText}>{${decisionField}.urgency}</p>
    </div>
    <div style={styles.toolsBox}>
      <p style={styles.sectionTitle}>Tools you can use</p>
      <p style={styles.meaningText}>{${decisionField}.tools}</p>
    </div>
    {result.chainError && (
      <p style={{ color: 'red', marginTop: 10 }}>{result.chainError}</p>
    )}
    {result.savedOk && (
      <p style={{ color: 'green', marginTop: 10 }}>Saved successfully!</p>
    )}
    {result.savedError && (
      <p style={{ color: 'red', marginTop: 10 }}>{result.savedError}</p>
    )}
  </>
)}`;
  
  // Replace result section
  content = content.slice(0, resultStartIndex) + newResultSection + content.slice(i);
  
  // Write file
  writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

console.log('All files updated successfully.');