import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FOOTER_LINK_GROUPS, SOCIAL_LINKS, TRUSTED_COMPANIES } from "../data";
import { CometTrails } from "./CometTrails";
import { FloatingShards } from "./FloatingShards";
import { OrbitRings } from "./OrbitRings";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { NavLink } from "react-router";
import { useBilingual } from "@/hooks/use-bilingual";

export function SiteFooter() {
  const copy = useBilingual();

  const translateFooterGroup = (group: string) => {
    if (group === "Product") {
      return copy("Product", "Sản phẩm");
    }

    if (group === "Developers") {
      return copy("Developers", "Nhà phát triển");
    }

    if (group === "Company") {
      return copy("Company", "Công ty");
    }

    if (group === "Legal") {
      return copy("Legal", "Pháp lý");
    }

    return group;
  };

  const translateFooterLabel = (label: string) => {
    if (label === "Capabilities") {
      return copy("Capabilities", "Năng lực");
    }

    if (label === "Workflow") {
      return copy("Workflow", "Quy trình");
    }

    if (label === "Infrastructure") {
      return copy("Infrastructure", "Hạ tầng");
    }

    if (label === "Pricing") {
      return copy("Pricing", "Bảng giá");
    }

    if (label === "Documentation") {
      return copy("Documentation", "Tài liệu");
    }

    if (label === "API Reference") {
      return copy("API Reference", "Tài liệu API");
    }

    if (label === "Status") {
      return copy("Status", "Trạng thái");
    }

    if (label === "About") {
      return copy("About", "Giới thiệu");
    }

    if (label === "Careers") {
      return copy("Careers", "Tuyển dụng");
    }

    if (label === "Contact") {
      return copy("Contact", "Liên hệ");
    }

    if (label === "Privacy") {
      return copy("Privacy", "Riêng tư");
    }

    if (label === "Terms") {
      return copy("Terms", "Điều khoản");
    }

    if (label === "Security") {
      return copy("Security", "Bảo mật");
    }

    return label;
  };

  const translateSocialLabel = (label: string) => {
    if (label === "Twitter") {
      return copy("Twitter", "Twitter");
    }

    if (label === "GitHub") {
      return copy("GitHub", "GitHub");
    }

    if (label === "LinkedIn") {
      return copy("LinkedIn", "LinkedIn");
    }

    return label;
  };

  return (
    <footer className="relative isolate overflow-hidden border-t border-border/60 bg-card/45 px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <SectionGridOverlay
          className="absolute inset-x-0 top-0 h-64"
          cellSize={130}
          strength="soft"
          fade="left-to-right"
          drift={false}
        />

        <CometTrails
          className="absolute inset-0 opacity-60"
          density="low"
          direction="diagonal"
          tone="mixed"
        />

        <FloatingShards
          className="absolute inset-0"
          density="low"
          tone="mixed"
        />

        <OrbitRings
          className="absolute -bottom-12 left-[8%] hidden h-72 w-72 opacity-60 md:block"
          tone="chart"
          spin="slow"
        />

        <motion.div
          className="absolute top-0 right-[14%] h-52 w-52 rounded-full bg-primary/8 blur-[100px]"
          animate={{ opacity: [0.1, 0.24, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          className="overflow-hidden rounded-2xl border border-border/65 bg-background/80 p-6 sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                {copy("Ready To Launch", "Sẵn sàng ra mắt")}
              </p>
              <h3 className="mt-2 font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                {copy(
                  "Turn audience intelligence into your next growth engine.",
                  "Biến trí tuệ khán giả thành động cơ tăng trưởng tiếp theo.",
                )}
              </h3>
              <p className="mt-3 max-w-[56ch] text-sm leading-6 text-muted-foreground sm:text-base">
                {copy(
                  "Move from scattered decisions to one connected system for creator strategy, content, and campaign execution.",
                  "Chuyển từ quyết định rời rạc sang một hệ thống kết nối cho chiến lược creator, nội dung và thực thi chiến dịch.",
                )}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <NavLink to="/register">
                <Button className="h-11 rounded-full px-6">
                  {copy("Start creating", "Bắt đầu tạo")}
                  <ArrowRight className="size-4" />
                </Button>
              </NavLink>
              <NavLink to="/login">
                <Button variant="outline" className="h-11 rounded-full px-6">
                  {copy("Book demo", "Đặt lịch demo")}
                </Button>
              </NavLink>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TRUSTED_COMPANIES.map((company) => (
            <span
              key={company}
              className="rounded-full border border-border/65 bg-background/72 px-3 py-1 text-xs text-muted-foreground"
            >
              {company}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <p className="font-heading text-[1.75rem] leading-none font-semibold tracking-tight text-primary">
              Insight<span className="text-chart-1">Force AI</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              {copy(
                "Creator intelligence infrastructure for teams that need speed, precision, and brand-safe scale.",
                "Hạ tầng trí tuệ creator cho đội ngũ cần tốc độ, độ chính xác và khả năng mở rộng an toàn thương hiệu.",
              )}
            </p>
            <div className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {translateSocialLabel(social.label)}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINK_GROUPS).map(([group, links]) => (
            <div key={group}>
              <p className="font-heading text-base font-semibold">
                {translateFooterGroup(group)}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {translateFooterLabel(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mt-8" />

        <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {copy(
              "© 2026 InsightForce AI. All rights reserved.",
              "© 2026 InsightForce AI. Đã đăng ký bản quyền.",
            )}
          </p>
          <p>
            {copy(
              "Built for creator operators and KOL growth teams.",
              "Xây dựng cho đội ngũ vận hành creator và nhóm tăng trưởng KOL.",
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
