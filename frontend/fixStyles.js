import { readFileSync, writeFileSync } from 'fs';
const files = [
  'src/pages/tests/AnxietyTest.jsx',
  'src/pages/tests/ADHDTest.jsx',
  'src/pages/tests/BipolarTest.jsx',
  'src/pages/tests/DepressionTest.jsx',
  'src/pages/tests/EQTest.jsx',
  'src/pages/tests/MentalHeathTodayTest.jsx',
  'src/pages/tests/NeuroTest.jsx',
  'src/pages/tests/PersonalityTest.jsx'
];

const completeStyles = `  /* Hero Score Section */
  heroScore: { 
    background: "linear-gradient(135deg, #7b61ff 0%, #9371ff 100%)", 
    borderRadius: "20px", 
    padding: "30px 20px", 
    color: "#fff",
    marginBottom: "20px"
  },
  heroTitle: { fontSize: "18px", fontWeight: "500", opacity: "0.9", marginBottom: "10px" },
  gaugeContainer: { position: "relative", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" },
  gaugeScore: { position: "absolute", top: "40px", fontSize: "36px", fontWeight: "800", color: "#fff" },
  gaugeTotal: { fontSize: "20px", fontWeight: "400", opacity: "0.7" },
  gaugeLabels: { display: "flex", justifyContent: "space-between", padding: "0 20px", marginTop: "10px", fontSize: "14px", fontWeight: "600" },
  heroBadge: { display: "inline-block", background: "rgba(255,255,255,0.2)", color: "#fff", padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "600", marginTop: "15px" },

  /* Content Sections */
  meaningSection: { background: "#fff", borderRadius: "12px", padding: "20px", marginTop: "20px" },
  nextStepsSection: { background: "#fff", borderRadius: "12px", padding: "20px", marginTop: "15px" },
  sectionTitle: { fontSize: "18px", fontWeight: "700", color: "#333", marginBottom: "12px" },
  meaningText: { fontSize: "15px", color: "#444", lineHeight: "1.6" },

  /* Steps */
  stepsList: { marginTop: "10px" },
  stepItem: { display: "flex", alignItems: "flex-start", marginBottom: "10px" },
  stepIcon: { color: "#22c55e", fontWeight: "bold", marginRight: "8px", fontSize: "16px" },
  stepText: { fontSize: "15px", color: "#444", flex: 1 },

  /* Timing and Tools */
  timingBox: { background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "8px", padding: "10px 15px", fontSize: "14px", marginTop: "15px" },
  toolsBox: { background: "#ede9fe", border: "1px solid #7b61ff", borderRadius: "8px", padding: "10px 15px", fontSize: "14px", marginTop: "15px" }`;

for (const file of files) {
  const path = `frontend/${file}`;
  let code = readFileSync(path, 'utf8');
  
  // Replace truncated heroScore and subsequent incomplete styles
  // Pattern: heroScore: { ... incomplete lines ... until we see either a complete style or the closing };  
  const before = code.substring(0, code.indexOf('heroScore:'));
  const after = code.substring(code.indexOf('heroScore:'));
  
  // Find where the broken styles section ends (at '};' that closes the styles object)
  // Find the last occurrence of '};' in the file (end of styles object)
  const lastBrace = after.lastIndexOf('};');
  if (lastBrace === -1) {
    console.error(`Could not find closing brace in ${file}`);
    continue;
  }
  
  // Replace everything from heroScore: up to that closing brace with complete styles + other original non-broken styles that come after
  // Actually the broken section includes all the new styles but they're incomplete. We'll replace from 'heroScore:' to the line before the closing '};' 
  // But we need to preserve any other styles that come after our new ones (there shouldn't be any after though since heroScore is near end)
  
  // Better: Find the line with 'heroScore:' and replace until '};'  with the full new styles
  const restAfterBroken = after.substring(lastBrace + 2); // everything after '};'
  
  // Build replacement
  const replacement = `heroScore: { 
    background: "linear-gradient(135deg, #7b61ff 0%, #9371ff 100%)", 
    borderRadius: "20px", 
    padding: "30px 20px", 
    color: "#fff",
    marginBottom: "20px"
  },
  heroTitle: { fontSize: "18px", fontWeight: "500", opacity: "0.9", marginBottom: "10px" },
  gaugeContainer: { position: "relative", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" },
  gaugeScore: { position: "absolute", top: "40px", fontSize: "36px", fontWeight: "800", color: "#fff" },
  gaugeTotal: { fontSize: "20px", fontWeight: "400", opacity: "0.7" },
  gaugeLabels: { display: "flex", justifyContent: "space-between", padding: "0 20px", marginTop: "10px", fontSize: "14px", fontWeight: "600" },
  heroBadge: { display: "inline-block", background: "rgba(255,255,255,0.2)", color: "#fff", padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "600", marginTop: "15px" },
  meaningSection: { background: "#fff", borderRadius: "12px", padding: "20px", marginTop: "20px" },
  nextStepsSection: { background: "#fff", borderRadius: "12px", padding: "20px", marginTop: "15px" },
  sectionTitle: { fontSize: "18px", fontWeight: "700", color: "#333", marginBottom: "12px" },
  meaningText: { fontSize: "15px", color: "#444", lineHeight: "1.6" },
  stepsList: { marginTop: "10px" },
  stepItem: { display: "flex", alignItems: "flex-start", marginBottom: "10px" },
  stepIcon: { color: "#22c55e", fontWeight: "bold", marginRight: "8px", fontSize: "16px" },
  stepText: { fontSize: "15px", color: "#444", flex: 1 },
  timingBox: { background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "8px", padding: "10px 15px", fontSize: "14px", marginTop: "15px" },
  toolsBox: { background: "#ede9fe", border: "1px solid #7b61ff", borderRadius: "8px", padding: "10px 15px", fontSize: "14px", marginTop: "15px" }`;
  
  code = before + replacement + restAfterBroken;
  writeFileSync(path, code);
  console.log(`Fixed styles in ${file}`);
}

console.log('All files processed');