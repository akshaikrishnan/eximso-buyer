export default function HomePageWidgetsSkeleton() {
  return (
    <div className="space-y-10">
      {[0, 1].map((section) => (
        <div key={section} className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded-full bg-muted/50" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-48 w-full animate-pulse rounded-xl bg-muted/40"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
