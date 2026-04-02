export function SentimentDonut() {
  return (
    <div className="flex items-center gap-8">
      <div className="relative flex size-40 items-center justify-center rounded-full bg-[conic-gradient(from_0deg,#4a7c59_0_65%,#d1b06b_65_85%,#b83d3d_85_100%)]">
        <div className="flex size-28 items-center justify-center rounded-full bg-card shadow-sm">
          <div className="text-center">
            <p className="font-heading text-3xl font-semibold text-foreground">
              65%
            </p>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Positive
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-primary" />
          Positive <span className="ml-auto text-foreground">4,120</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-amber-500" />
          Neutral <span className="ml-auto text-foreground">1,204</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-red-500" />
          Negative <span className="ml-auto text-foreground">943</span>
        </div>
      </div>
    </div>
  );
}
