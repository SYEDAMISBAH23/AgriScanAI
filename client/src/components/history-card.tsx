import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HistoryCardProps {
  id: string;
  imageUrl: string;
  produceLabel: string;
  organicLabel: string;
  createdAt: Date;
  onClick?: () => void;
}

export function HistoryCard({
  imageUrl,
  produceLabel,
  organicLabel,
  createdAt,
  onClick,
}: HistoryCardProps) {
  const isOrganic = organicLabel?.toLowerCase() === "organic";

  return (
    <Card
      className="overflow-hidden hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`card-history-${produceLabel}`}
    >
      <div className="relative aspect-video">
        <img
          src={imageUrl}
          alt={produceLabel}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant={isOrganic ? "default" : "destructive"}
            className="gap-1"
          >
            {isOrganic ? (
              <Leaf className="h-3 w-3" />
            ) : (
              <AlertCircle className="h-3 w-3" />
            )}
            {isOrganic ? "Organic" : "Non-Organic"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold capitalize mb-1" data-testid="text-history-produce">
          {produceLabel}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
}
