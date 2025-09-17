import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, find or create a user in DB
      // Example:
      User.findOne({ googleId: profile.id }, async (err, user) => {
        if (err) return done(err);
        if (!user) {
          const newUser = new User({
            firstName: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            terms: true
          });
          await newUser.save();
          return done(null, newUser);
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
