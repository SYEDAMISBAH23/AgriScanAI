import { type User, type InsertUser, type Scan, type InsertScan, type FraudReport, type InsertFraudReport } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getHistory(): Promise<Scan[]>;
  saveHistory(scan: InsertScan): Promise<Scan>;
  getFraudReports(): Promise<FraudReport[]>;
  saveFraudReport(report: InsertFraudReport): Promise<FraudReport>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scans: Map<string, Scan>;
  private fraudReports: Map<string, FraudReport>;

  constructor() {
    this.users = new Map();
    this.scans = new Map();
    this.fraudReports = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getHistory(): Promise<Scan[]> {
    return Array.from(this.scans.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async saveHistory(insertScan: any): Promise<Scan> {
    const id = randomUUID();
    const scan: Scan = {
      id,
      userId: insertScan.userId ?? null,
      produceLabel: insertScan.produce_label || insertScan.produceLabel,
      produceConfidence: insertScan.produce_confidence || insertScan.produceConfidence,
      organicLabel: insertScan.organic_label || insertScan.organicLabel,
      organicConfidence: insertScan.organic_confidence || insertScan.organicConfidence,
      detectedPlu: insertScan.detected_plu || insertScan.detectedPlu || null,
      pluConfidence: insertScan.plu_confidence || insertScan.pluConfidence || null,
      pluMeaning: insertScan.plu_meaning || insertScan.pluMeaning || null,
      nutritionFacts: insertScan.nutrition_facts || insertScan.nutritionFacts || null,
      cleaningTips: insertScan.cleaning_tips || insertScan.cleaningTips || null,
      imageUrl: insertScan.imageUrl || null,
      createdAt: new Date(),
    };
    this.scans.set(id, scan);
    return scan;
  }

  async getFraudReports(): Promise<FraudReport[]> {
    return Array.from(this.fraudReports.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async saveFraudReport(insertReport: InsertFraudReport): Promise<FraudReport> {
    const id = randomUUID();
    const report: FraudReport = {
      ...insertReport,
      id,
      userId: insertReport.userId ?? null,
      email: insertReport.email ?? null,
      createdAt: new Date(),
    };
    this.fraudReports.set(id, report);
    return report;
  }
}

export const storage = new MemStorage();
