import { Globe2, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function SiteFooter() {
  return (
    <footer className="border-t bg-card px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <motion.div
        className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.div className="md:col-span-2" variants={containerVariants}>
          <motion.p
            className="font-heading text-[1.7rem] leading-none font-semibold text-primary sm:text-3xl"
            variants={itemVariants}
          >
            Insight<span className="text-chart-1">Forge AI</span>
          </motion.p>
          <motion.p
            className="mt-4 max-w-md text-sm leading-6 text-muted-foreground"
            variants={itemVariants}
          >
            Pioneering the future of agentic data intelligence. Rooted in
            wisdom, driven by autonomous excellence.
          </motion.p>
          <motion.div
            className="mt-5 flex items-center gap-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: -8 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="icon-sm" aria-label="Share">
                <Share2 />
              </Button>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Public profile"
              >
                <Globe2 />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div variants={containerVariants}>
          <motion.p
            className="font-heading text-lg font-medium"
            variants={itemVariants}
          >
            Agents
          </motion.p>
          <motion.ul
            className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: "Guardian", href: "#" },
              { label: "Architect", href: "#" },
              { label: "Executor", href: "#" },
            ].map((item) => (
              <motion.li key={item.label} variants={itemVariants}>
                <motion.a
                  href={item.href}
                  className="inline-block transition-colors hover:text-foreground"
                  whileHover={{ x: 2 }}
                >
                  {item.label}
                </motion.a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div variants={containerVariants}>
          <motion.p
            className="font-heading text-lg font-medium"
            variants={itemVariants}
          >
            Company
          </motion.p>
          <motion.ul
            className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: "Ethics", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Privacy", href: "#" },
            ].map((item) => (
              <motion.li key={item.label} variants={itemVariants}>
                <motion.a
                  href={item.href}
                  className="inline-block transition-colors hover:text-foreground"
                  whileHover={{ x: 2 }}
                >
                  {item.label}
                </motion.a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Separator className="mx-auto mt-10 w-full max-w-7xl" />
      </motion.div>
      <motion.div
        className="mx-auto mt-6 flex w-full max-w-7xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <p>
          InsightForce <span className="text-chart-1">AI</span>
        </p>
        <p>© 2024 InsightForce AI. Rooted in Intelligence.</p>
      </motion.div>
    </footer>
  );
}
