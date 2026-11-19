export default function Skeleton({ className = '', variant = 'rect' }) {
  const base = 'skeleton-shimmer rounded-xl';
  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />;
  }
  if (variant === 'text') {
    return <div className={`${base} h-4 ${className}`} />;
  }
  return <div className={`${base} ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="glass p-4 flex items-center gap-4">
          <Skeleton variant="circle" className="w-10 h-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass p-6 space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
