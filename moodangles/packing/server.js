import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React app origin
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// In-memory user store for demo
const users = [];

// Passport Google OAuth setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Find or create user
  let user = users.find(u => u.id === profile.id);
  if (!user) {
    user = { id: profile.id, displayName: profile.displayName, emails: profile.emails };
    users.push(user);
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Routes

// Email/password login (mock)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Simple check for demo
  const user = users.find(u => u.emails && u.emails[0].value === email);
  if (user && password === 'password123') { // mock password check
    return res.json({ success: true, user });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failure' }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect('http://localhost:3000');
  });

app.get('/login-failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
