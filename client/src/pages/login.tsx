import { useState } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, ArrowRight, Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import logoImage from "@assets/image_1762241916124.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const mockUser = { id: "1", email };
      login(email);

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      setLocation("/");
      setIsLoading(false);
    }, 800);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8 bg-background"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                <img src={logoImage} alt="AgriScan AI" className="h-9 w-9 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AgriScan AI</h1>
                <p className="text-sm text-muted-foreground">Detection & Verification</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to verify your organic produce</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      data-testid="input-email"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      data-testid="input-password"
                      className="h-11"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-semibold"
                    disabled={isLoading}
                    data-testid="button-login"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>Demo credentials: Any email and password</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 bg-muted/50 p-8 lg:p-12 flex items-center justify-center"
      >
        <div className="max-w-lg">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            <motion.div variants={fadeInUp} className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Trusted Verification</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Verify Organic Produce with Confidence
              </h3>
              <p className="text-lg text-muted-foreground">
                AgriScan uses advanced AI to help you identify authentic organic produce
                and avoid food fraud.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              {[
                {
                  icon: Sparkles,
                  title: "AI-Powered Analysis",
                  description: "Advanced machine learning models trained on thousands of produce images"
                },
                {
                  icon: Shield,
                  title: "PLU Code Verification",
                  description: "Cross-reference against official organic certification databases"
                },
                {
                  icon: CheckCircle2,
                  title: "Instant Results",
                  description: "Get detailed verification reports in seconds, not minutes"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-card flex items-center justify-center border">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 pt-10 border-t">
              <div className="flex items-center gap-8 text-sm">
                <div>
                  <div className="text-2xl font-bold text-foreground">99.2%</div>
                  <div className="text-muted-foreground">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">50K+</div>
                  <div className="text-muted-foreground">Scans Processed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">&lt;2s</div>
                  <div className="text-muted-foreground">Avg Response</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
