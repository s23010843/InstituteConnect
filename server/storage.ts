import { users, sessions, programs, faculty, type User, type InsertUser, type Session, type InsertSession, type Program, type Faculty } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Session methods
  getSessionByToken(token: string): Promise<Session | undefined>;
  createSession(insertSession: InsertSession): Promise<Session>;
  deleteSession(token: string): Promise<void>;
  
  // Program methods
  getAllPrograms(): Promise<Program[]>;
  
  // Faculty methods
  getAllFaculty(): Promise<Faculty[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.token, token));
    return session || undefined;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async deleteSession(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token));
  }

  async getAllPrograms(): Promise<Program[]> {
    return await db.select().from(programs).where(eq(programs.isActive, true));
  }

  async getAllFaculty(): Promise<Faculty[]> {
    return await db.select().from(faculty).where(eq(faculty.isActive, true));
  }
}

export const storage = new DatabaseStorage();