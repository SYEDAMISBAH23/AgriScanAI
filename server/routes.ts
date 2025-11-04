import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatCompletion } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {

  // Login
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Get or create user (using email as username)
      let user = await storage.getUserByUsername(email);
      
      if (!user) {
        // Create new user if doesn't exist (auto-registration)
        user = await storage.createUser({
          username: email,
          password: password, // NOTE: In production, this should be hashed with bcrypt!
        });
      } else {
        // Verify password for existing user
        if (user.password !== password) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      }
      
      res.json({ success: true, email, userId: user.id });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(401).json({ error: "Login failed" });
    }
  });

  // History - GET (user-specific)
  app.get("/api/history", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      const history = await storage.getHistory(userId);
      const formattedHistory = history.map(scan => ({
        id: scan.id,
        produce_label: scan.produceLabel,
        produce_confidence: scan.produceConfidence,
        organic_label: scan.organicLabel,
        organic_confidence: scan.organicConfidence,
        detected_plu: scan.detectedPlu,
        plu_confidence: scan.pluConfidence,
        plu_meaning: scan.pluMeaning,
        automatic_advice: scan.nutritionFacts || "",
        timestamp: scan.createdAt.toISOString(),
        imageUrl: scan.imageUrl,
      }));
      res.json({ history: formattedHistory });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // History - POST
  app.post("/api/history", async (req, res) => {
    try {
      const scanData = req.body;
      
      if (!scanData.userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      const insertScan = {
        userId: scanData.userId,
        produceLabel: scanData.produce_label || scanData.produceLabel,
        produceConfidence: String(scanData.produce_confidence || scanData.produceConfidence),
        organicLabel: scanData.organic_label || scanData.organicLabel || null,
        organicConfidence: scanData.organic_confidence || scanData.organicConfidence ? String(scanData.organic_confidence || scanData.organicConfidence) : null,
        detectedPlu: scanData.detected_plu || scanData.detectedPlu || null,
        pluConfidence: scanData.plu_confidence || scanData.pluConfidence ? String(scanData.plu_confidence || scanData.pluConfidence) : null,
        pluMeaning: scanData.plu_meaning || scanData.pluMeaning || null,
        nutritionFacts: scanData.nutritional_info || scanData.nutritionFacts || null,
        cleaningTips: scanData.cleaning_recommendations || scanData.cleaningTips || null,
        imageUrl: scanData.imageUrl || null,
      };

      await storage.saveHistory(insertScan);
      res.json({ success: true, message: "Scan saved" });
    } catch (error) {
      console.error("Save history error:", error);
      res.status(500).json({ error: "Failed to save history" });
    }
  });

  // Fraud Reports - GET
  app.get("/api/fraud-reports", async (req, res) => {
    try {
      const reports = await storage.getFraudReports();
      res.json({ reports });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fraud reports" });
    }
  });

  // Fraud Reports - POST
  app.post("/api/fraud-reports", async (req, res) => {
    try {
      const reportData = req.body;
      const report = await storage.saveFraudReport(reportData);
      res.json({ success: true, report });
    } catch (error) {
      res.status(500).json({ error: "Failed to save fraud report" });
    }
  });

  // Chat endpoint using OpenAI
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, produceName, organicStatus } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Build context from produce information
      let context = "";
      if (produceName || organicStatus) {
        context = `Current produce being discussed: ${produceName || "Unknown"}. `;
        if (organicStatus) {
          context += `Organic status: ${organicStatus}. `;
        }
      }
      
      const response = await getChatCompletion(message, context);
      res.json({ response });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to get chat response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
