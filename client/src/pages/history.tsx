import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { HistoryCard } from "@/components/history-card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgriScanAPI, type HistoryItem } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

export default function History() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "organic" | "non-organic">("all");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history on component mount
  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (!user?.email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await AgriScanAPI.getHistory(user.email);
      setHistory(data);
    } catch (error: any) {
      console.error("Failed to load history:", error);
      toast({
        title: "Failed to load history",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filter === "all") return true;
    if (filter === "organic") return item.organic_label === "organic";
    return item.organic_label !== "organic";
  });

  const handleCardClick = (item: HistoryItem) => {
    // Store the selected scan result for the results page
    sessionStorage.setItem("currentScan", JSON.stringify(item));
    setLocation("/results");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all" data-testid="filter-all">All</TabsTrigger>
            <TabsTrigger value="organic" data-testid="filter-organic">Organic</TabsTrigger>
            <TabsTrigger value="non-organic" data-testid="filter-non-organic">Non-Organic</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {filter === "all" ? "No scans found" : `No ${filter} scans found`}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setLocation("/")}
            >
              Start Scanning
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item, index) => (
              <HistoryCard
                key={item.id || index}
                id={item.id?.toString() || index.toString()}
                imageUrl={(item as any).imageUrl || "/placeholder-produce.jpg"}
                produceLabel={item.produce_label}
                organicLabel={item.organic_label}
                createdAt={new Date(item.timestamp)}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}