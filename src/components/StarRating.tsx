'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  reviewCount?: number;
};

export function StarRating({
  rating,
  totalStars = 5,
  size = 16,
  className,
  reviewCount,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const emptyStars = totalStars - fullStars;

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <div className="flex items-center" aria-label={`Note de ${rating} sur ${totalStars}`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={size} className="text-yellow-400 fill-yellow-400" />
        ))}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>
      <p className="text-muted-foreground">
        <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
        {reviewCount != null && ` (${reviewCount} avis)`}
      </p>
    </div>
  );
}
