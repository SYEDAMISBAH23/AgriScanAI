import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash, Search, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { AgriScanAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PluDisplayProps {
  code: string;
  meaning: string;
  onManualPluVerified?: (pluCode: string, isOrganic: boolean, meaning: string) => void;
}

export function PluDisplay({ code, meaning, onManualPluVerified }: PluDisplayProps) {
  const isNotDetected = code === "Not Detected";
  const [manualPlu, setManualPlu] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<{
    code: string;
    meaning: string;
    isOrganic: boolean;
  } | null>(null);
  const { toast } = useToast();

  const handleVerifyPlu = async () => {
    if (!manualPlu || manualPlu.length < 4 || manualPlu.length > 5) {
      toast({
        title: "Invalid PLU",
        description: "PLU codes are 4-5 digits long",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await AgriScanAPI.verifyPLU(manualPlu);
      setVerifiedResult({
        code: manualPlu,
        meaning: result.explanation,
        isOrganic: result.is_organic,
      });
      toast({
        title: "PLU Verified!",
        description: `Found: ${result.meaning}`,
      });

      // Notify parent component to trigger verification analysis
      if (onManualPluVerified) {
        onManualPluVerified(manualPlu, result.is_organic, result.explanation);
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "PLU code not found in database",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const displayCode = verifiedResult?.code || code;
  const displayMeaning = verifiedResult?.meaning || meaning;

  return (
    <Card className="backdrop-blur-sm bg-card/80 shadow-lg hover-elevate transition-all duration-300 border-2">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md" />
            <div className="relative h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
              <Hash className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-sm font-medium text-muted-foreground">PLU Code:</span>
                <span className={`font-mono font-bold text-2xl tracking-tight ${isNotDetected && !verifiedResult ? 'text-muted-foreground' : ''}`} data-testid="text-plu-code">
                  {displayCode}
                </span>
                {verifiedResult && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                )}
              </div>
              <p className="text-base leading-relaxed text-muted-foreground" data-testid="text-plu-meaning">
                {displayMeaning}
              </p>
            </div>

            {isNotDetected && !verifiedResult && (
              <div className="pt-4 border-t space-y-3">
                <p className="text-sm font-medium text-foreground">Enter PLU Code Manually:</p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., 4131"
                    value={manualPlu}
                    onChange={(e) => setManualPlu(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyPlu()}
                    className="font-mono text-lg"
                    data-testid="input-manual-plu"
                    disabled={isVerifying}
                  />
                  <Button
                    onClick={handleVerifyPlu}
                    disabled={isVerifying || !manualPlu}
                    size="default"
                    data-testid="button-verify-plu"
                  >
                    {isVerifying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
