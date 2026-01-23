import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type CardSkeletonVariant = "single" | "content" | "comment" | "postList" | "chart";

interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardSkeletonVariant;
  type?: CardSkeletonVariant;
}

export function CardSkeleton({
  className,
  variant,
  type,
  ...props
}: CardSkeletonProps) {
  const resolvedVariant: CardSkeletonVariant = variant ?? type ?? "single";

  const renderSkeletonByVariant = () => {
    switch (resolvedVariant) {
      case "single":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-10/12" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          </div>
        );

      case "content":
        return (
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        );

      case "comment":
        return (
          <div className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3" /> {/* username */}
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-10/12" />
            </div>
          </div>
        );

      case "postList":
        return (
          <div className="flex gap-3">
            <Skeleton className="h-20 w-24 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        );
      case "chart":
        return (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-1/3" />
            <div className="flex justify-center">
              <Skeleton className="aspect-square w-full max-w-[260px] rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 shadow-sm",
        "animate-pulse",
        className
      )}
      {...props}
    >
      {renderSkeletonByVariant()}
    </div>
  );
}
