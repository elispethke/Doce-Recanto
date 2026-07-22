import { Star } from "lucide-react";

export function RatingStars({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="size-3.5 fill-gold text-gold" />
      <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
      {typeof reviewCount === "number" && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
