import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle";
}

export function Skeleton({
  className,
  variant = "rectangle",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200",
        variant === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    />
  );
}
