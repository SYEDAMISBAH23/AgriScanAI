import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, Clock, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ResultsCard from "@/components/ResultsCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HistoryItem {
  id: number;
  date: string;
  produce: string;
  verdict: string;
  confidence: number;
  plu?: string;
  fullData: any;
}

export default function HistoryPage() {
  const { toast } = useToast();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem("agriscan_history");
    setHistory(stored ? JSON.parse(stored) : []);
  };

  const deleteItem = (id: number) => {
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem("agriscan_history", JSON.stringify(updated));
    setHistory(updated);
    toast({
      title: "Scan deleted",
      description: "History item removed successfully.",
    });
  };

  const clearAll = () => {
    localStorage.setItem("agriscan_history", "[]");
    setHistory([]);
    toast({
      title: "History cleared",
      description: "All scan history has been removed.",
    });
  };

  const filteredHistory = history.filter((item) =>
    item.produce.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Scan History</h1>
          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" data-testid="button-clear-all">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your scan history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAll}>Delete All</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {history.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by produce name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        )}

        {filteredHistory.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <Leaf className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold mb-2">No scans yet</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No scans match your search"
                    : "Start scanning produce to build your history"}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHistory.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover-elevate"
                onClick={() => setSelectedItem(item)}
                data-testid={`card-history-${item.id}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="capitalize">{item.produce}</span>
                    <Badge
                      className={
                        item.verdict === "ORGANIC"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-600 text-white"
                      }
                    >
                      {item.verdict}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {item.date}
                  </div>
                  {item.plu && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">PLU:</span>{" "}
                      <code className="font-mono bg-muted px-1.5 py-0.5 rounded">
                        {item.plu}
                      </code>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Confidence:</span>{" "}
                    {Math.round(item.confidence * 100)}%
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item.id);
                    }}
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Scan Details</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <ResultsCard
                produceLabel={selectedItem.fullData.produce_label}
                produceConfidence={selectedItem.fullData.produce_confidence}
                verdict={selectedItem.fullData.verdict?.verdict || "UNKNOWN"}
                verdictConfidence={selectedItem.fullData.verdict?.verdict_confidence || 0}
                reliability={selectedItem.fullData.verdict?.reliability || "moderate"}
                detectedPLU={selectedItem.fullData.detected_plu}
                pluMeaning={selectedItem.fullData.plu_meaning}
                reasoning={selectedItem.fullData.verdict?.reasoning || ""}
                recommendation={selectedItem.fullData.verdict?.recommendation || ""}
                nutrition={selectedItem.fullData.automatic_advice}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
