import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReliabilityBadge from "@/components/ReliabilityBadge";
import { ShieldCheck, Hash, Sparkles, Apple, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function ResultsPage() {
  const [, setLocation] = useLocation();
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("current_scan_results");
    if (stored) {
      setResults(JSON.parse(stored));
    } else {
      setLocation("/home");
    }
  }, []);

  if (!results) {
    return null;
  }

  const isOrganic = results.verdict?.verdict === "ORGANIC";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/home">
            <Button variant="ghost" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scan
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden border-2">
          <div className={`p-12 text-center ${isOrganic ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-slate-50 dark:bg-slate-950/30'}`}>
            <div className="flex justify-center mb-6">
              {isOrganic ? (
                <div className="bg-emerald-600 text-white p-6 rounded-full">
                  <CheckCircle className="h-20 w-20" />
                </div>
              ) : (
                <div className="bg-slate-600 text-white p-6 rounded-full">
                  <XCircle className="h-20 w-20" />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h1 className={`text-6xl font-bold ${isOrganic ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-400'}`}>
                {results.verdict?.verdict || "UNKNOWN"}
              </h1>
              
              <p className="text-2xl text-muted-foreground capitalize">
                {results.produce_label}
              </p>
              
              <div className="flex justify-center">
                <ReliabilityBadge 
                  reliability={results.verdict?.reliability || "moderate"} 
                  confidence={results.verdict?.verdict_confidence || 0} 
                />
              </div>
            </div>
          </div>

          <CardContent className="space-y-6 pt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Apple className="h-5 w-5" />
                  <span className="text-sm font-medium">Produce Detection</span>
                </div>
                <p className="text-2xl font-semibold capitalize">{results.produce_label}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(results.produce_confidence * 100)}% confidence
                </p>
              </div>

              {results.detected_plu && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="h-5 w-5" />
                    <span className="text-sm font-medium">PLU Code</span>
                  </div>
                  <code className="text-2xl font-mono font-semibold block" data-testid="text-plu">
                    {results.detected_plu}
                  </code>
                  {results.plu_meaning && (
                    <p className="text-sm text-muted-foreground">{results.plu_meaning}</p>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Analysis</h2>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-base leading-relaxed" data-testid="text-reasoning">
                    {results.verdict?.reasoning}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Recommendation</h2>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-base leading-relaxed" data-testid="text-recommendation">
                    {results.verdict?.recommendation}
                  </p>
                </CardContent>
              </Card>
            </div>

            {results.automatic_advice && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Apple className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Nutritional Information</h2>
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {results.automatic_advice}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Link href="/home" className="flex-1">
                <Button variant="outline" className="w-full" data-testid="button-scan-another">
                  Scan Another
                </Button>
              </Link>
              <Link href="/history" className="flex-1">
                <Button className="w-full" data-testid="button-view-history">
                  View History
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
