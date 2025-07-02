import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as AppleStrategy } from "passport-apple";
import dotenv from "dotenv";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "your-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("No email found in Google profile"));
      }

      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          email,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          googleId: profile.id,
          profileImageUrl: profile.photos?.[0]?.value
        });
        // Auto-verify email for Google users
        await storage.verifyUserEmail(email);
      } else if (!user.googleId) {
        // Link Google account to existing user
        await storage.updateUser(user.id, {
          googleId: profile.id,
          profileImageUrl: user.profileImageUrl || profile.photos?.[0]?.value
        });
        await storage.verifyUserEmail(email);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

// Apple OAuth Strategy (if configured)
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY,
    callbackURL: "/api/auth/apple/callback"
  }, async (accessToken, refreshToken, idToken, profile, done) => {
    try {
      const email = profile.email;
      if (!email) {
        return done(new Error("No email found in Apple profile"));
      }

      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          email,
          firstName: profile.name?.firstName,
          lastName: profile.name?.lastName,
          appleId: profile.id
        });
        // Auto-verify email for Apple users
        await storage.verifyUserEmail(email);
      } else if (!user.appleId) {
        // Link Apple account to existing user
        await storage.updateUser(user.id, {
          appleId: profile.id
        });
        await storage.verifyUserEmail(email);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// OAuth routes
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/api/auth/google/callback", 
  passport.authenticate("google", { session: false }),
  (req: any, res) => {
    // Generate JWT for frontend
    const { generateToken } = require("./auth.js");
    const token = generateToken(req.user);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

app.get("/api/auth/apple", passport.authenticate("apple"));
app.get("/api/auth/apple/callback",
  passport.authenticate("apple", { session: false }),
  (req: any, res) => {
    // Generate JWT for frontend
    const { generateToken } = require("./auth.js");
    const token = generateToken(req.user);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

// API routes
registerRoutes(app);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export default app;