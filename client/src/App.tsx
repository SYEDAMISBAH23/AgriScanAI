import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import HistoryPage from "@/pages/HistoryPage";
import FraudReportPage from "@/pages/FraudReportPage";
import AboutPage from "@/pages/AboutPage";
import Navbar from "@/components/Navbar";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const userEmail = localStorage.getItem("agriscan_user");
  
  if (!userEmail) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  const [, setLocation] = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("agriscan_user");
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("agriscan_user");
    setUserEmail(null);
    setLocation("/login");
  };

  const showNavbar = userEmail && window.location.pathname !== "/login";

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar userEmail={userEmail} onLogout={handleLogout} />}
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/home">
          {() => <ProtectedRoute component={HomePage} />}
        </Route>
        <Route path="/history">
          {() => <ProtectedRoute component={HistoryPage} />}
        </Route>
        <Route path="/report">
          {() => <ProtectedRoute component={FraudReportPage} />}
        </Route>
        <Route path="/about">
          {() => <ProtectedRoute component={AboutPage} />}
        </Route>
        <Route path="/">
          {() => {
            const email = localStorage.getItem("agriscan_user");
            return email ? <Redirect to="/home" /> : <Redirect to="/login" />;
          }}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
