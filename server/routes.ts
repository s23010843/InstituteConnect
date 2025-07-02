import express from "express";
import rateLimit from "express-rate-limit";
import { storage } from "./storage.js";
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  generateOTP, 
  generateOTPExpiry,
  authenticateToken,
  optionalAuth,
  type AuthRequest 
} from "./auth.js";
import { sendOTPEmail, sendContactInquiry } from "./email.js";
import { 
  loginSchema, 
  registerSchema, 
  otpSchema, 
  insertInquirySchema,
  type LoginData,
  type RegisterData,
  type OtpData,
  type InsertInquiry
} from "../shared/schema.js";

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: "Too many authentication attempts, try again later." }
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 OTP requests per windowMs
  message: { message: "Too many OTP requests, try again later." }
});

// Auth Routes
router.post("/api/auth/register", authLimiter, async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Invalid input", 
        errors: result.error.errors 
      });
    }

    const { email, firstName, lastName, password } = result.data;

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create user with hashed password
    const passwordHash = await hashPassword(password);
    const user = await storage.createUser({
      email,
      firstName,
      lastName,
      passwordHash
    });

    // Generate and send OTP
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();
    await storage.updateUserOtp(email, otp, otpExpiry);
    await sendOTPEmail(email, otp);

    res.status(201).json({ 
      message: "Registration successful. Please verify your email with the OTP sent.",
      userId: user.id
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Invalid input", 
        errors: result.error.errors 
      });
    }

    const { email, password } = result.data;

    // Find user
    const user = await storage.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      // Generate and send new OTP
      const otp = generateOTP();
      const otpExpiry = generateOTPExpiry();
      await storage.updateUserOtp(email, otp, otpExpiry);
      await sendOTPEmail(email, otp);

      return res.status(403).json({ 
        message: "Email not verified. New OTP sent to your email.",
        requiresOtp: true,
        userId: user.id
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/auth/verify-otp", otpLimiter, async (req, res) => {
  try {
    const result = otpSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Invalid input", 
        errors: result.error.errors 
      });
    }

    const { email, otp } = result.data;

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otpCode || !user.otpExpiry) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otpCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Verify the user's email
    await storage.verifyUserEmail(email);

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: "Email verified successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl
      }
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/auth/resend-otp", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();
    await storage.updateUserOtp(email, otp, otpExpiry);
    await sendOTPEmail(email, otp);

    res.json({ message: "New OTP sent to your email" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      isEmailVerified: user.isEmailVerified
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Public Content Routes
router.get("/api/pages", async (req, res) => {
  try {
    const pages = await storage.getPages();
    res.json(pages);
  } catch (error) {
    console.error("Get pages error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/pages/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await storage.getPageBySlug(slug);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    console.error("Get page error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/news", async (req, res) => {
  try {
    const news = await storage.getNews();
    res.json(news);
  } catch (error) {
    console.error("Get news error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/news/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await storage.getNewsBySlug(slug);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Get news article error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/courses", async (req, res) => {
  try {
    const courses = await storage.getCourses();
    res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/courses/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await storage.getCourseBySlug(slug);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/faculty", async (req, res) => {
  try {
    const faculty = await storage.getFaculty();
    res.json(faculty);
  } catch (error) {
    console.error("Get faculty error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Contact Routes
router.post("/api/contact", async (req, res) => {
  try {
    const result = insertInquirySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Invalid input", 
        errors: result.error.errors 
      });
    }

    const inquiry = await storage.createInquiry(result.data);
    
    // Send email notification
    try {
      await sendContactInquiry(result.data);
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Continue with success response even if email fails
    }

    res.status(201).json({ 
      message: "Your inquiry has been submitted successfully. We'll get back to you soon!",
      inquiryId: inquiry.id
    });
  } catch (error) {
    console.error("Contact inquiry error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;