import { 
  pgTable, 
  varchar, 
  text, 
  timestamp, 
  boolean,
  integer,
  jsonb
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  isEmailVerified: boolean("is_email_verified").default(false),
  otpCode: varchar("otp_code", { length: 6 }),
  otpExpiry: timestamp("otp_expiry"),
  googleId: varchar("google_id", { length: 100 }),
  appleId: varchar("apple_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Session storage for authentication
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  sessionData: jsonb("session_data"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Institute content and pages
export const pages = pgTable("pages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  content: text("content"),
  metaDescription: varchar("meta_description", { length: 160 }),
  isPublished: boolean("is_published").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// News/Announcements
export const news = pgTable("news", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  imageUrl: varchar("image_url", { length: 500 }),
  isPublished: boolean("is_published").default(true),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Courses/Programs
export const courses = pgTable("courses", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).unique().notNull(),
  description: text("description"),
  duration: varchar("duration", { length: 100 }),
  fee: varchar("fee", { length: 100 }),
  imageUrl: varchar("image_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Faculty members
export const faculty = pgTable("faculty", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  designation: varchar("designation", { length: 200 }),
  qualification: text("qualification"),
  experience: text("experience"),
  imageUrl: varchar("image_url", { length: 500 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Contact inquiries
export const inquiries = pgTable("inquiries", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 200 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Zod schemas for validation
import { z } from 'zod'

// User registration schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
})

export type RegisterData = z.infer<typeof registerSchema>

// User login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginData = z.infer<typeof loginSchema>

// OTP verification schema
export const otpSchema = z.object({
  code: z.string().length(6, 'OTP must be 6 digits'),
  email: z.string().email('Invalid email address'),
})

export type OtpData = z.infer<typeof otpSchema>

// Contact/inquiry schema
export const insertInquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type InsertInquiry = z.infer<typeof insertInquirySchema>

export const insertPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().default(true),
  order: z.number().default(0)
});

export const insertNewsSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  isPublished: z.boolean().default(true),
  publishedAt: z.date().optional()
});

export const insertCourseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  duration: z.string().optional(),
  fee: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true)
});

export const insertFacultySchema = z.object({
  name: z.string().min(1),
  designation: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  imageUrl: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0)
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Page = typeof pages.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Faculty = typeof faculty.$inferSelect;
export type InsertFaculty = z.infer<typeof insertFacultySchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type OtpData = z.infer<typeof otpSchema>;