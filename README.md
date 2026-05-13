<div align="center">
  <!-- You can replace the src below with a link to your actual project logo/banner -->
  <img src="https://via.placeholder.com/150?text=Mood-Angles+Logo" alt="MoodAngles Logo" width="120" style="border-radius: 20px;"/>

  # 🧠 Mood-Angles
  
  **A Comprehensive, AI-Powered Mental Health & Telepsychiatry Platform**
  
  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
  [![Python](https://img.shields.io/badge/Python_ML-14354C?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

<br />

## 🌟 Overview

**Mood-Angles** isn't just a mood tracker; it is a holistic mental health companion. Built with cutting-edge web technologies, it bridges the gap between daily emotional awareness and professional psychiatric care. By combining seamless daily check-ins with predictive **Machine Learning insights**, Mood-Angles empowers users to understand their mental well-being on a deeper level while providing a highly secure portal to connect with certified professionals.

---

## ✨ Incredible Features

- **📊 Intelligent Mood Tracking:** Log your daily moods, energy levels, and physical discomfort. Visualize your emotional journey through interactive, beautiful trends and charts.
- **🤖 AI-Powered Insights:** Powered by a Python/Scikit-learn Machine Learning pipeline, the platform analyzes your history to uncover hidden patterns and deliver personalized wellness recommendations.
- **👨‍⚕️ Telepsychiatry Portal:** Direct scheduling system! Users can easily book, manage, and attend therapy sessions with registered psychiatrists based on real-time availability.
- **🔐 Secure Medical Profiles:** A highly secure vault for your medical history, current medications, diagnoses, and treatments.
- **🛡️ Enterprise-Grade Authentication:** Fortified with JWT, bcrypt password hashing, and seamless **Google OAuth** integration.
- **📱 Responsive & Premium Design:** A beautifully crafted, modern UI built with Tailwind CSS that feels native on both mobile and desktop screens.

---

## 🛠️ Tech Stack Architecture

Mood-Angles leverages a robust Microservices-inspired architecture combining the MERN stack with a dedicated Python ML engine.

### Frontend 🎨
- **React 19** & **Vite** for blazing-fast rendering and optimal performance.
- **Tailwind CSS** for a highly responsive, modern, and aesthetic user interface.
- **React Router DOM** for seamless client-side navigation.

### Backend ⚙️
- **Node.js** & **Express.js** providing a fast, scalable RESTful API.
- **MongoDB** & **Mongoose** for flexible, NoSQL document storage.
- **Passport.js** handling OAuth and **JWT** for stateless session management.

### AI & Machine Learning 🧠
- **Python 3.x** environment.
- **Scikit-Learn** & **Pandas** for data wrangling and predictive modeling.
- **Joblib** for high-performance model serialization.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or MongoDB Atlas Cloud)
- **Python 3.x** (with `pip`)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Mood-Angles.git
cd Mood-Angles
```

### 2. Backend Setup & Dependencies

Install Node.js dependencies for the API server:
```bash
cd backend
npm install
npm install express mongoose dotenv cors python-shell openai
```

### 3. Machine Learning Setup

Install the required Python packages for the AI engine:
```bash
pip install pandas scikit-learn joblib
```

### 4. Environment Variables

#### Frontend (.env)

Create a `.env` file in the `frontend/` directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_LOCAL_BACKEND=http://localhost:5000
VITE_PROD_BACKEND=https://your-production-backend-url.com
```

- `VITE_LOCAL_BACKEND` — URL of the backend server for local development (default: `http://localhost:5000`)
- `VITE_PROD_BACKEND` — URL of the deployed production backend (e.g., `https://mood-angles-6.onrender.com`)

#### Backend (.env)

Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_secure_jwt_secret
SESSION_SECRET=your_hyper_secure_session_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
HF_TOKEN=your_hugging_face_token
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
AGENT_PY_TIMEOUT_MS=60000
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

- `FRONTEND_URL` — Used for CORS and generating links in emails (set to your dev frontend URL locally, e.g., `http://localhost:5173`)

### 5. Train the AI Model (Optional)

If the pre-trained model isn't available, generate a new one:
```bash
cd backend
python train_model.py
```

### 6. Ignition 🔥

Start the backend server:
```bash
cd backend
node server.js
```

In a new terminal window, spin up the Vite frontend:
```bash
cd frontend
npm run dev
```
Navigate to `http://localhost:5173` to experience Mood-Angles!

---

## 🔌 Core API Endpoints

### 🛡️ Authentication
- `POST /api/auth/signup` - Register a new User
- `POST /api/auth/login` - Authenticate User
- `POST /api/auth/psychiatrist/signup` - Register a new Psychiatrist
- `POST /api/auth/psychiatrist/login` - Authenticate Psychiatrist
- `GET /api/auth/profile` - Fetch Profile Data

### 🌐 OAuth Integration
- `GET /api/auth/google` - Initiate Google OAuth Flow
- `GET /api/auth/google/callback` - Google OAuth Callback handler

---

## 🤝 Contributing

We welcome contributions to make Mood-Angles even better! 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <i>Crafted with ❤️ for Mental Wellness</i>
</div>
