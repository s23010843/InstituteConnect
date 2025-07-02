import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSessionSchema } from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

const googleAuthSchema = z.object({
  credential: z.string(),
});

const appleAuthSchema = z.object({
  authorization: z.object({
    code: z.string(),
    id_token: z.string(),
  }),
  user: z.object({
    email: z.string().email(),
    name: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
  }).optional(),
});

const contactFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.substring(7);
      const session = await storage.getSessionByToken(token);
      
      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      const user = await storage.getUser(session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Google OAuth authentication
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { credential } = googleAuthSchema.parse(req.body);
      
      // TODO: Verify Google JWT token
      // For now, we'll decode the JWT payload (in production, verify signature)
      const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
      
      const userData = {
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        provider: 'google' as const,
        providerId: payload.sub,
      };

      let user = await storage.getUserByEmail(userData.email);
      if (!user) {
        user = await storage.createUser(userData);
      }

      // Create session
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      await storage.createSession({
        userId: user.id,
        token,
        expiresAt,
      });

      res.json({ user, token });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(400).json({ message: "Authentication failed" });
    }
  });

  // Apple Sign-In authentication
  app.post("/api/auth/apple", async (req, res) => {
    try {
      const { authorization, user: appleUser } = appleAuthSchema.parse(req.body);
      
      // TODO: Verify Apple ID token
      // For now, we'll decode the JWT payload (in production, verify signature)
      const payload = JSON.parse(Buffer.from(authorization.id_token.split('.')[1], 'base64').toString());
      
      const userData = {
        email: payload.email,
        name: appleUser ? `${appleUser.name.firstName} ${appleUser.name.lastName}` : payload.email.split('@')[0],
        provider: 'apple' as const,
        providerId: payload.sub,
      };

      let user = await storage.getUserByEmail(userData.email);
      if (!user) {
        user = await storage.createUser(userData);
      }

      // Create session
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      await storage.createSession({
        userId: user.id,
        token,
        expiresAt,
      });

      res.json({ user, token });
    } catch (error) {
      console.error('Apple auth error:', error);
      res.status(400).json({ message: "Authentication failed" });
    }
  });

  // Sign out
  app.post("/api/auth/signout", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.substring(7);
      await storage.deleteSession(token);
      
      res.json({ message: "Signed out successfully" });
    } catch (error) {
      console.error('Sign out error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get programs
  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getAllPrograms();
      res.json(programs);
    } catch (error) {
      console.error('Get programs error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get faculty
  app.get("/api/faculty", async (req, res) => {
    try {
      const faculty = await storage.getAllFaculty();
      res.json(faculty);
    } catch (error) {
      console.error('Get faculty error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const formData = contactFormSchema.parse(req.body);
      
      // TODO: Send email or save to database
      console.log('Contact form submission:', formData);
      
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(400).json({ message: "Invalid form data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
