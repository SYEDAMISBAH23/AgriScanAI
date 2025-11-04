import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { History, LogOut, Flag, Info, Scan, Upload, CheckCircle2, Shield, Sparkles, ArrowRight, Camera, ShieldCheck, BookCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { AgriScanAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { CameraCapture } from "@/components/camera-capture";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import logoImage from "@assets/image-removebg-preview_1762242218411.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef<HTMLElement>(null);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation("/login");
  };

  const scrollToScanner = () => {
    setShowScanner(true);
    setTimeout(() => {
      scannerRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleCapture = async (imageData: string) => {
    setIsScanning(true);

    try {
      const blob = await (await fetch(imageData)).blob();
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });

      const result = await AgriScanAPI.scanProduce(file);

      const resultWithImage = {
        ...result,
        imageUrl: imageData,
      };
      sessionStorage.setItem("currentScan", JSON.stringify(resultWithImage));

      toast({
        title: "Scan complete!",
        description: `Detected: ${result.produce_label}`,
      });

      setTimeout(() => {
        setLocation("/results");
      }, 500);

    } catch (error: any) {
      console.error("Scan error:", error);
      toast({
        title: "Scan failed",
        description: error.message || "Please try again with a clearer image",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsScanning(true);

    try {
      const reader = new FileReader();
      const imageDataPromise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const [result, imageData] = await Promise.all([
        AgriScanAPI.scanProduce(file),
        imageDataPromise,
      ]);

      const resultWithImage = {
        ...result,
        imageUrl: imageData,
      };
      sessionStorage.setItem("currentScan", JSON.stringify(resultWithImage));

      toast({
        title: "Scan complete!",
        description: `Detected: ${result.produce_label}`,
      });

      setTimeout(() => {
        setLocation("/results");
      }, 500);

    } catch (error: any) {
      console.error("Scan error:", error);
      toast({
        title: "Scan failed",
        description: error.message || "Please try again with a clearer image",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-card border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
              <img src={logoImage} alt="AgriScan AI" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">AgriScan AI</h1>
              <p className="text-xs text-muted-foreground">Scan. Identify. Eat Healthy.</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/history")}
              data-testid="button-history"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/fraud-reports")}
              data-testid="button-fraud-reports"
            >
              <Flag className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/about")}
              data-testid="button-about"
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Main Content - Scrollable Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Certified Organic Verification</span>
              </motion.div>

              <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Verify Organic Produce
                <span className="text-primary"> Instantly</span>
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                Stop guessing about organic certification. AgriScan uses AI-powered image recognition
                and PLU code analysis to verify the authenticity of your organic produce in seconds.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={scrollToScanner}
                  className="h-12 px-8 text-base font-semibold"
                  data-testid="button-start-scan"
                >
                  <Scan className="h-5 w-5 mr-2" />
                  Start Scanning
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/history")}
                  className="h-12 px-8 text-base"
                  data-testid="button-view-history"
                >
                  View History
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Instant Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>PLU Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>AI-Powered</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Scanner Section - Shown when user clicks start */}
        {showScanner && (
          <motion.section
            ref={scannerRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="py-8 px-4 sm:px-6 border-t bg-muted/30"
          >
            <div className="max-w-5xl mx-auto">
              {isScanning ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-xl font-semibold mb-2">Analyzing produce...</p>
                    <p className="text-sm text-muted-foreground">Our AI is verifying authenticity</p>
                  </motion.div>
                </div>
              ) : (
                <CameraCapture 
                  onCapture={handleCapture} 
                  onUpload={handleUpload}
                />
              )}
            </div>
          </motion.section>
        )}

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.h3 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                How AgriScan Works
              </motion.h3>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our advanced verification process ensures accurate organic certification
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-4 gap-8"
            >
              {[
                {
                  step: "01",
                  icon: Camera,
                  title: "Capture Image",
                  description: "Take a photo of your produce or upload an existing image from your device"
                },
                {
                  step: "02",
                  icon: Sparkles,
                  title: "AI Analysis",
                  description: "Our machine learning model identifies the produce type and detects PLU codes"
                },
                {
                  step: "03",
                  icon: BookCheck,
                  title: "Verification",
                  description: "Cross-reference PLU codes and visual markers against organic certification databases"
                },
                {
                  step: "04",
                  icon: CheckCircle2,
                  title: "Results & Advice",
                  description: "Get instant verification results, nutritional info, and personalized handling tips"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 text-6xl font-bold text-muted opacity-5">
                      {item.step}
                    </div>
                    <div className="relative">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features & Benefits Section */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Shield,
                  title: "Fraud Protection",
                  description: "Combat organic food fraud by verifying authenticity before purchase",
                  stat: "99.2% Accuracy"
                },
                {
                  icon: Sparkles,
                  title: "AI-Powered Insights",
                  description: "Get detailed nutritional information and personalized health recommendations",
                  stat: "Real-time Analysis"
                },
                {
                  icon: Upload,
                  title: "Easy Integration",
                  description: "Works with camera or uploaded images. No special equipment needed",
                  stat: "One-Click Scan"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-8 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
                        <feature.icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {feature.stat}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 bg-primary/5 border-y">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold mb-4">Ready to Verify Your Produce?</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of consumers making informed choices about organic food
              </p>
              <Button
                size="lg"
                onClick={scrollToScanner}
                className="h-12 px-10 text-base font-semibold"
                data-testid="button-cta-scan"
              >
                <Scan className="h-5 w-5 mr-2" />
                Scan Now - It's Free
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
