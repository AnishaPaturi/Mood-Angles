# MoodAngles

A comprehensive mental health application designed to help users track their moods, manage wellness, and connect with psychiatrists. Built with modern web technologies for a seamless user experience.

## Features

- **Mood Tracking**: Log daily moods and visualize trends over time.
- **Daily Wellness Check-ins**: Record sleep quality, energy levels, and physical discomfort.
- **Medical History Management**: Store diagnoses, treatments, medications, and symptoms.
- **AI Insights**: Receive personalized recommendations and mood pattern analysis.
- **Appointment Scheduling**: Book and manage therapy sessions.
- **User Profiles**: Comprehensive profiles for users and psychiatrists.
- **Authentication**: Secure login/signup with password hashing and Google OAuth support.
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS.

## Tech Stack

### Frontend
- React 19
- Vite (build tool)
- Tailwind CSS (styling)
- React Router DOM (navigation)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js (Google OAuth)
- bcryptjs (password hashing)
- JWT (authentication)

### Machine Learning
- Python 3.x
- Pandas (data manipulation)
- Scikit-learn (machine learning)
- Joblib (model serialization)

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Python 3.x (for ML components)
- npm or yarn
- pip (Python package installer)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MoodAngles
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   npm install express mongoose dotenv cors python-shell openai
   ```

3. Install Python dependencies:
   ```bash
   pip install pandas scikit-learn joblib
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   MONGO_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret
   PORT=5000
   ```

5. Train the ML model (optional, if not already trained):
   ```bash
   cd backend/ml
   python train_model.py
   ```

6. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```

7. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

8. Open your browser to `http://localhost:5173` (Vite default).

## Usage

- **User Registration/Login**: Sign up as a user or psychiatrist.
- **Dashboard**: View mood trends, daily check-ins, and insights.
- **Profile**: Manage personal and medical information.
- **Appointments**: Schedule sessions with psychiatrists.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/psychiatrist/signup` - Psychiatrist registration
- `POST /api/auth/psychiatrist/login` - Psychiatrist login
- `GET /api/auth/profile` - Get user profile

### OAuth
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - OAuth callback

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.
