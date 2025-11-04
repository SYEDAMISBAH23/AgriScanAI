import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceMeter } from "./confidence-meter";
import { PluDisplay } from "./plu-display";
import { FraudReportDialog } from "./fraud-report-dialog";
import { Chatbot } from "./chatbot";
import { RotateCcw, Save, Leaf, AlertCircle, Sparkles, Flag, MessageCircle, Check, X, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrganicVerdict } from "@/lib/api";

interface ScanResultProps {
  imageUrl: string;
  produceLabel: string;
  produceConfidence: number;
  organicLabel: string;
  organicConfidence: number;
  detectedPlu?: string;
  pluConfidence?: number;
  pluMeaning?: string;
  nutritionFacts?: string;
  cleaningTips?: string;
  verdict?: OrganicVerdict;
  onScanAgain?: () => void;
  onSave?: () => void;
  onSharePdf?: () => void;
  onSendMessage?: (message: string) => Promise<string>;
}

export function ScanResult({
  imageUrl,
  produceLabel,
  produceConfidence,
  organicLabel,
  organicConfidence,
  detectedPlu,
  pluConfidence,
  pluMeaning,
  nutritionFacts,
  cleaningTips,
  verdict,
  onScanAgain,
  onSave,
  onSharePdf,
  onSendMessage,
}: ScanResultProps) {
  const isOrganic = organicLabel?.toLowerCase() === "organic" || organicLabel?.toLowerCase()?.includes("organic");
  const [showFraudDialog, setShowFraudDialog] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "nutrition">("details");
  const [manualVerdict, setManualVerdict] = useState<OrganicVerdict | null>(null);

  const autoAdvice = [nutritionFacts, cleaningTips].filter(Boolean).join(" ");

  // Use manual verdict if available, otherwise use backend verdict
  const activeVerdict = manualVerdict || verdict;

  // Determine if verdict shows a mismatch or uncertainty
  const hasVerdictInfo = activeVerdict && (activeVerdict.match !== 'perfect_match' || activeVerdict.reliability !== 'very_high');

  const handleReportFraud = () => {
    setShowFraudDialog(true);
  };

  const handleToggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const handleManualPluVerified = (pluCode: string, pluIsOrganic: boolean, pluMeaning: string) => {
    // Generate a verdict by comparing model prediction with manual PLU
    const modelPrediction = organicLabel;
    const modelIsOrganic = isOrganic;
    const pluPrediction = pluIsOrganic ? "Organic" : "Non-Organic";

    // Determine match type
    let match: string;
    let finalVerdict: string;
    let verdictConfidence: number;
    let reasoning: string;
    let reliability: string;
    let recommendation: string;

    if (modelIsOrganic === pluIsOrganic) {
      // Perfect match
      match = "perfect_match";
      finalVerdict = pluIsOrganic ? "ORGANIC" : "NON_ORGANIC";
      verdictConfidence = Math.min(organicConfidence * 0.9 + 0.1, 0.95);
      reliability = "very_high";
      reasoning = `Both AI model (${(organicConfidence * 100).toFixed(0)}% confidence) and PLU code ${pluCode} agree this produce is ${finalVerdict.toLowerCase()}.`;
      recommendation = pluIsOrganic 
        ? "This organic produce can be rinsed lightly with water before consumption."
        : "Wash thoroughly with water and a vegetable brush to remove pesticide residues.";
    } else {
      // Disagreement - trust PLU code more
      match = "disagreement_plu_trusted";
      finalVerdict = pluIsOrganic ? "ORGANIC" : "NON_ORGANIC";
      verdictConfidence = 0.85;
      reliability = "high";
      reasoning = `AI model predicted ${modelPrediction} (${(organicConfidence * 100).toFixed(0)}% confidence), but PLU code ${pluCode} indicates ${pluPrediction}. PLU codes are generally more reliable as they are standardized industry labels.`;
      recommendation = pluIsOrganic
        ? "Despite model uncertainty, PLU code confirms organic status. Light rinse recommended."
        : "PLU code indicates conventional produce. Wash thoroughly to remove potential pesticide residues.";
    }

    const newVerdict: OrganicVerdict = {
      model_prediction: modelPrediction,
      model_confidence: organicConfidence,
      plu_prediction: pluPrediction,
      plu_confidence: 0.95, // Manual PLU is high confidence
      detected_plu: pluCode,
      verdict: finalVerdict,
      verdict_confidence: verdictConfidence,
      reasoning,
      match,
      reliability,
      recommendation,
    };

    setManualVerdict(newVerdict);
  };

  return (
    <>
      <FraudReportDialog
        open={showFraudDialog}
        onOpenChange={setShowFraudDialog}
        produceLabel={produceLabel}
        organicLabel={organicLabel}
      />

      <div className="space-y-8 pb-8">
        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="relative h-64 md:h-80 overflow-hidden rounded-xl border">
            <img
              src={imageUrl}
              alt={produceLabel}
              className="w-full h-full object-cover"
              data-testid="img-scan-result"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Detected Produce</div>
              <h2 className="text-4xl font-bold capitalize mb-2" data-testid="text-produce-name">
                {produceLabel}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>{(produceConfidence * 100).toFixed(0)}% Confidence</span>
              </div>
            </div>
            <div className={cn(
              "p-4 rounded-lg border-2",
              isOrganic ? "bg-primary/5 border-primary" : "bg-muted border-border"
            )}>
              <div className="flex items-center gap-3 mb-2">
                {isOrganic ? (
                  <Leaf className="h-6 w-6 text-primary" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                )}
                <div>
                  <div className="font-bold text-lg" data-testid={`badge-organic-${isOrganic ? "yes" : "no"}`}>
                    {isOrganic ? "Certified Organic" : "Non-Organic"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(organicConfidence * 100).toFixed(0)}% Confidence
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>


        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 p-1 bg-muted rounded-lg border"
        >
          <button
            onClick={() => setActiveTab("details")}
            className={cn(
              "flex-1 py-3 px-4 rounded-md font-medium text-sm transition-colors",
              activeTab === "details"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover-elevate"
            )}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("nutrition")}
            className={cn(
              "flex-1 py-3 px-4 rounded-md font-medium text-sm transition-colors",
              activeTab === "nutrition"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover-elevate"
            )}
          >
            Nutrition
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "details" ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Verdict Info Card - Show when there's important information */}
              {hasVerdictInfo && activeVerdict && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  data-testid="card-verification-analysis"
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="rounded-lg bg-primary/10 p-2.5">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">
                            Verification Analysis
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {activeVerdict.match === 'perfect_match' ? 'Perfect Match' : 
                               activeVerdict.match === 'disagreement_plu_trusted' ? 'PLU Code Trusted' :
                               activeVerdict.match === 'disagreement_model_trusted' ? 'AI Model Trusted' :
                               'No PLU Code'}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {activeVerdict.reliability === 'very_high' ? 'Very High Confidence' :
                               activeVerdict.reliability === 'high' ? 'High Confidence' :
                               activeVerdict.reliability === 'moderate' ? 'Moderate Confidence' :
                               'Low Confidence'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {activeVerdict.reasoning && (
                        <div className="bg-muted/50 rounded-lg p-4 mb-3">
                          <div className="flex gap-2">
                            <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {activeVerdict.reasoning}
                            </p>
                          </div>
                        </div>
                      )}

                      {activeVerdict.recommendation && (
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                          <p className="text-sm leading-relaxed">
                            <span className="font-semibold">💡 Recommendation:</span>{' '}
                            <span className="text-muted-foreground">{activeVerdict.recommendation}</span>
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <Card>
                <CardContent className="p-6 space-y-6">
                  <ConfidenceMeter label="Produce Identification" confidence={produceConfidence} />
                  <ConfidenceMeter label="Organic Detection" confidence={organicConfidence} />
                  {pluConfidence && (
                    <ConfidenceMeter label="PLU Recognition" confidence={pluConfidence} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {nutritionFacts && (
                      <div>
                        <h4 className="text-base font-bold mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Nutrition Facts
                        </h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {nutritionFacts}
                        </p>
                      </div>
                    )}
                    {cleaningTips && (
                      <div>
                        <h4 className="text-base font-bold mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Cleaning Tips
                        </h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {cleaningTips}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PLU Display - Always show to indicate detection attempt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <PluDisplay 
            code={detectedPlu || "Not Detected"} 
            meaning={pluMeaning || "No PLU sticker found in the image. For best results, ensure the PLU sticker is clearly visible, well-lit, and in focus."} 
            onManualPluVerified={handleManualPluVerified}
          />
        </motion.div>

        {/* Chatbot */}
        <AnimatePresence>
          {showChatbot && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              data-testid="chatbot-container"
            >
              <Chatbot autoAdvice={autoAdvice} onSendMessage={onSendMessage} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          <Button
            onClick={handleToggleChatbot}
            variant={showChatbot ? "default" : "outline"}
            data-testid="button-ai-assistant"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {showChatbot ? "Hide" : "AI"} Assistant
          </Button>
          <Button
            onClick={onSave}
            variant="outline"
            data-testid="button-save"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={handleReportFraud}
            variant="outline"
            data-testid="button-report-fraud"
          >
            <Flag className="h-4 w-4 mr-2" />
            Report
          </Button>
          <Button
            onClick={onScanAgain}
            data-testid="button-scan-again"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Scan Again
          </Button>
        </motion.div>
      </div>
    </>
  );
}
