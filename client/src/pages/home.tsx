import { useState } from "react";
import { useLocation } from "wouter";
import { History, LogOut, Flag, Info, Sparkles, Camera, Upload, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { AgriScanAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { CameraCapture } from "@/components/camera-capture";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [isScanning, setIsScanning] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation("/login");
  };

  const handleCapture = async (imageData: string) => {
    setIsScanning(true);

    try {
      // Convert base64 to File
      const blob = await (await fetch(imageData)).blob();
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });

      const result = await AgriScanAPI.scanProduce(file);

      // Store result with image in sessionStorage for results page
      const resultWithImage = {
        ...result,
        imageUrl: imageData, // Store the base64 image
      };
      sessionStorage.setItem("currentScan", JSON.stringify(resultWithImage));

      toast({
        title: "Scan complete!",
        description: `Detected: ${result.produce_label}`,
      });

      // Navigate to results
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
      // Convert file to base64 for display
      const reader = new FileReader();
      const imageDataPromise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const [result, imageData] = await Promise.all([
        AgriScanAPI.scanProduce(file),
        imageDataPromise,
      ]);

      // Store result with image in sessionStorage for results page
      const resultWithImage = {
        ...result,
        imageUrl: imageData, // Store the base64 image
      };
      sessionStorage.setItem("currentScan", JSON.stringify(resultWithImage));

      toast({
        title: "Scan complete!",
        description: `Detected: ${result.produce_label}`,
      });

      // Navigate to results
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

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-background to-blue-500/5 pointer-events-none" />
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-amber-500/5 pointer-events-none"
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                AgriScan AI
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Powered by Intelligence</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/about")}
              className="h-11 w-11"
              data-testid="button-about"
            >
              <Info className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/history")}
              className="h-11 w-11"
              data-testid="button-history"
            >
              <History className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/fraud-reports")}
              className="h-11 w-11"
              data-testid="button-fraud-reports"
            >
              <Flag className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-11 w-11"
              data-testid="button-logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12 pt-8"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
            >
              <Zap className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                AI-Powered Produce Analysis
              </span>
            </motion.div>

            <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Scan Your Produce
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Instantly identify produce, verify organic certification, and get AI-powered health insights
            </p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-8"
            >
              {[
                { icon: Camera, text: "Live Camera" },
                { icon: Upload, text: "Upload Image" },
                { icon: Sparkles, text: "AI Analysis" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-card border rounded-full shadow-sm"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scanner Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {isScanning ? (
              <div className="flex items-center justify-center min-h-[500px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-20 w-20 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-6"
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold mb-2"
                  >
                    Analyzing produce...
                  </motion.p>
                  <p className="text-base text-muted-foreground">
                    Our AI is identifying your produce
                  </p>

                  {/* Pulsing Effects */}
                  <div className="mt-8 flex items-center justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="h-3 w-3 rounded-full bg-emerald-500"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              <CameraCapture 
                onCapture={handleCapture} 
                onUpload={handleUpload}
              />
            )}
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Advanced machine learning models trained on thousands of produce images",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Zap,
                title: "Instant Results",
                description: "Get detailed analysis, nutrition facts, and safety tips in seconds",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Camera,
                title: "Easy to Use",
                description: "Simply snap a photo or upload an image to get started",
                color: "from-emerald-500 to-emerald-600",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-8 bg-card border-2 border-border/50 rounded-3xl backdrop-blur-sm hover:border-primary/30 transition-colors duration-300">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-5 shadow-lg shadow-black/10`}>
                    <card.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
