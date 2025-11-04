import { type User, type InsertUser, type Scan, type InsertScan, type FraudReport, type InsertFraudReport, users, scanHistory, fraudReports } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getHistory(userId: string): Promise<Scan[]>;
  saveHistory(scan: InsertScan): Promise<Scan>;
  getFraudReports(): Promise<FraudReport[]>;
  saveFraudReport(report: InsertFraudReport): Promise<FraudReport>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getHistory(userId: string): Promise<Scan[]> {
    const scans = await db
      .select()
      .from(scanHistory)
      .where(eq(scanHistory.userId, userId))
      .orderBy(desc(scanHistory.createdAt));
    return scans;
  }

  async saveHistory(insertScan: InsertScan): Promise<Scan> {
    const [scan] = await db
      .insert(scanHistory)
      .values(insertScan)
      .returning();
    return scan;
  }

  async getFraudReports(): Promise<FraudReport[]> {
    const reports = await db
      .select()
      .from(fraudReports)
      .orderBy(desc(fraudReports.createdAt));
    return reports;
  }

  async saveFraudReport(insertReport: InsertFraudReport): Promise<FraudReport> {
    const [report] = await db
      .insert(fraudReports)
      .values(insertReport)
      .returning();
    return report;
  }
}

export const storage = new DatabaseStorage();
