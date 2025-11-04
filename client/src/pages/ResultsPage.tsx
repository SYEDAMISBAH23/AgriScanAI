import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ScanLine } from "lucide-react";
import ResultsCard from "@/components/ResultsCard";

export default function ResultsPage() {
  const [, setLocation] = useLocation();
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const latestScan = localStorage.getItem("agriscan_latest_result");
    if (latestScan) {
      setResults(JSON.parse(latestScan));
    } else {
      setLocation("/home");
    }
  }, [setLocation]);

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Scan Results</h1>
            <p className="text-muted-foreground">
              Your produce verification analysis is complete
            </p>
          </div>
          <Button
            onClick={() => setLocation("/home")}
            variant="outline"
            data-testid="button-new-scan"
          >
            <ScanLine className="h-4 w-4 mr-2" />
            New Scan
          </Button>
        </div>

        <ResultsCard
          produceLabel={results.produce_label}
          produceConfidence={results.produce_confidence}
          verdict={results.verdict?.verdict || "UNKNOWN"}
          verdictConfidence={results.verdict?.verdict_confidence || 0}
          reliability={results.verdict?.reliability || "moderate"}
          detectedPLU={results.detected_plu}
          pluMeaning={results.plu_meaning}
          reasoning={results.verdict?.reasoning || ""}
          recommendation={results.verdict?.recommendation || ""}
          nutrition={results.automatic_advice}
        />

        <div className="flex justify-center">
          <Button
            onClick={() => setLocation("/home")}
            variant="ghost"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scanner
          </Button>
        </div>
      </div>
    </div>
  );
}
