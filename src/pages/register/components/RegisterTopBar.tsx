import { NavLink } from "react-router";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";

type RegisterProcessStep = "account" | "verification" | "profile";

export function RegisterTopBar({
  activeStep,
}: {
  activeStep: RegisterProcessStep;
}) {
  const copy = useBilingual();

  const stepItems: Array<{ key: RegisterProcessStep; label: string }> = [
    { key: "account", label: copy("Account", "Tài khoản") },
    { key: "verification", label: copy("Verification", "Xác minh") },
    { key: "profile", label: copy("Profile", "Hồ sơ") },
  ];

  const activeStepIndex = stepItems.findIndex(
    (step) => step.key === activeStep,
  );

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ y: -1 }}
        >
          <NavLink to={"/"}>
            <p className="font-heading text-3xl leading-none font-semibold tracking-tight text-primary">
              Insight<span className="text-chart-1">Force AI</span>
            </p>
          </NavLink>
        </motion.div>

        <nav className="hidden items-center gap-3 md:flex">
          {stepItems.map((step, index) => {
            const isCompleted = index < activeStepIndex;
            const isActive = index === activeStepIndex;

            return (
              <motion.div
                key={step.key}
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    className={
                      isActive || isCompleted
                        ? "size-2.5 rounded-full bg-primary"
                        : "size-2.5 rounded-full bg-muted"
                    }
                    animate={
                      isActive
                        ? {
                            scale: [1, 1.25, 1],
                            opacity: [0.7, 1, 0.7],
                          }
                        : {}
                    }
                    transition={{ duration: 1.8, repeat: Infinity }}
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

                {index < stepItems.length - 1 ? (
                  <motion.span
                    className="h-px w-12 bg-border"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 48 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  />
                ) : null}
              </motion.div>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
