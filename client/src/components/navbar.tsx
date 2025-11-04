import { useLocation } from "wouter";
import { History, LogOut, Flag, Info, Home as HomeIcon, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import logoImage from "@assets/image-removebg-preview_1762242218411.png";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { logout, isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                data-testid="button-home"
                className={location === "/" ? "bg-primary/10" : ""}
              >
                <HomeIcon className={location === "/" ? "h-4 w-4 text-primary" : "h-4 w-4"} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
          {isAuthenticated && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLocation("/history")}
                    data-testid="button-history"
                    className={location === "/history" ? "bg-primary/10" : ""}
                  >
                    <History className={location === "/history" ? "h-4 w-4 text-primary" : "h-4 w-4"} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>History</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLocation("/fraud-reports")}
                    data-testid="button-fraud-reports"
                    className={location === "/fraud-reports" ? "bg-primary/10" : ""}
                  >
                    <Flag className={location === "/fraud-reports" ? "h-4 w-4 text-primary" : "h-4 w-4"} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fraud Reports</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/about")}
                data-testid="button-about"
                className={location === "/about" ? "bg-primary/10" : ""}
              >
                <Info className={location === "/about" ? "h-4 w-4 text-primary" : "h-4 w-4"} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>About</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="flex items-center gap-1 ml-2">
            {isAuthenticated ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid="icon-logged-in"
                    >
                      <UserCheck className="h-4 w-4 text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{user?.email || "Logged In"}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      data-testid="button-logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid="icon-guest"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Guest</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setLocation("/login")}
                  data-testid="button-login"
                >
                  Sign In
                </Button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
