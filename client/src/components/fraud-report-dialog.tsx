import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FraudReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produceLabel: string;
  organicLabel: string;
}

export function FraudReportDialog({
  open,
  onOpenChange,
  produceLabel,
  organicLabel,
}: FraudReportDialogProps) {
  const { toast } = useToast();
  const [vendorName, setVendorName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorName.trim() || !location.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in vendor name and location",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/fraud-reports", {
        produceLabel,
        organicLabel,
        vendorName: vendorName.trim(),
        location: location.trim(),
        email: email.trim() || null,
      });

      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe",
      });

      // Reset form
      setVendorName("");
      setLocation("");
      setEmail("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Failed to submit report",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Flag className="h-6 w-6" />
            Report Fraud
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendor-name">
              Vendor Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="vendor-name"
              placeholder="e.g., Fresh Market"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
              data-testid="input-vendor-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              placeholder="e.g., New York, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              data-testid="input-location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-destructive hover:bg-destructive/90"
            disabled={isSubmitting}
            data-testid="button-submit-report"
          >
            <Flag className="h-5 w-5 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
