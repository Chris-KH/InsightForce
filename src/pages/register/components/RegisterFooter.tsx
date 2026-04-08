import { Link } from "react-router";
import { motion } from "motion/react";

export function RegisterFooter() {
  return (
    <footer className="border-t border-border/50 px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 md:flex-row"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          &copy; 2024 InsightForge <span className="text-chart-1">AI</span>.
          Rooted in creativity.
        </motion.p>

        <motion.div
          className="flex items-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <motion.div whileHover={{ color: "var(--color-primary)", y: -1 }}>
            <Link to="#" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </motion.div>
          <motion.div whileHover={{ color: "var(--color-primary)", y: -1 }}>
            <Link to="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
          </motion.div>
          <motion.div whileHover={{ color: "var(--color-primary)", y: -1 }}>
            <Link to="#" className="transition-colors hover:text-primary">
              Help Center
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
