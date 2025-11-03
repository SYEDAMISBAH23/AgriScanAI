import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReliabilityBadge from "./ReliabilityBadge";
import { ShieldCheck, Hash, Sparkles, Apple } from "lucide-react";

interface ResultsCardProps {
  produceLabel: string;
  produceConfidence: number;
  verdict: string;
  verdictConfidence: number;
  reliability: "very_high" | "high" | "moderate";
  detectedPLU?: string;
  pluMeaning?: string;
  reasoning: string;
  recommendation: string;
  nutrition?: string;
}

export default function ResultsCard({
  produceLabel,
  produceConfidence,
  verdict,
  verdictConfidence,
  reliability,
  detectedPLU,
  pluMeaning,
  reasoning,
  recommendation,
  nutrition,
}: ResultsCardProps) {
  return (
    <Card className="overflow-hidden" data-testid="card-results">
      <CardHeader className="bg-primary/5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Apple className="h-6 w-6 text-primary" />
              {produceLabel.charAt(0).toUpperCase() + produceLabel.slice(1)}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Detection Confidence: {Math.round(produceConfidence * 100)}%
            </p>
          </div>
          <Badge
            className={`text-base px-3 py-1 ${
              verdict === "ORGANIC"
                ? "bg-emerald-600 text-white"
                : "bg-slate-600 text-white"
            }`}
            data-testid="badge-verdict"
          >
            {verdict}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-medium">Reliability:</span>
          </div>
          <ReliabilityBadge reliability={reliability} confidence={verdictConfidence} />
        </div>

        {detectedPLU && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                <span className="font-medium">PLU Code:</span>
                <code className="font-mono bg-muted px-2 py-1 rounded text-sm" data-testid="text-plu">
                  {detectedPLU}
                </code>
              </div>
              {pluMeaning && (
                <p className="text-sm text-muted-foreground ml-7">{pluMeaning}</p>
              )}
            </div>
          </>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-medium">Analysis:</span>
          </div>
          <p className="text-sm ml-7" data-testid="text-reasoning">{reasoning}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-medium">Recommendation:</span>
          </div>
          <p className="text-sm ml-7" data-testid="text-recommendation">{recommendation}</p>
        </div>

        {nutrition && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-primary" />
                <span className="font-medium">Nutritional Information:</span>
              </div>
              <p className="text-sm ml-7 text-muted-foreground">{nutrition}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
