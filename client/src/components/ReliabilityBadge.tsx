import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReliabilityBadgeProps {
  reliability: "very_high" | "high" | "moderate";
  confidence: number;
}

export default function ReliabilityBadge({
  reliability,
  confidence,
}: ReliabilityBadgeProps) {
  const config = {
    very_high: {
      icon: CheckCircle,
      label: "Very High",
      className: "bg-emerald-500 text-white hover:bg-emerald-600",
    },
    high: {
      icon: AlertTriangle,
      label: "High",
      className: "bg-amber-500 text-white hover:bg-amber-600",
    },
    moderate: {
      icon: AlertCircle,
      label: "Moderate",
      className: "bg-red-500 text-white hover:bg-red-600",
    },
  };

  const { icon: Icon, label, className } = config[reliability];

  return (
    <Badge className={`gap-1.5 ${className}`} data-testid={`badge-reliability-${reliability}`}>
      <Icon className="h-3.5 w-3.5" />
      {label} ({Math.round(confidence * 100)}%)
    </Badge>
  );
}
