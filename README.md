# 🧠 Mood-Angles – AI-Powered Mental Health & Telepsychiatry Platform

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-ML_Engine-blue?style=for-the-badge&logo=python&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployed-Render-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Development-brightgreen?style=for-the-badge)

---

## 🌟 Overview

**Mood-Angles** is a comprehensive, AI-powered mental health and telepsychiatry platform that bridges the gap between daily emotional awareness and professional psychiatric care. It combines intelligent mood tracking, predictive machine learning insights, and a secure telepsychiatry portal to provide holistic mental healthcare.

Built with the MERN stack (MongoDB, Express, React, Node.js) enhanced with Python-based machine learning agents for psychological assessments and diagnostic support.

---

## 🎯 Problem Statement

Mental health care faces significant challenges:

- ❌ Limited access to professional psychiatric care  
- ❌ Difficulty tracking mood patterns over time  
- ❌ No early warning system for mental health crises  
- ❌ Lack of AI-assisted diagnostic support  
- ❌ Inefficient appointment scheduling with psychiatrists  

👉 Mood-Angles addresses these by providing an end-to-end platform for mood tracking, AI analysis, and direct connection to verified psychiatrists.

---

## ⚙️ Key Features

### 📊 Intelligent Mood Tracking
- Daily mood, energy, and discomfort logging  
- Interactive charts and trend visualization  
- Historical emotion pattern analysis  

### 🤖 AI-Powered Insights
- Machine Learning pipeline (Scikit-Learn)  
- Predictive mental health pattern recognition  
- Personalized wellness recommendations  

### 🧠 Multi-Agent Assessment System
Five specialized Python AI agents for psychological analysis:
- **Agent C**: Cognitive assessment
- **Agent D**: Depression analysis
- **Agent E**: Emotional evaluation
- **Agent J**: Judgement & behavior analysis
- **Agent R**: Risk & safety evaluation

### 💬 RAG-Powered AI Chatbot ("Luna")
An empathetic mental health chatbot backed by **Retrieval-Augmented Generation (RAG)**:
- Converts user questions into mathematical embeddings via OpenAI (`text-embedding-ada-002`)
- Searches MongoDB for the **top 4 most relevant document chunks** using cosine similarity
- Injects retrieved context into the LLM prompt (Claude via OpenRouter) for accurate, knowledge-grounded replies
- Knowledge base includes **DSM-5 diagnostic criteria** and **clinical case studies** pre-loaded via `data/ingest_rag_data.py`
- User-uploaded documents (PDFs, images) are automatically extracted, chunked, embedded, and indexed into the RAG store in the background

### 👨‍⚕️ Telepsychiatry Portal
- Real-time psychiatrist availability  
- Direct appointment booking system  
- Role-based dashboards (User, Psychiatrist, Admin)  
- Invitation-based psychiatrist registration  

### 🔐 Enterprise Security
- JWT-based authentication  
- Bcrypt password hashing  
- Google OAuth integration  
- Role-based access control (User/Psychiatrist/Admin)  

### 📱 Comprehensive Profiles
- Medical history vault  
- Medication tracking  
- Treatment records  
- Safety assessments  

### 📈 Advanced Analytics
- Emotion record tracking  
- Psychological scale responses  
- Test result history  
- Progress monitoring  

### 📄 Report Generation
- Diagnosis reports  
- Treatment records  
- PDF export capabilities  

---

## 🏗️ System Architecture

```
User Chat / Upload
        │
        ▼
React Frontend ──→ Express Backend ──→ Python Agent (Subprocess)
                             │
                    ┌────────┴──────────┐
                    ▼                   ▼
          RAG Retrieval         ML Processing
     (embeddings → MongoDB    (ML prediction
      similarity search)         pipeline)
                    │                   │
                    ▼                   ▼
          DocumentChunk store      Assessment results
          (text + embeddings)           │
                    │                   ▼
                    ▼            Claude via OpenRouter
               LLM Prompt ←──────── "Luna" Chat Reply
              (system + context
               + user question)
                    │
                    ▼
                 MongoDB ← Credential & Data Storage ← Results
                    │
             Redis (optional caching)
                    │
              Email Service (nodemailer)
```

