// Quick smoke-test: import chatbotRoute to verify no module-load errors,
// then start it on a free port and POST /api/chatbot/chat.
import dotenv from "dotenv";
dotenv.config();

const express = (await import("express")).default;
const http    = (await import("http"));

const app = express();
app.use(express.json());

// Load the route with .test mjs suffix to avoid import extra extension issues
let chatbotRouter;
try {
  chatbotRouter = await import("./routes/chatbotRoute.js");
  chatbotRouter = chatbotRouter.default;
  console.log("chatbotRoute loaded OK");
} catch (e) {
  console.error("Failed to load chatbotRoute:", e.message);
  process.exit(1);
}

app.use("/api/chatbot", chatbotRouter);

const PORT = 5010; // different from 5000
await new Promise(resolve => app.listen(PORT, resolve));

async function post(path, body) {
  return new Promise((resolve) => {
    http.request(
      { hostname: "localhost", port: PORT, path, method: "POST",
        headers: { "Content-Type": "application/json" } },
      res => {
        const chunks = [];
        res.on("data", c => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
      }
    ).end(JSON.stringify(body));
  });
}

const scenarios = [
  {
    desc: "Condition question with no-AI (testResult present, API key has no credits)",
    body: { message: "what does my result mean?", history: [],
            context: { testResult: { score: 60, level: "Some concern", testType: "ADHD" } } }
  },
  {
    desc: "Generic question (no test context)",
    body: { message: "hello", history: [] }
  },
  {
    desc: "Math word — previously hit the /result/ ban regex",
    body: { message: "what is the result of 2 + 2?", history: [] }
  },
  {
    desc: "AI-related word — previously hit the /ai/ ban regex",
    body: { message: "what is AI?", history: [] }
  },
];

for (const s of scenarios) {
  const r = await post("/api/chatbot/chat", s.body);
  console.log(`\n=== ${s.desc} ===`);
  console.log("Status:", r.status);
  const first600 = r.body.substring(0, 600);
  console.log("Body:", first600);
}

process.exit(0);
