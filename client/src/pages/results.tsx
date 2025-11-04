import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ScanResult } from "@/components/scan-result";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/hooks/use-toast";
import { AgriScanAPI, type ScanResult as ScanResultType } from "@/lib/api";

export default function Results() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [scanData, setScanData] = useState<ScanResultType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load scan data from sessionStorage (set from history page or home page)
  useEffect(() => {
    const storedData = sessionStorage.getItem("currentScan");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setScanData(data);
      } catch (error) {
        console.error("Failed to parse scan data:", error);
        toast({
          title: "Error",
          description: "Failed to load scan results",
          variant: "destructive",
        });
        setLocation("/");
      }
    } else {
      toast({
        title: "No scan data",
        description: "Please scan a produce first",
        variant: "destructive",
      });
      setLocation("/");
    }
    setIsLoading(false);
  }, []);

  const handleSendMessage = async (message: string): Promise<string> => {
    if (!scanData) return "No scan data available";

    try {
      const organicStatus = scanData.verdict 
        ? scanData.verdict.verdict.toLowerCase() 
        : (scanData.organic_label || scanData.model_organic_prediction || 'unknown');

      const response = await AgriScanAPI.getChatAdvice(
        scanData.produce_label,
        organicStatus,
        message
      );
      return response.response;
    } catch (error: any) {
      console.error("Chat error:", error);
      return "Sorry, I couldn't process your question. Please try again.";
    }
  };

  const handleScanAgain = () => {
    sessionStorage.removeItem("currentScan");
    setLocation("/");
  };

  const handleSave = async () => {
    if (!scanData) return;

    try {
      await AgriScanAPI.saveToHistory(scanData);
      toast({
        title: "Scan saved",
        description: "Added to your history",
      });
    } catch (error: any) {
      toast({
        title: "Failed to save",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSharePdf = () => {
    if (!scanData) return;

    const organicConf = scanData.verdict 
      ? scanData.verdict.verdict_confidence 
      : (scanData.organic_confidence || scanData.model_organic_confidence || 0);
    const organicLbl = scanData.verdict 
      ? scanData.verdict.verdict 
      : (scanData.organic_label || scanData.model_organic_prediction || 'Unknown');

    // Generate PDF content
    const pdfContent = `
AgriScan AI Report
==================

Produce: ${scanData.produce_label}
Confidence: ${(scanData.produce_confidence * 100).toFixed(1)}%

Organic Status: ${organicLbl}
Confidence: ${(organicConf * 100).toFixed(1)}%

PLU Code: ${scanData.detected_plu}
Meaning: ${scanData.plu_meaning}

Advice:
${scanData.automatic_advice}

Scanned: ${new Date(scanData.timestamp).toLocaleString()}
    `.trim();

    // Create a blob and download
    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agriscan-${scanData.produce_label}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report downloaded",
      description: "Check your downloads folder",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!scanData) {
    return null; // Will redirect in useEffect
  }

  // Format data for ScanResult component
  // Show PLU even if not in database to help with debugging OCR
  const hasValidPlu = scanData.detected_plu && scanData.detected_plu !== "None";

  // Use verdict if available, otherwise fall back to legacy fields
  const organicLabel = scanData.verdict ? scanData.verdict.verdict : (scanData.organic_label || scanData.model_organic_prediction);
  const organicConfidence = scanData.verdict ? scanData.verdict.verdict_confidence : (scanData.organic_confidence || scanData.model_organic_confidence);

  const formattedData = {
    imageUrl: (scanData as any).imageUrl || "/placeholder-produce.jpg",
    produceLabel: scanData.produce_label,
    produceConfidence: scanData.produce_confidence,
    organicLabel: organicLabel,
    organicConfidence: organicConfidence,
    detectedPlu: hasValidPlu ? scanData.detected_plu : undefined,
    pluConfidence: scanData.plu_confidence,
    pluMeaning: hasValidPlu ? (scanData.plu_meaning || "PLU code detected but not in database") : undefined,
    nutritionFacts: extractNutritionFacts(scanData.automatic_advice),
    cleaningTips: extractCleaningTips(scanData.automatic_advice),
    verdict: scanData.verdict,
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <ScanResult
          {...formattedData}
          onScanAgain={handleScanAgain}
          onSave={handleSave}
          onSharePdf={handleSharePdf}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
}

// Helper functions to parse automatic_advice
function extractNutritionFacts(advice: string | undefined): string {
  if (!advice) {
    return "Rich in vitamins and minerals. Nutrition facts vary by produce type.";
  }

  const nutritionMatch = advice.match(/\*\*Nutrition:\*\*\s*([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);
  if (nutritionMatch) {
    return nutritionMatch[1].trim();
  }
  // Fallback: return first paragraph
  const firstParagraph = advice.split('\n\n')[0];
  return firstParagraph.replace(/\*\*/g, '');
}

function extractCleaningTips(advice: string | undefined): string {
  if (!advice) {
    return "Rinse thoroughly under cool running water. Gently scrub with your hands or a soft brush.";
  }

  const cleaningMatch = advice.match(/\*\*Cleaning Tips?:\*\*\s*([^\n]*(?:\n(?!\*\*)[^\n]*)*)/);
  if (cleaningMatch) {
    return cleaningMatch[1].trim();
  }
  // Fallback: return second paragraph if exists
  const paragraphs = advice.split('\n\n');
  if (paragraphs.length > 1) {
    return paragraphs[1].replace(/\*\*/g, '');
  }
  return "Rinse thoroughly under running water.";
}