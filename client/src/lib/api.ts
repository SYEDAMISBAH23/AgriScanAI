export interface ScanResult {
  produce_label: string;
  produce_confidence: number;
  verdict?: {
    verdict: string;
    verdict_confidence: number;
    reliability_rating: string;
  };
  organic_label?: string;
  organic_confidence?: number;
  model_organic_prediction?: string;
  model_organic_confidence?: number;
  detected_plu: string;
  plu_meaning: string;
  automatic_advice: string;
  timestamp: string;
  imageUrl?: string;
  ai_reasoning?: string;
  cleaning_recommendations?: string;
  nutritional_info?: string;
}

const API_BASE_URL = "https://iamsyedamisbah-agriscan-ai-backend.hf.space";

// Helper function to convert File to base64 data URL
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Return the full data URL (including "data:image/...;base64," prefix)
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const AgriScanAPI = {
  async scanProduce(imageFile: File, manualPLU?: string): Promise<ScanResult> {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    const payload: any = {
      image: base64Image,
    };
    
    if (manualPLU) {
      payload.plu_code = manualPLU;
    }

    const response = await fetch(`${API_BASE_URL}/infer_image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to scan produce");
    }

    const data = await response.json();
    
    return {
      ...data,
      timestamp: new Date().toISOString(),
    };
  },

  async getChatAdvice(
    produce: string,
    organicStatus: string,
    message: string
  ): Promise<{ response: string }> {
    // Call our backend which uses OpenAI
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        produceName: produce,
        organicStatus: organicStatus,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to get chat response");
    }

    return response.json();
  },

  async verifyPLU(pluCode: string): Promise<{ 
    plu_code: string;
    meaning: string; 
    is_organic: boolean; 
    explanation: string 
  }> {
    const response = await fetch(`${API_BASE_URL}/verify_plu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plu_code: pluCode,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to verify PLU code");
    }

    return response.json();
  },

  async getHistory(): Promise<any[]> {
    const history = localStorage.getItem("scanHistory");
    return history ? JSON.parse(history) : [];
  },

  async saveToHistory(scanData: ScanResult): Promise<void> {
    const history = localStorage.getItem("scanHistory");
    const historyArray = history ? JSON.parse(history) : [];
    historyArray.unshift(scanData);
    localStorage.setItem("scanHistory", JSON.stringify(historyArray));
  },
};
