import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, Shield, Sparkles, Heart, Brain, Zap, Target, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 space-y-20">

          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive px-6 py-3 rounded-full">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-bold">Critical Health Information</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Your Food's{" "}
              <span className="text-primary">
                Hidden Story
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              What if the produce in your cart holds secrets that could protect your family's health?
            </p>
          </div>

          {/* The Problem */}
          <div className="p-8 md:p-12 rounded-xl bg-destructive/5 border border-destructive/20">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="h-16 w-16 rounded-lg bg-destructive flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-destructive-foreground" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-destructive">
                  The Silent Threat
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Every year, <span className="font-bold text-foreground">70% of conventionally grown produce</span> contains pesticide residues. 
                  These chemicals, invisible to the naked eye, accumulate in our bodies over time, linked to neurological disorders, 
                  hormonal disruption, and increased cancer risk. Yet most people never think twice about what's on their food.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Children at Risk",
                stat: "6x Lower",
                description: "Organic produce shows 6x lower pesticide levels in children's urine. Their developing brains are especially vulnerable.",
              },
              {
                icon: Heart,
                title: "Long-Term Impact",
                stat: "Chronic Exposure",
                description: "Linked to Parkinson's disease, fertility issues, and developmental delays in children.",
              },
              {
                icon: Shield,
                title: "Knowledge Gap",
                stat: "89% Can't Tell",
                description: "Most consumers can't identify organic produce by sight alone, leaving families unknowingly exposed.",
              },
            ].map((card, i) => (
              <div key={i} className="p-6 bg-card border rounded-xl hover-elevate">
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <card.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-2">{card.title}</h3>
                <div className="text-2xl font-bold mb-3 text-primary">
                  {card.stat}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* The Solution */}
          <div className="p-8 md:p-12 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>

              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                  The Solution: Knowledge is Power
                </h2>
                <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                  AgriScan AI empowers you to make informed choices instantly. With cutting-edge AI technology, 
                  we decode PLU codes, verify organic certification, and reveal what's really in your produce—before it reaches your table.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { icon: Zap, text: "Instant Verification" },
                    { icon: Target, text: "95% Accuracy" },
                    { icon: Heart, text: "Protect Your Family" },
                    { icon: Brain, text: "AI-Powered Insights" },
                    { icon: Shield, text: "Fraud Detection" },
                    { icon: Users, text: "Community Reports" },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-card border rounded-lg"
                    >
                      <feature.icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="font-medium text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-8 py-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Don't Gamble With Your Health
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Every scan is a step toward a healthier future. Know what you're eating. Protect what matters most.
            </p>

            <div>
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={() => setLocation("/")}
                data-testid="button-start-scanning"
              >
                <ShieldCheck className="h-5 w-5 mr-2" />
                Start Scanning Now
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
