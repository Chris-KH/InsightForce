import { NavLink } from "react-router";

type RegisterProcessStep = "account" | "verification" | "profile";

const STEP_ITEMS: Array<{ key: RegisterProcessStep; label: string }> = [
  { key: "account", label: "Account" },
  { key: "verification", label: "Verification" },
  { key: "profile", label: "Profile" },
];

export function RegisterTopBar({
  activeStep,
}: {
  activeStep: RegisterProcessStep;
}) {
  const activeStepIndex = STEP_ITEMS.findIndex(
    (step) => step.key === activeStep,
  );

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <NavLink to={"/"}>
          <p className="font-heading text-3xl leading-none font-semibold tracking-tight text-primary">
            Insight<span className="text-chart-1">Force AI</span>
          </p>
        </NavLink>

        <nav className="hidden items-center gap-3 md:flex">
          {STEP_ITEMS.map((step, index) => {
            const isCompleted = index < activeStepIndex;
            const isActive = index === activeStepIndex;

            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      isActive || isCompleted
                        ? "size-2.5 rounded-full bg-primary"
                        : "size-2.5 rounded-full bg-muted"
                    }
                  />
                  <span
                    className={
                      isActive
                        ? "text-xs font-semibold tracking-widest text-primary uppercase"
                        : "text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                    }
                  >
                    {step.label}
                  </span>
                </div>

                {index < STEP_ITEMS.length - 1 ? (
                  <span className="h-px w-12 bg-border" />
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
