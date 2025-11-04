import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const scanHistory = pgTable("scan_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  produceLabel: text("produce_label").notNull(),
  produceConfidence: decimal("produce_confidence").notNull(),
  organicLabel: text("organic_label"),
  organicConfidence: decimal("organic_confidence"),
  detectedPlu: text("detected_plu"),
  pluConfidence: decimal("plu_confidence"),
  pluMeaning: text("plu_meaning"),
  nutritionFacts: text("nutrition_facts"),
  cleaningTips: text("cleaning_tips"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const fraudReports = pgTable("fraud_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  email: text("email"),
  produceLabel: text("produce_label").notNull(),
  organicLabel: text("organic_label").notNull(),
  vendorName: text("vendor_name").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  scans: many(scanHistory),
  fraudReports: many(fraudReports),
}));

export const scanHistoryRelations = relations(scanHistory, ({ one }) => ({
  user: one(users, {
    fields: [scanHistory.userId],
    references: [users.id],
  }),
}));

export const fraudReportsRelations = relations(fraudReports, ({ one }) => ({
  user: one(users, {
    fields: [fraudReports.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScanSchema = createInsertSchema(scanHistory).omit({
  id: true,
  createdAt: true,
});

export const insertFraudReportSchema = createInsertSchema(fraudReports).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Scan = typeof scanHistory.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;
export type FraudReport = typeof fraudReports.$inferSelect;
export type InsertFraudReport = z.infer<typeof insertFraudReportSchema>;
