import { eq, and, desc } from "drizzle-orm";
import { db } from "./db.js";
import { 
  users, 
  pages, 
  news, 
  courses, 
  faculty, 
  inquiries,
  type User,
  type Page,
  type News,
  type Course,
  type Faculty,
  type Inquiry,
  type InsertPage,
  type InsertNews,
  type InsertCourse,
  type InsertFaculty,
  type InsertInquiry
} from "../shared/schema.js";
import { v4 as uuidv4 } from "uuid";

export interface IStorage {
  // User operations
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(data: { 
    email: string; 
    firstName?: string; 
    lastName?: string; 
    passwordHash?: string;
    googleId?: string;
    appleId?: string;
  }): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  updateUserOtp(email: string, otpCode: string, otpExpiry: Date): Promise<void>;
  verifyUserEmail(email: string): Promise<void>;

  // Page operations
  getPages(): Promise<Page[]>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(data: InsertPage): Promise<Page>;
  updatePage(id: string, data: Partial<InsertPage>): Promise<Page>;
  deletePage(id: string): Promise<void>;

  // News operations
  getNews(): Promise<News[]>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  createNews(data: InsertNews): Promise<News>;
  updateNews(id: string, data: Partial<InsertNews>): Promise<News>;
  deleteNews(id: string): Promise<void>;

  // Course operations
  getCourses(): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  createCourse(data: InsertCourse): Promise<Course>;
  updateCourse(id: string, data: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: string): Promise<void>;

  // Faculty operations
  getFaculty(): Promise<Faculty[]>;
  createFaculty(data: InsertFaculty): Promise<Faculty>;
  updateFaculty(id: string, data: Partial<InsertFaculty>): Promise<Faculty>;
  deleteFaculty(id: string): Promise<void>;

  // Inquiry operations
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(data: InsertInquiry): Promise<Inquiry>;
  markInquiryAsRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(data: { 
    email: string; 
    firstName?: string; 
    lastName?: string; 
    passwordHash?: string;
    googleId?: string;
    appleId?: string;
  }): Promise<User> {
    const id = uuidv4();
    await db.insert(users).values({
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const user = await this.getUserById(id);
    return user!;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await db.update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id));
    const user = await this.getUserById(id);
    return user!;
  }

  async updateUserOtp(email: string, otpCode: string, otpExpiry: Date): Promise<void> {
    await db.update(users)
      .set({ otpCode, otpExpiry, updatedAt: new Date() })
      .where(eq(users.email, email));
  }

  async verifyUserEmail(email: string): Promise<void> {
    await db.update(users)
      .set({ isEmailVerified: true, otpCode: null, otpExpiry: null, updatedAt: new Date() })
      .where(eq(users.email, email));
  }

  // Page operations
  async getPages(): Promise<Page[]> {
    return await db.select().from(pages).where(eq(pages.isPublished, true)).orderBy(pages.order);
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(and(eq(pages.slug, slug), eq(pages.isPublished, true)));
    return page;
  }

  async createPage(data: InsertPage): Promise<Page> {
    const id = uuidv4();
    await db.insert(pages).values({
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const page = await db.select().from(pages).where(eq(pages.id, id));
    return page[0];
  }

  async updatePage(id: string, data: Partial<InsertPage>): Promise<Page> {
    await db.update(pages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pages.id, id));
    const page = await db.select().from(pages).where(eq(pages.id, id));
    return page[0];
  }

  async deletePage(id: string): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  // News operations
  async getNews(): Promise<News[]> {
    return await db.select().from(news).where(eq(news.isPublished, true)).orderBy(desc(news.publishedAt));
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    const [article] = await db.select().from(news).where(and(eq(news.slug, slug), eq(news.isPublished, true)));
    return article;
  }

  async createNews(data: InsertNews): Promise<News> {
    const id = uuidv4();
    await db.insert(news).values({
      id,
      ...data,
      publishedAt: data.publishedAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const article = await db.select().from(news).where(eq(news.id, id));
    return article[0];
  }

  async updateNews(id: string, data: Partial<InsertNews>): Promise<News> {
    await db.update(news)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(news.id, id));
    const article = await db.select().from(news).where(eq(news.id, id));
    return article[0];
  }

  async deleteNews(id: string): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isActive, true));
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(and(eq(courses.slug, slug), eq(courses.isActive, true)));
    return course;
  }

  async createCourse(data: InsertCourse): Promise<Course> {
    const id = uuidv4();
    await db.insert(courses).values({
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const course = await db.select().from(courses).where(eq(courses.id, id));
    return course[0];
  }

  async updateCourse(id: string, data: Partial<InsertCourse>): Promise<Course> {
    await db.update(courses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(courses.id, id));
    const course = await db.select().from(courses).where(eq(courses.id, id));
    return course[0];
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Faculty operations
  async getFaculty(): Promise<Faculty[]> {
    return await db.select().from(faculty).where(eq(faculty.isActive, true)).orderBy(faculty.order);
  }

  async createFaculty(data: InsertFaculty): Promise<Faculty> {
    const id = uuidv4();
    await db.insert(faculty).values({
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const member = await db.select().from(faculty).where(eq(faculty.id, id));
    return member[0];
  }

  async updateFaculty(id: string, data: Partial<InsertFaculty>): Promise<Faculty> {
    await db.update(faculty)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(faculty.id, id));
    const member = await db.select().from(faculty).where(eq(faculty.id, id));
    return member[0];
  }

  async deleteFaculty(id: string): Promise<void> {
    await db.delete(faculty).where(eq(faculty.id, id));
  }

  // Inquiry operations
  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(data: InsertInquiry): Promise<Inquiry> {
    const id = uuidv4();
    await db.insert(inquiries).values({
      id,
      ...data,
      createdAt: new Date()
    });
    const inquiry = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry[0];
  }

  async markInquiryAsRead(id: string): Promise<void> {
    await db.update(inquiries)
      .set({ isRead: true })
      .where(eq(inquiries.id, id));
  }
}

export const storage = new DatabaseStorage();