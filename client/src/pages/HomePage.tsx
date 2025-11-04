import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import ImageUploadZone from "@/components/ImageUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [manualPLU, setManualPLU] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please upload an image to analyze.",
      });
      return;
    }

    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("image", selectedImage);
    if (manualPLU) {
      formData.append("manual_plu", manualPLU);
    }

    try {
      const response = await fetch(
        "https://iamsyedamisbah-agriscan-ai-backend.hf.space/infer_image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("API Error:", response.status, errorText);
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Store latest result for results page
      localStorage.setItem("agriscan_latest_result", JSON.stringify(data));

      const scanHistory = JSON.parse(
        localStorage.getItem("agriscan_history") || "[]"
      );
      scanHistory.unshift({
        id: Date.now(),
        date: new Date().toLocaleString(),
        produce: data.produce_label,
        verdict: data.verdict?.verdict || "UNKNOWN",
        confidence: data.verdict?.verdict_confidence || 0,
        plu: data.detected_plu,
        fullData: data,
      });
      localStorage.setItem("agriscan_history", JSON.stringify(scanHistory));

      toast({
        title: "Analysis Complete",
        description: `Detected: ${data.produce_label}`,
      });

      // Navigate to results page
      setLocation("/results");
    } catch (error) {
      console.error("Analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage.includes("fetch") || errorMessage.includes("Failed to fetch") 
          ? "Unable to connect to the analysis service. Please check your internet connection and try again."
          : `Unable to analyze the image: ${errorMessage}`,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Scan Your Produce</h1>
          <p className="text-muted-foreground">
            Upload an image to verify organic authenticity
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <ImageUploadZone
              onImageSelect={setSelectedImage}
              selectedImage={selectedImage}
              onClearImage={() => setSelectedImage(null)}
            />

            <div className="space-y-2">
              <Label htmlFor="manual-plu">Manual PLU Code (Optional)</Label>
              <Input
                id="manual-plu"
                placeholder="Enter PLU code (e.g., 94011)"
                value={manualPLU}
                onChange={(e) => setManualPLU(e.target.value)}
                data-testid="input-manual-plu"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
              className="w-full"
              size="lg"
              data-testid="button-analyze"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Produce"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
