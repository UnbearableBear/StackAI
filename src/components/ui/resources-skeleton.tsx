import { Skeleton } from "@/components/ui/skeleton";

type ResourcesSkeletonProps = {
  count?: number;
  level?: number;
};

export default function ResourcesSkeleton({
  count = 5,
  level = 0,
}: ResourcesSkeletonProps) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-md"
          style={{ paddingLeft: `${12 + level * 24}px` }}
        >
          {/* Checkbox */}
          <Skeleton className="h-4 w-4 flex-shrink-0" />

          {/* Resource name */}
          <div className="flex-1">
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
