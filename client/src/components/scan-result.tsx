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
        {/* Hero Image with Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative h-80 overflow-hidden rounded-3xl shadow-2xl"
        >
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            src={imageUrl}
            alt={produceLabel}
            className="w-full h-full object-cover"
            data-testid="img-scan-result"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute bottom-0 left-0 right-0 p-8"
          >
            <h2 className="text-6xl md:text-7xl font-black capitalize text-white mb-4 drop-shadow-2xl" data-testid="text-produce-name">
              {produceLabel}
            </h2>
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/50"
              />
              <p className="text-white/95 text-lg font-semibold">
                {(produceConfidence * 100).toFixed(0)}% Match
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Organic Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <motion.div
            animate={{
              boxShadow: isOrganic 
                ? "0 0 60px hsl(var(--primary) / 0.3)" 
                : "0 0 60px rgba(239, 68, 68, 0.3)"
            }}
            className={cn(
              "rounded-3xl p-8 backdrop-blur-xl border-2 transition-all duration-500",
              isOrganic 
                ? "bg-primary/10 border-primary/30" 
                : "bg-destructive/10 border-destructive/30"
            )}
          >
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                className={cn(
                  "h-24 w-24 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden",
                  isOrganic ? "bg-primary" : "bg-destructive"
                )}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                />
                {isOrganic ? (
                  <Leaf className="h-12 w-12 text-white relative z-10" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-white relative z-10" />
                )}
              </motion.div>

              <div className="flex-1">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className={cn(
                    "text-5xl font-black mb-2",
                    isOrganic ? "text-primary" : "text-destructive"
                  )}
                  data-testid={`badge-organic-${isOrganic ? "yes" : "no"}`}
                >
                  {isOrganic ? "Certified Organic" : "Non-Organic"}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-muted-foreground font-medium"
                >
                  {(organicConfidence * 100).toFixed(0)}% confidence
                </motion.p>
              </div>

              {isOrganic && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={cn(
                "mt-6 p-5 rounded-2xl backdrop-blur-sm border",
                isOrganic 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-destructive/5 border-destructive/20"
              )}
            >
              <p className="text-base leading-relaxed">
                {isOrganic ? (
                  <>This produce is <span className="font-bold text-primary">certified organic</span>, grown without synthetic pesticides, fertilizers, or GMOs. A healthier choice for you and the environment! 🌱</>
                ) : (
                  <>This produce is <span className="font-bold text-destructive">conventionally grown</span> and may contain pesticide residues. Wash thoroughly before consumption.</>
                )}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Toggle Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex gap-3 p-1.5 bg-muted/50 backdrop-blur-sm rounded-2xl border"
        >
          <button
            onClick={() => setActiveTab("details")}
            className={cn(
              "flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300",
              activeTab === "details"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Detection Details
          </button>
          <button
            onClick={() => setActiveTab("nutrition")}
            className={cn(
              "flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300",
              activeTab === "nutrition"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Nutrition Info
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
                  <Card className="overflow-hidden border-2 border-blue-500/20 bg-blue-500/5">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-500/10 p-3">
                          <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-1">
                              Verification Analysis {manualVerdict && <span className="text-sm font-normal">(Manual PLU)</span>}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700">
                                {activeVerdict.match === 'perfect_match' ? 'Perfect Match' : 
                                 activeVerdict.match === 'disagreement_plu_trusted' ? 'PLU Code Trusted' :
                                 activeVerdict.match === 'disagreement_model_trusted' ? 'AI Model Trusted' :
                                 'No PLU Code'}
                              </Badge>
                              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700">
                                {activeVerdict.reliability === 'very_high' ? 'Very High Confidence' :
                                 activeVerdict.reliability === 'high' ? 'High Confidence' :
                                 activeVerdict.reliability === 'moderate' ? 'Moderate Confidence' :
                                 'Low Confidence'}
                              </Badge>
                            </div>
                          </div>

                          {activeVerdict.reasoning && (
                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                              <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                                <Info className="h-4 w-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                                {activeVerdict.reasoning}
                              </p>
                            </div>
                          )}

                          {activeVerdict.recommendation && (
                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                💡 <strong>Recommendation:</strong> {activeVerdict.recommendation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <Card className="backdrop-blur-xl bg-card/80 shadow-xl border-2 rounded-3xl overflow-hidden">
                <CardContent className="p-8 space-y-6">
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
              <Card className="backdrop-blur-xl bg-card/80 shadow-xl border-2 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {nutritionFacts && (
                      <div>
                        <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Nutrition Facts
                        </h4>
                        <p className="text-base leading-relaxed text-muted-foreground">
                          {nutritionFacts}
                        </p>
                      </div>
                    )}
                    {cleaningTips && (
                      <div>
                        <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Cleaning Tips
                        </h4>
                        <p className="text-base leading-relaxed text-muted-foreground">
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="w-full h-16 text-base font-bold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30 rounded-2xl"
              onClick={handleReportFraud}
              data-testid="button-report-fraud"
            >
              <Flag className="h-5 w-5 mr-2" />
              Report Fraud
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              className={cn(
                "w-full h-16 text-base font-bold text-white shadow-lg rounded-2xl transition-all duration-300",
                showChatbot
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-purple-500/30"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/30"
              )}
              onClick={handleToggleChatbot}
              data-testid="button-ai-assistant"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {showChatbot ? "Hide AI" : "AI Assistant"}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="w-full h-16 text-base font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg shadow-primary/30 rounded-2xl"
              onClick={onSave}
              data-testid="button-save"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Scan
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="w-full h-16 text-base font-bold bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg shadow-slate-700/30 rounded-2xl"
              onClick={onScanAgain}
              data-testid="button-scan-again"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Scan Another
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
