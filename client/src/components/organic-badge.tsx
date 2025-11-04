import { Leaf, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OrganicBadgeProps {
  isOrganic: boolean;
  confidence: number;
  className?: string;
}

export function OrganicBadge({ isOrganic, confidence, className }: OrganicBadgeProps) {
  return (
    <Badge
      className={cn(
        "px-4 py-2 gap-2 text-base font-medium animate-in fade-in-50 slide-in-from-top-2 duration-400",
        isOrganic 
          ? "bg-accent hover:bg-accent text-accent-foreground" 
          : "bg-destructive hover:bg-destructive text-destructive-foreground",
        className
      )}
      data-testid={`badge-organic-${isOrganic ? "yes" : "no"}`}
    >
      {isOrganic ? (
        <Leaf className="h-5 w-5" />
      ) : (
        <AlertCircle className="h-5 w-5" />
      )}
      {isOrganic ? "Organic" : "Non-Organic"}
      <span className="text-xs opacity-90">
        {(confidence * 100).toFixed(0)}%
      </span>
    </Badge>
  );
}
