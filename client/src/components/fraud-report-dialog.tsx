import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [purchaseDate, setPurchaseDate] = useState("");
  const [pricePaid, setPricePaid] = useState("");
  const [fraudType, setFraudType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorName.trim() || !location.trim() || !fraudType || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
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
        purchaseDate: purchaseDate || null,
        pricePaid: pricePaid || null,
        fraudType,
        description: description.trim(),
      });

      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe",
      });

      // Reset form
      setVendorName("");
      setLocation("");
      setEmail("");
      setPurchaseDate("");
      setPricePaid("");
      setFraudType("");
      setDescription("");
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase-date">Purchase Date</Label>
              <Input
                id="purchase-date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                data-testid="input-purchase-date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price-paid">Price Paid</Label>
              <Input
                id="price-paid"
                type="text"
                placeholder="e.g., $5.99"
                value={pricePaid}
                onChange={(e) => setPricePaid(e.target.value)}
                data-testid="input-price-paid"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fraud-type">
              Type of Issue <span className="text-destructive">*</span>
            </Label>
            <Select value={fraudType} onValueChange={setFraudType} required>
              <SelectTrigger id="fraud-type" data-testid="select-fraud-type">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mislabeled_organic">Mislabeled as Organic</SelectItem>
                <SelectItem value="fake_plu">Fake/Incorrect PLU Code</SelectItem>
                <SelectItem value="no_certification">No Organic Certification</SelectItem>
                <SelectItem value="pesticide_residue">Pesticide Residue Found</SelectItem>
                <SelectItem value="price_fraud">Price Manipulation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Please describe what happened in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              data-testid="input-description"
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
            <p className="text-xs text-muted-foreground">We'll only use this to follow up on your report</p>
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
