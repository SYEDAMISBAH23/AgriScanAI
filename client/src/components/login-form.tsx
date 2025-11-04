import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Sparkles, ShieldCheck } from "lucide-react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
      <div className="absolute top-20 left-10 h-72 w-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 h-96 w-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in-50 slide-in-from-top-4 duration-700">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            AgriScan AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Detection & Verification System
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-2 shadow-2xl animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-200">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 pb-4">
              <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
              <p className="text-sm text-muted-foreground text-center">
                Sign in to continue your journey
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                  data-testid="input-password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-5 pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                data-testid="button-login"
              >
                Sign In
              </Button>

              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Secure</span>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => window.location.href = '/about'}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 mb-2"
                  data-testid="link-about"
                >
                  Why does this matter for your health?
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Join <span className="font-semibold text-foreground">10,000+</span> eco-conscious shoppers
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
