import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Flag, MapPin, Mail, Calendar, Search, Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { FraudReportDialog } from "@/components/fraud-report-dialog";
import type { FraudReport } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FraudReports() {
  const [, setLocation] = useLocation();
  const [searchVendor, setSearchVendor] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [showReportDialog, setShowReportDialog] = useState(false);

  const { data, isLoading } = useQuery<{ reports: FraudReport[] }>({
    queryKey: ["/api/fraud-reports"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const reports = data?.reports || [];

  // Filter by vendor name
  const filteredReports = reports.filter((report) => {
    if (!searchVendor.trim()) return true;
    return report.vendorName.toLowerCase().includes(searchVendor.toLowerCase());
  });

  // Sort by date
  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Flag className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Community Fraud Reports</h2>
                <p className="text-muted-foreground">
                  Report suspicious produce and search community reports
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowReportDialog(true)}
              className="gap-2"
              data-testid="button-report-fraud"
            >
              <Plus className="h-4 w-4" />
              Report Fraud
            </Button>
          </div>

          {/* Search and Filter Section */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by vendor name..."
                  value={searchVendor}
                  onChange={(e) => setSearchVendor(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-vendor"
                />
              </div>
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-sort-order">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Reports List */}
        {sortedReports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Flag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchVendor.trim() ? "No reports found" : "No reports yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchVendor.trim()
                  ? `No fraud reports found for "${searchVendor}"`
                  : "Be the first to report suspicious produce labeling"}
              </p>
              <Button
                onClick={() => setShowReportDialog(true)}
                variant="outline"
                className="gap-2"
                data-testid="button-report-fraud-empty"
              >
                <Plus className="h-4 w-4" />
                Report Fraud
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Showing {sortedReports.length} {sortedReports.length === 1 ? "report" : "reports"}
              {searchVendor.trim() && ` for "${searchVendor}"`}
            </div>
            {sortedReports.map((report) => (
              <Card key={report.id} className="overflow-hidden" data-testid={`fraud-report-${report.id}`}>
                <CardHeader className="bg-destructive/5 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        <Flag className="h-5 w-5 text-destructive" />
                        {report.produceLabel}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      report.organicLabel.toLowerCase() === "organic"
                        ? "bg-accent/20 text-accent"
                        : "bg-destructive/20 text-destructive"
                    }`}>
                      {report.organicLabel}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Vendor
                        </p>
                        <p className="font-semibold">{report.vendorName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Location
                        </p>
                        <p className="font-semibold">{report.location}</p>
                      </div>
                    </div>

                    {report.email && (
                      <div className="flex items-start gap-3 md:col-span-2">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Contact
                          </p>
                          <p className="font-semibold">{report.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {report.description && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-1 font-medium">
                        Description
                      </p>
                      <p className="text-sm">{report.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Fraud Report Dialog */}
      <FraudReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        produceLabel=""
        organicLabel=""
      />
    </div>
  );
}