Core pipeline:
- **Frontend**: React components → API calls
- **Backend**: Express routes → Python agent spawning
- **RAG Layer** (`backend/rag/`): `ragChain.js` embeds queries, `vectorStore.js` does similarity search, `ingest.js` ingests documents
- **Knowledge Base**: DSM-5 criteria + clinical case studies seeded via `backend/data/ingest_rag_data.py`
- **AI Agents**: JSON stdin/stdout communication
- **Database**: MongoDB document storage

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router DOM |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Authentication** | JWT, Bcrypt, Passport.js, Google OAuth 2.0 |
| **AI/ML Engine** | Python 3.x, Scikit-Learn, Pandas, Joblib |
| **AI Chat / RAG** | LangChain, OpenAI Embeddings (`text-embedding-ada-002`), OpenRouter (Claude) |
| **File Upload** | Multer |
| **Email** | Nodemailer |
| **API Communication** | Python-Shell, Axios |
| **Deployment** | Render (Proposed), Local Development |

---

## 📁 Project Structure

### 🔹 Backend (`backend/`)

```
backend/
│
├── server.js                    # Main Express application entry point
├── .env                         # Backend environment variables
├── package.json                 # Dependencies: express, mongoose, openai, python-shell
├── requirements.txt             # Python dependencies for ML agents
│
├── agents/ (Python scripts)
│   ├── agentC.py               # Cognitive assessment agent
│   ├── agentD.py               # Depression analysis agent
│   ├── agentE.py               # Emotional evaluation agent
│   ├── agentJ.py               # Judgement & behavior analysis agent
│   ├── agentR.py               # Risk & safety evaluation agent
│   └── validation.py           # Agent input/output validation
│
├── rag/                        # RAG (Retrieval-Augmented Generation) chatbot engine
│   ├── ragChain.js             # Core RAG logic: query embedding, context retrieval, prompt building
│   ├── vectorStore.js          # MongoDB-backed vector store: upsert chunks, similarity search
│   └── ingest.js               # Document ingestion: text extraction, chunking, embedding, storing
│
├── data/                       # Knowledge-base data
│   ├── dsm5_knowledge.json     # DSM-5 diagnostic criteria (knowledge base)
│   ├── DataSet.csv             # Clinical case studies (knowledge base)
│   └── ingest_rag_data.py      # Python script to seed DSM-5 + clinical cases into MongoDB
│
├── scripts/
│   └── extract_text.py         # PDF/image text extraction for RAG ingestion
│
├── config/
│   └── db.js                   # MongoDB connection configuration
│
├── controllers/
│   └── authController.js       # Authentication & user management logic
│
├── models/                     # MongoDB schemas
│   ├── User.js                 # User accounts & profiles
│   ├── Psychiatrist.js         # Psychiatrist verification & details
│   ├── UserSettings.js         # User preferences & settings
│   ├── Conversation.js         # Chat conversations
│   ├── Diagnosis.js            # Mental health diagnoses
│   ├── DiagnosisReport.js      # Detailed diagnosis reports
│   ├── TreatmentRecord.js      # Treatment history
│   ├── MedicalRecord.js        # Medical history
│   ├── EmotionRecord.js        # Emotion tracking data
│   ├── JudgementRecord.js      # Clinical judgments
│   ├── ExplainabilityRecord.js # AI explainability data
│   ├── MonitoringRecord.js     # Patient monitoring data
│   ├── SafetyRecord.js         # Safety assessments
│   ├── ScaleResponse.js        # Psychological scale responses
│   ├── TestResult.js           # Assessment test results
│   ├── Feedback.js             # User feedback
│   ├── Invite.js               # Invitation system
│   ├── InviteRequest.js        # Invitation requests
│   ├── DebateRecord.js         # Discussion/debate records
│   └── DocumentChunk.js        # RAG document chunks (content + embedding + metadata)
│
├── routes/                     # API endpoints
│   ├── authRoutes.js           # Registration, login, logout, Google OAuth
│   ├── profileRoute.js         # User/profile management
│   ├── results.js              # Test results & assessments
│   ├── chatbotRoute.js         # AI chatbot ("Luna") — RAG-powered chat endpoint
│   ├── uploadRoute.js          # File upload handling (triggers RAG ingestion)
│   ├── otpRoutes.js            # OTP verification
│   ├── inviteRoutes.js         # Invitation system
│   ├── feedbackRoutes.js       # Feedback collection
│   └── settingsRoutes.js       # Settings management
│
├── uploads/                    # User-uploaded files (profile pictures, documents)
│
├── MoodAngles_Project_Report.html    # Project documentation
├── MoodAngles_Project_Report.docx    # Project report (Word)
├── Moodangels.pdf                     # PDF documentation
└── n8n.json                         # Workflow automation config
```

