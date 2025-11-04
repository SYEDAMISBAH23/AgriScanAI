import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf, AlertTriangle, Shield, Sparkles, Heart, Brain, Zap, Target, Users } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-background to-red-500/5 pointer-events-none" />
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-blue-500/5 pointer-events-none"
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="h-11 w-11"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 space-y-20">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-6 py-3 rounded-full"
            >
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-bold">Critical Health Information</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight">
              Your Food's{" "}
              <span className="bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 bg-clip-text text-transparent">
                Hidden Story
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
              What if the produce in your cart holds secrets that could protect your family's health?
            </p>
          </motion.div>

          {/* The Problem */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative"
          >
            <motion.div
              animate={{
                boxShadow: "0 0 60px rgba(239, 68, 68, 0.2)"
              }}
              className="p-10 md:p-14 rounded-3xl bg-red-500/5 border-2 border-red-500/20 backdrop-blur-sm"
            >
              <div className="flex items-start gap-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-xl"
                >
                  <AlertTriangle className="h-10 w-10 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-red-600 dark:text-red-400">
                    The Silent Threat
                  </h2>
                  <p className="text-xl leading-relaxed text-muted-foreground">
                    Every year, <span className="font-bold text-foreground">70% of conventionally grown produce</span> contains pesticide residues. 
                    These chemicals, invisible to the naked eye, accumulate in our bodies over time, linked to neurological disorders, 
                    hormonal disruption, and increased cancer risk. Yet most people never think twice about what's on their food.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Statistics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Brain,
                title: "Children at Risk",
                stat: "6x Lower",
                description: "Organic produce shows 6x lower pesticide levels in children's urine. Their developing brains are especially vulnerable.",
                color: "from-red-500 to-red-600",
              },
              {
                icon: Heart,
                title: "Long-Term Impact",
                stat: "Chronic Exposure",
                description: "Linked to Parkinson's disease, fertility issues, and developmental delays in children.",
                color: "from-amber-500 to-amber-600",
              },
              {
                icon: Shield,
                title: "Knowledge Gap",
                stat: "89% Can't Tell",
                description: "Most consumers can't identify organic produce by sight alone, leaving families unknowingly exposed.",
                color: "from-blue-500 to-blue-600",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-8 bg-card border-2 border-border/50 rounded-3xl backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <card.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-black text-2xl mb-2">{card.title}</h3>
                  <div className="text-3xl font-black mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {card.stat}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* The Solution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="relative"
          >
            <motion.div
              animate={{
                boxShadow: "0 0 80px rgba(34, 197, 94, 0.3)"
              }}
              className="p-10 md:p-14 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row items-start gap-8">
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="relative"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full blur-2xl opacity-50 bg-emerald-500"
                  />
                  <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-2xl">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-emerald-600 dark:text-emerald-400">
                    The Solution: Knowledge is Power
                  </h2>
                  <p className="text-xl leading-relaxed mb-8 text-muted-foreground">
                    AgriScan AI empowers you to make informed choices instantly. With cutting-edge AI technology, 
                    we decode PLU codes, verify organic certification, and reveal what's really in your produce—before it reaches your table.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { icon: Zap, text: "Instant Verification" },
                      { icon: Target, text: "95% Accuracy" },
                      { icon: Heart, text: "Protect Your Family" },
                      { icon: Brain, text: "AI-Powered Insights" },
                      { icon: Shield, text: "Fraud Detection" },
                      { icon: Users, text: "Community Reports" },
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.05 }}
                        className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl"
                      >
                        <feature.icon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span className="font-bold text-sm">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-center space-y-8 py-12"
          >
            <h2 className="text-5xl md:text-6xl font-black">
              Don't Gamble With Your Health
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Every scan is a step toward a healthier future. Know what you're eating. Protect what matters most.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="text-xl px-12 py-8 h-auto shadow-2xl shadow-emerald-500/30 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-2xl"
                onClick={() => setLocation("/")}
                data-testid="button-start-scanning"
              >
                <Leaf className="h-6 w-6 mr-3" />
                Start Scanning Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
