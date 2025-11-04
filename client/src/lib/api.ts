// client/src/lib/api.ts

// Types
export interface OrganicVerdict {
  model_prediction: string;
  model_confidence: number;
  plu_prediction: string;
  plu_confidence: number;
  detected_plu: string;
  verdict: string;
  verdict_confidence: number;
  reasoning: string;
  match: string;
  reliability: string;
  recommendation: string;
}

export interface ScanResult {
  produce_label: string;
  produce_confidence: number;
  model_organic_prediction: string;
  model_organic_confidence: number;
  detected_plu: string;
  plu_confidence: number;
  plu_meaning: string;
  verdict: OrganicVerdict;
  automatic_advice: string;
  timestamp: string;
  imageUrl?: string;
  // Legacy fields for backward compatibility
  organic_label?: string;
  organic_confidence?: number;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export interface PLUVerification {
  plu_code: string;
  meaning: string;
  is_organic: boolean;
  explanation: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    email: string;
    name: string;
  };
}

export interface HistoryItem extends ScanResult {
  id: number;
}

// API Base URL - points to your Express backend
const API_BASE_URL = "/api";

export class AgriScanAPI {

  static async healthCheck(): Promise<{ status: string; models_loaded: boolean; device: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error("Health check failed");
    return response.json();
  }

  static async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");
    return data;
  }

  static async scanProduce(imageData: string | File): Promise<ScanResult> {
    let body: any;
    let headers: any = {};

    if (typeof imageData === "string") {
      body = JSON.stringify({ image: imageData });
      headers["Content-Type"] = "application/json";
    } else {
      body = JSON.stringify({ 
        image: await this.fileToBase64(imageData) 
      });
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}/infer-image`, {
      method: "POST",
      headers,
      body,
    });

    const data = await response.json();
    console.log("🔍 Backend PLU Detection Debug:", {
      detected_plu: data.detected_plu,
      plu_confidence: data.plu_confidence,
      plu_meaning: data.plu_meaning,
      full_response: data
    });
    if (!response.ok) throw new Error(data.error || "Scan failed");
    return data;
  }

  static async getChatAdvice(
    produce_name: string,
    organic_status: string,
    query: string
  ): Promise<ChatResponse> {
    const context = `The user is asking about ${produce_name} which is ${organic_status}. Provide helpful information about nutrition, storage, recipes, or food safety.`;

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query, context }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Chat failed");
    return { 
      response: data.response,
      timestamp: new Date().toISOString()
    };
  }

  static async verifyPLU(plu_code: string): Promise<PLUVerification> {
    const response = await fetch(`${API_BASE_URL}/verify-plu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plu_code }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "PLU verification failed");
    return data;
  }

  static async getHistory(): Promise<HistoryItem[]> {
    const response = await fetch(`${API_BASE_URL}/history`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch history");
    return data.history;
  }

  static async saveToHistory(scanData: ScanResult): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scanData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to save history");
    return data;
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}