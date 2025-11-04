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

  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-primary transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-center mt-3">
        {label}
      </span>
    </div>
  );
}
