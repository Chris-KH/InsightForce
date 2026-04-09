import { Link } from "react-router";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";

export function RegisterFooter() {
  const copy = useBilingual();

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
          &copy; 2024 InsightForge <span className="text-chart-1">AI</span>.{" "}
          {copy("Rooted in creativity.", "Bắt nguồn từ sáng tạo.")}
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
              {copy("Terms of Service", "Điều khoản dịch vụ")}
            </Link>
          </motion.div>
          <motion.div whileHover={{ color: "var(--color-primary)", y: -1 }}>
            <Link to="#" className="transition-colors hover:text-primary">
              {copy("Privacy Policy", "Chính sách riêng tư")}
            </Link>
          </motion.div>
          <motion.div whileHover={{ color: "var(--color-primary)", y: -1 }}>
            <Link to="#" className="transition-colors hover:text-primary">
              {copy("Help Center", "Trung tâm trợ giúp")}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
