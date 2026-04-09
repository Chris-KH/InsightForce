export function AppBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute -top-56 -left-52 size-144 rounded-full bg-primary/16 blur-[130px]" />
      <div className="absolute -top-36 -right-64 size-136 rounded-full bg-chart-2/12 blur-[130px]" />
      <div className="absolute -bottom-60 left-1/2 size-152 -translate-x-1/2 rounded-full bg-chart-3/12 blur-[135px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_18px,rgba(15,23,42,0.06)_18px)] bg-size-[30px_30px] opacity-20 dark:opacity-15" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/70" />
    </div>
  );
}
