import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FraudReport {
  id: number;
  date: string;
  produce: string;
  plu: string;
  severity: string;
  status: string;
  location: string;
  vendor: string;
  description: string;
}

export default function FraudReportPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [formData, setFormData] = useState({
    produce: "",
    plu: "",
    location: "",
    vendor: "",
    description: "",
    severity: "medium",
  });

  useEffect(() => {
    const stored = localStorage.getItem("fraud_reports");
    setReports(stored ? JSON.parse(stored) : []);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: FraudReport = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      produce: formData.produce,
      plu: formData.plu,
      severity: formData.severity,
      status: "pending",
      location: formData.location,
      vendor: formData.vendor,
      description: formData.description,
    };

    const updated = [newReport, ...reports];
    localStorage.setItem("fraud_reports", JSON.stringify(updated));
    setReports(updated);

    setFormData({
      produce: "",
      plu: "",
      location: "",
      vendor: "",
      description: "",
      severity: "medium",
    });

    toast({
      title: "Report Submitted",
      description: "Your fraud report has been recorded successfully.",
    });
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    verified: reports.filter((r) => r.status === "verified").length,
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <h1 className="text-4xl font-bold">Report Fraud</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verified}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Fraud Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="produce">Produce Name *</Label>
                  <Input
                    id="produce"
                    placeholder="e.g., Banana"
                    value={formData.produce}
                    onChange={(e) =>
                      setFormData({ ...formData, produce: e.target.value })
                    }
                    required
                    data-testid="input-produce"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plu">PLU Code</Label>
                  <Input
                    id="plu"
                    placeholder="e.g., 4011"
                    value={formData.plu}
                    onChange={(e) =>
                      setFormData({ ...formData, plu: e.target.value })
                    }
                    data-testid="input-plu"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Store name or location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    data-testid="input-location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor Name</Label>
                  <Input
                    id="vendor"
                    placeholder="Vendor or brand"
                    value={formData.vendor}
                    onChange={(e) =>
                      setFormData({ ...formData, vendor: e.target.value })
                    }
                    data-testid="input-vendor"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) =>
                    setFormData({ ...formData, severity: value })
                  }
                >
                  <SelectTrigger data-testid="select-severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the suspected fraud in detail..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  required
                  data-testid="input-description"
                />
              </div>

              <Button type="submit" className="w-full" data-testid="button-submit">
                Submit Report
              </Button>
            </form>
          </CardContent>
        </Card>

        {reports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                    data-testid={`report-${report.id}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{report.produce}</span>
                        {report.plu && (
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                            {report.plu}
                          </code>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {report.location} • {report.date}
                      </p>
                      <p className="text-sm">{report.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        className={
                          report.severity === "high"
                            ? "bg-red-500 text-white"
                            : report.severity === "medium"
                            ? "bg-amber-500 text-white"
                            : "bg-emerald-500 text-white"
                        }
                      >
                        {report.severity}
                      </Badge>
                      <Badge variant="outline">{report.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
