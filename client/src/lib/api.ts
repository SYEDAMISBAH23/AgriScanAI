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

export const AgriScanAPI = {
  async scanProduce(imageFile: File, manualPLU?: string): Promise<ScanResult> {
    const formData = new FormData();
    formData.append("file", imageFile);
    if (manualPLU) {
      formData.append("plu_code", manualPLU);
    }

    const response = await fetch(`${API_BASE_URL}/infer_image`, {
      method: "POST",
      body: formData,
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
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        produce,
        organic_status: organicStatus,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get chat response");
    }

    return response.json();
  },

  async saveToHistory(scanData: ScanResult): Promise<void> {
    const history = localStorage.getItem("scanHistory");
    const historyArray = history ? JSON.parse(history) : [];
    historyArray.unshift(scanData);
    localStorage.setItem("scanHistory", JSON.stringify(historyArray));
  },
};
