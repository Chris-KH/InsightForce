import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "../data";
import { NavLink } from "react-router";
import { motion } from "motion/react";

const navVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.4 + i * 0.1, duration: 0.5 },
  }),
  hover: { scale: 1.05, y: -1 },
};

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <motion.div
        className="mx-auto flex h-17 w-full max-w-7xl items-center justify-between px-4 sm:h-18.5 sm:px-6"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <NavLink to={"/"}>
            <p className="font-heading text-[1.65rem] leading-none font-semibold tracking-tight text-primary sm:text-[1.8rem]">
              Insight<span className="text-chart-1">Forge AI</span>
            </p>
          </NavLink>
        </motion.div>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.s}
              custom={index}
              variants={navVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                "pb-1 text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground",
                index === 0 && "border-b-2 border-primary text-primary",
              )}
              whileHover={{
                y: -2,
                textShadow: "0px 0px 8px rgba(var(--color-primary), 0.3)",
              }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink to={"/register"}>
            <motion.div
              custom={0}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
            >
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </motion.div>
          </NavLink>
          <NavLink to={"/login"}>
            <motion.div
              custom={1}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
            >
              <Button className="h-10 bg-primary px-5 hover:bg-primary/90 sm:h-11 sm:px-6">
                Deploy Your AI
              </Button>
            </motion.div>
          </NavLink>
        </div>
      </motion.div>
    </header>
  );
}
