import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface ConfidenceMeterProps {
  label: string;
  confidence: number;
}

export function ConfidenceMeter({ label, confidence }: ConfidenceMeterProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = confidence * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="space-y-2 group">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium transition-colors group-hover:text-foreground">
          {label}
        </span>
        <span className="text-sm font-mono text-muted-foreground transition-all group-hover:text-foreground group-hover:scale-105">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <Progress value={animatedValue} className="h-2 transition-all duration-1000 ease-out" />
    </div>
  );
}