---

### 🔹 Frontend (`frontend/`)

```
frontend/
│
├── package.json                # Dependencies: react, vite, tailwind, axios
├── package-lock.json           # Locked versions
├── .env                        # Frontend environment variables
├── vite.config.js              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
│
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Main app with routing
│   ├── App.css                # Global styles
│   ├── index.css              # Tailwind imports
│   │
│   ├── components/            # Reusable UI components
│   │   └── UserWrapper.jsx    # Auth state wrapper
│   │
│   ├── pages/                 # Route pages
│   │   ├── Landing.jsx        # Landing/home page
│   │   ├── Login.jsx          # User login
│   │   ├── Signup.jsx         # User registration
│   │   ├── Logout.jsx         # Logout handler
│   │   ├── ForgotPassword.jsx # Password reset request
│   │   ├── ResetPassword.jsx  # Password reset form
│   │   ├── PLogin.jsx         # Psychiatrist login
│   │   ├── PSignup.jsx        # Psychiatrist registration
│   │   ├── AdminInvites.jsx   # Admin invitation management
│   │   ├── RequestInvite.jsx  # Invitation request page
│   │   ├── Profile.jsx        # User profile view/edit
│   │   ├── Settings.jsx       # User settings
│   │   ├── Help.jsx           # Help & support
│   │   ├── Support.jsx        # Support contact
│   │   ├── UploadD.jsx        # File upload
│   │   ├── TestPage.jsx       # Generic test template
│   │   ├── Articles.jsx       # Educational content
│   │   ├── ChatBot.jsx        # AI chatbot interface
│   │   ├── Dashboard.jsx      # Main landing dashboard
│   │   ├── UDashboard.jsx     # User-specific dashboard
│   │   ├── PDashboard.jsx     # Psychiatrist dashboard
│   │   │
│   │   └── tests/             # Psychological assessments
│   │       ├── ADHDTest.jsx
│   │       ├── AnxietyTest.jsx
│   │       ├── AutismTest.jsx
│   │       ├── BipolarTest.jsx
│   │       ├── DepressionTest.jsx
│   │       ├── EQTest.jsx
│   │       ├── MentalHeathTodayTest.jsx
│   │       ├── NeuroTest.jsx
│   │       └── PersonalityTest.jsx
│   │
│   ├── assets/                # Static assets
│   │   ├── PAvatar.png
│   │   ├── UAvatar.png
│   │   ├── react.svg
│   │   └── stethoscope.png
│   │
│   └── styles/                # Additional CSS
│       └── Login.css
│
└── dist/                      # Production build output
```

---

## 📦 Dependencies

### 🔹 Backend

```bash
cd backend
npm install
```

Key packages:
- **express** – REST API framework
- **mongoose** – MongoDB ODM
- **jsonwebtoken** – JWT authentication
- **bcryptjs** – Password hashing
- **google-auth-library** – Google OAuth
- **nodemailer** – Email sending
- **python-shell** – Python ML agent integration
- **openai** – OpenAI API integration
- **multer** – File uploads
- **uuid** – Unique ID generation
- **dotenv** – Environment variables
- **cors** – Cross-origin resource sharing
- **langchain** / **@langchain/openai** – RAG chain & embedding generation

### 🔹 Frontend

```bash
cd frontend
npm install
```

Key packages:
- **react** (19.1.1) – UI library
- **react-dom** – React renderer
- **react-router-dom** (7.8.2) – Client-side routing
- **vite** (7.1.2) – Build tool & dev server
- **tailwindcss** (4.1.12) – Utility-first CSS
- **axios** – HTTP client
- **lucide-react** – Icon library
- **google-oauth-client** – Google authentication
- **concurrently** – Run multiple commands

---

## 🔐 Environment Variables

### Backend `.env` (create in `backend/`)

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI/ML Services
OPENAI_API_KEY=your_openai_api_key         # Required for embeddings & RAG
OPENROUTER_API_KEY=your_openrouter_api_key # Required for chatbot (Claude)
HF_TOKEN=your_huggingface_token

# Email Service
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password

# Agent Configuration
AGENT_PY_TIMEOUT_MS=60000
PYTHON_PATH=python  # or python3 based on system
```

### Frontend `.env` (create in `frontend/`)

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_LOCAL_BACKEND=http://localhost:5000
VITE_PROD_BACKEND=https://mood-angles-6.onrender.com
```

---

## 🚀 Running the Project

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org))
- **MongoDB** (local or [MongoDB Atlas](https://cloud.mongodb.com))
- **Python** 3.x (for ML agents)

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/AnishaPaturi/Mood-Angles.git
cd Mood-Angles
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file with required variables (see Environment Variables section).

Start the backend:

```bash
npm start
# Server runs on http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file with required variables.

Start development server:

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

Or run both simultaneously:

```bash
npm run dev:all
```

---

### 4️⃣ Machine Learning Setup (Optional)

If training a custom mood prediction model:

```bash
cd backend
pip install pandas scikit-learn joblib
python train_model.py  # Generates mood_model.pkl
```

### 5️⃣ Seed the RAG Knowledge Base

Load DSM-5 diagnostic criteria and clinical case studies into MongoDB for the chatbot:

```bash
cd backend
python data/ingest_rag_data.py both
```

Then restart the backend server so the chatbot can access the new knowledge base.

---

## 🔌 API Endpoints

### 🛡️ Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Authenticate user |
| POST | `/psychiatrist/signup` | Register psychiatrist |
| POST | `/psychiatrist/login` | Authenticate psychiatrist |
| GET | `/profile` | Fetch user profile |
| GET | `/google` | Initiate Google OAuth |
| GET | `/google/callback` | Google OAuth callback |
| POST | `/logout` | Logout user |

---

### 👤 Profile Management (`/api/profile`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get current user profile |
| PUT | `/` | Update profile information |
| POST | `/upload-photo` | Upload profile picture |

---

### 🧠 Assessment & Results (`/api/results`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/test` | Submit assessment results |
| GET | `/history` | Get user test history |
| GET | `/test/:id` | Get specific test result |
| POST | `/analyze` | Trigger AI analysis |

---

### 📁 File Upload (`/api/uploads`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Upload file (profile pic, documents) |
| GET | `/:filename` | Download uploaded file |

---

### 🔔 Notifications & Invites (`/api/invite`, `/api/otp`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/request` | Request psychiatrist invite |
| GET | `/validate/:token` | Validate invite token |
| POST | `/send-otp` | Send OTP for verification |
| POST | `/verify-otp` | Verify OTP |

---

### 💬 Feedback (`/api/feedback`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Submit user feedback |
| GET | `/` | Get all feedback (admin) |

---

### 🤖 RAG Chatbot (`/api/chatbot`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | Send a message to "Luna" — retrieves relevant RAG context and returns a Claude-generated reply |

**Request body:**
```json { "message": "I've been feeling anxious lately", "history": [], "userId": "abc123" }
```
The `userId` is required for RAG context retrieval. If omitted, Luna responds without document context.

**Response:**
```json
{
  "reply": "I hear you, and it takes courage to share that...",
  "rag": { "chunks": 2, "used": true }
}
```

---

### 📚 RAG Admin (`/api/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rag-batch` | Bulk upsert document chunks (embeddings/computed at query time) |
| POST | `/rag-query` | Test RAG retrieval — computes embedding on-the-fly and returns scored chunks |

**POST `/rag-batch`** — Used by `data/ingest_rag_data.py` to seed the knowledge base:
```json
{ "chunks": [{ "userId": "global", "content": "...", "embedding": [], "metadata": { "source": "dsm5" } }] }
```

**POST `/rag-query`** — Manual retrieval test:
```json
{ "question": "What are symptoms of depression?", "userId": "global", "topK": 4 }
```

---

### 🤖 AI Agent Endpoint (`/api/angelR`)

**POST** `/api/angelR` – Spawns Python Agent R for risk evaluation  
Accepts JSON in request body, returns diagnostic summary via stdout.

---

## 📊 Example Request & Response

### Trigger AI Analysis

**Request:**

```bash
POST http://localhost:5000/api/results/analyze
Content-Type: application/json

{
  "userId": "65f123b4567890abc1234567",
  "scores": {
    "anxiety": 72,
    "depression": 45,
    "stress": 58
  },
  "responses": {
    "mood_rating": 3,
    "energy_level": 2,
    "sleep_quality": 4
  }
}
```

**Response:**

```json
{
  "success": true,
  "analysis": {
    "summary": "Moderate anxiety symptoms detected",
    "risk_level": "medium",
    "recommendations": [
      "Consider scheduling a consultation",
      "Practice daily mindfulness",
      "Monitor mood trends"
    ],
    "agent_output": {
      "score": 72,
      "condition": "Anxiety",
      "interpretation": "Moderate likelihood of Anxiety — consider monitoring symptoms"
    }
  },
  "timestamp": "2026-05-13T17:30:00.000Z"
}
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Python Agent Tests

```bash
cd backend
python -m pytest test_agents.py -v
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Manual Testing Checklist

- [ ] User signup/login with email/password
- [ ] Google OAuth login
- [ ] Psychiatrist invitation request
- [ ] Mood tracking entries
- [ ] Assessment test completion
- [ ] AI analysis generation
- [ ] Profile photo upload
- [ ] Email notification delivery
- [ ] Role-based dashboard access

---

## ⚠️ Limitations

- **External APIs**: Requires valid OpenAI/OpenRouter API keys for AI agents  
- **Database**: MongoDB must be running; no built-in fallback  
- **Email**: SMTP configuration required for OTP & notifications  
- **Python Path**: Agent scripts require system Python accessible in PATH  
- **CORS**: Frontend URL must be whitelisted in backend CORS config  
- **Production**: Requires proper SSL certificates for OAuth callbacks

---

## 🔮 Future Improvements

- 🔐 **PostgreSQL** migration for better relational data  
- 🤖 **Transformer models** for advanced NLP analysis  
- 📱 **React Native** mobile app  
- 🔔 **Real-time notifications** with WebSockets  
- 📊 **Advanced analytics dashboard** with D3.js charts  
- 🧩 **Plugin system** for additional assessment modules  
- 🌐 **Multi-language** support (i18n)  
- 🔒 **HIPAA compliance** audit & encryption enhancements  
- 🤝 **Insurance integration** for billing  
- 📈 **Research collaboration** mode for academic studies  

---

## 👥 Team

| GitHub Username | Name | Contributions |
|-----------------|------|---------------|
| [AnishaPaturi](https://github.com/AnishaPaturi) | Anisha | 112 |
| [Parinamika-13](https://github.com/Parinamika-13) | Vindhya / Parinamika | 39 |
| [vahinichilukamarri](https://github.com/vahinichilukamarri) | Vahini | 29 |
| [vindhya-tech](https://github.com/vindhya-tech) | Vindhya | 17 |


---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## 🙌 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository  
2. Create a **feature branch**: `git checkout -b feature/AmazingFeature`  
3. **Commit** changes: `git commit -m 'Add AmazingFeature'`  
4. **Push** to branch: `git push origin feature/AmazingFeature`  
5. Open a **Pull Request**  

For major changes, please open an issue first to discuss.

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/AnishaPaturi/Mood-Angles/issues)  
- **Email**: Check repository for team contact details  
- **Project Report**: `MoodAngles_Project_Report.docx`  

---

<div align="center">
  <b>Crafted with ❤️ for Mental Wellness</b><br>
  <i>Empowering minds through AI and compassionate technology</i>
</div>
