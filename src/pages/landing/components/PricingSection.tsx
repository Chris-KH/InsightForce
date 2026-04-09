import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PRICING_TIERS, TESTIMONIALS } from "../data";
import { CometTrails } from "./CometTrails";
import { FloatingShards } from "./FloatingShards";
import { OrbitRings } from "./OrbitRings";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useBilingual } from "@/hooks/use-bilingual";

export function PricingSection() {
  const copy = useBilingual();
  const [annualBilling, setAnnualBilling] = useState(true);

  const translateTierName = (name: string) => {
    if (name === "Creator") {
      return copy("Creator", "Creator");
    }

    if (name === "Agency") {
      return copy("Agency", "Agency");
    }

    if (name === "Enterprise") {
      return copy("Enterprise", "Doanh nghiệp");
    }

    return name;
  };

  const translateTierDescription = (description: string) => {
    if (
      description ===
      "For solo creators and small studios validating audience fit."
    ) {
      return copy(
        "For solo creators and small studios validating audience fit.",
        "Dành cho creator cá nhân và studio nhỏ đang kiểm chứng độ phù hợp với khán giả.",
      );
    }

    if (
      description ===
      "For growing teams scaling multi-channel creator campaigns."
    ) {
      return copy(
        "For growing teams scaling multi-channel creator campaigns.",
        "Dành cho đội ngũ đang tăng trưởng và mở rộng chiến dịch creator đa kênh.",
      );
    }

    if (
      description ===
      "For global brands and media groups with custom deployment needs."
    ) {
      return copy(
        "For global brands and media groups with custom deployment needs.",
        "Dành cho thương hiệu toàn cầu và tập đoàn truyền thông cần triển khai tùy chỉnh.",
      );
    }

    return description;
  };

  const translateTierFeature = (feature: string) => {
    if (feature === "1 agent workflow") {
      return copy("1 agent workflow", "1 quy trình tác vụ viên");
    }

    if (feature === "Daily signal digest") {
      return copy("Daily signal digest", "Tổng hợp tín hiệu hằng ngày");
    }

    if (feature === "Core channel integrations") {
      return copy("Core channel integrations", "Tích hợp kênh cốt lõi");
    }

    if (feature === "Baseline safety checks") {
      return copy("Baseline safety checks", "Kiểm tra an toàn nền tảng");
    }

    if (feature === "Full agent triad") {
      return copy("Full agent triad", "Bộ ba tác vụ viên đầy đủ");
    }

    if (feature === "Live campaign intelligence") {
      return copy("Live campaign intelligence", "Trí tuệ chiến dịch trực tiếp");
    }

    if (feature === "Advanced KOL match scoring") {
      return copy("Advanced KOL match scoring", "Chấm điểm ghép KOL nâng cao");
    }

    if (feature === "Priority execution queue") {
      return copy("Priority execution queue", "Hàng đợi thực thi ưu tiên");
    }

    if (feature === "Team collaboration") {
      return copy("Team collaboration", "Cộng tác đội ngũ");
    }

    if (feature === "Everything in Agency") {
      return copy("Everything in Agency", "Toàn bộ tính năng gói Agency");
    }

    if (feature === "Private infrastructure") {
      return copy("Private infrastructure", "Hạ tầng riêng tư");
    }

    if (feature === "Custom compliance controls") {
      return copy("Custom compliance controls", "Kiểm soát tuân thủ tùy chỉnh");
    }

    if (feature === "24/7 strategic support") {
      return copy("24/7 strategic support", "Hỗ trợ chiến lược 24/7");
    }

    if (feature === "SLA-backed deployment") {
      return copy("SLA-backed deployment", "Triển khai cam kết SLA");
    }

    return feature;
  };

  const translateTierCta = (cta: string) => {
    if (cta === "Start free trial") {
      return copy("Start free trial", "Bắt đầu dùng thử miễn phí");
    }

    if (cta === "Go agency mode") {
      return copy("Go agency mode", "Kích hoạt chế độ agency");
    }

    if (cta === "Talk to sales") {
      return copy("Talk to sales", "Liên hệ đội kinh doanh");
    }

    return cta;
  };

  const translateRole = (role: string) => {
    if (role === "CMO") {
      return copy("CMO", "Giám đốc Marketing");
    }

    if (role === "Head of Growth") {
      return copy("Head of Growth", "Trưởng bộ phận tăng trưởng");
    }

    if (role === "Creative Director") {
      return copy("Creative Director", "Giám đốc sáng tạo");
    }

    if (role === "VP Marketing") {
      return copy("VP Marketing", "Phó chủ tịch Marketing");
    }

    return role;
  };

  const translateQuote = (quote: string) => {
    if (
      quote ===
      "InsightForce changed our launch process from guesswork to an operating system. Every creator drop now starts with clear confidence."
    ) {
      return copy(
        "InsightForce changed our launch process from guesswork to an operating system. Every creator drop now starts with clear confidence.",
        "InsightForce đã biến quy trình ra mắt của chúng tôi từ phỏng đoán thành một hệ điều hành. Mỗi đợt creator drop giờ đều bắt đầu với sự tự tin rõ ràng.",
      );
    }

    if (
      quote ===
      "The Guardian alerts and Architect briefs helped us scale creator output without losing brand coherence."
    ) {
      return copy(
        "The Guardian alerts and Architect briefs helped us scale creator output without losing brand coherence.",
        "Cảnh báo từ Guardian và brief từ Architect giúp chúng tôi mở rộng sản lượng creator mà không làm mất tính nhất quán thương hiệu.",
      );
    }

    if (
      quote ===
      "Our team ships faster because we can evaluate forecasted impact before spending media budget."
    ) {
      return copy(
        "Our team ships faster because we can evaluate forecasted impact before spending media budget.",
        "Đội ngũ của chúng tôi triển khai nhanh hơn vì có thể đánh giá tác động dự báo trước khi chi ngân sách truyền thông.",
      );
    }

    if (
      quote ===
      "From market signal to activation, everything is now one connected workflow. That has changed our decision speed dramatically."
    ) {
      return copy(
        "From market signal to activation, everything is now one connected workflow. That has changed our decision speed dramatically.",
        "Từ tín hiệu thị trường đến kích hoạt, mọi thứ giờ là một quy trình kết nối duy nhất. Điều đó đã thay đổi mạnh tốc độ ra quyết định của chúng tôi.",
      );
    }

    return quote;
  };

  const translateKeyResult = (keyResult: string) => {
    if (keyResult === "8.4x campaign ROAS") {
      return copy("8.4x campaign ROAS", "ROAS chiến dịch 8.4x");
    }

    if (keyResult === "41% retention lift") {
      return copy("41% retention lift", "Tăng 41% giữ chân");
    }

    if (keyResult === "3.2x faster campaign launch") {
      return copy(
        "3.2x faster campaign launch",
        "Ra mắt chiến dịch nhanh hơn 3.2x",
      );
    }

    if (keyResult === "27 hours saved weekly") {
      return copy("27 hours saved weekly", "Tiết kiệm 27 giờ mỗi tuần");
    }

    return keyResult;
  };

  const priceRows = useMemo(
    () =>
      PRICING_TIERS.map((tier) => {
        if (tier.monthly === null) {
          return {
            name: tier.name,
            displayPrice: copy("Custom", "Tùy chỉnh"),
            period: "",
            savingsText: "",
          };
        }

        const selected =
          annualBilling && tier.annual !== null ? tier.annual : tier.monthly;
        const savings =
          annualBilling && tier.annual !== null
            ? Math.round(((tier.monthly - tier.annual) / tier.monthly) * 100)
            : 0;

        return {
          name: tier.name,
          displayPrice: `$${selected}`,
          period: "/mo",
          savingsText:
            savings > 0
              ? copy(
                  `Save ${savings}% with annual`,
                  `Tiết kiệm ${savings}% với gói năm`,
                )
              : "",
        };
      }),
    [annualBilling, copy],
  );

  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden bg-background/72 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <SectionGridOverlay
          className="absolute inset-x-0 top-0 h-80"
          cellSize={124}
          strength="soft"
          fade="top-to-bottom"
          drift={false}
        />

        <CometTrails
          className="absolute inset-0 opacity-75"
          density="medium"
          direction="right-to-left"
          tone="mixed"
        />

        <FloatingShards
          className="absolute inset-0"
          density="medium"
          tone="primary"
        />

        <OrbitRings
          className="absolute top-12 right-[8%] hidden h-64 w-64 opacity-75 lg:block"
          tone="primary"
          spin="medium"
        />

        <motion.div
          className="absolute -top-14 left-[8%] h-64 w-64 rounded-full bg-primary/10 blur-[120px]"
          animate={{ opacity: [0.14, 0.3, 0.14], scale: [1, 1.08, 1] }}
          transition={{ duration: 9.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11px] tracking-[0.13em] uppercase">
            {copy("Pricing", "Bảng giá")}
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.8rem]">
            {copy(
              "Pick the plan that fits your creator growth stage",
              "Chọn gói phù hợp với giai đoạn tăng trưởng creator",
            )}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            {copy(
              "Start with a focused setup and expand into multi-market orchestration as your campaigns scale.",
              "Bắt đầu với thiết lập tinh gọn và mở rộng điều phối đa thị trường khi chiến dịch tăng trưởng.",
            )}
          </p>

          <div className="mt-6 inline-flex rounded-full border border-border/70 bg-card/65 p-1">
            <button
              type="button"
              onClick={() => setAnnualBilling(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                !annualBilling
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              {copy("Monthly", "Theo tháng")}
            </button>
            <button
              type="button"
              onClick={() => setAnnualBilling(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                annualBilling
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              {copy("Annual", "Theo năm")}
            </button>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-3">
          {PRICING_TIERS.map((tier, index) => {
            const priceMeta = priceRows[index];

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: tier.highlighted ? 0 : -5 }}
              >
                <Card
                  className={cn(
                    "relative h-full overflow-visible border-border/70 bg-card/70",
                    tier.highlighted &&
                      "scale-[1.01] border-primary shadow-2xl",
                  )}
                >
                  {tier.highlighted && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-primary-foreground uppercase">
                      {copy("Most Popular", "Phổ biến nhất")}
                    </span>
                  )}

                  <CardHeader>
                    <p className="text-xs font-semibold tracking-[0.13em] text-primary uppercase">
                      {translateTierName(tier.name)}
                    </p>
                    <CardTitle className="font-heading text-4xl leading-none sm:text-5xl">
                      {priceMeta.displayPrice}
                      <span className="ml-1 text-base font-medium text-muted-foreground">
                        {priceMeta.period
                          ? copy(priceMeta.period, "/tháng")
                          : ""}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-sm leading-6">
                      {translateTierDescription(tier.description)}
                    </CardDescription>
                    {priceMeta.savingsText && (
                      <p className="text-xs font-semibold tracking-[0.11em] text-primary uppercase">
                        {priceMeta.savingsText}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm leading-6"
                        >
                          <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                          {translateTierFeature(feature)}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      variant={tier.highlighted ? "default" : "outline"}
                      className="h-11 w-full"
                    >
                      {translateTierCta(tier.cta)}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <Card className="h-full border-border/65 bg-card/68">
                <CardContent className="space-y-3 px-4 py-4">
                  <p className="text-sm leading-6 text-foreground/90">
                    "{translateQuote(testimonial.quote)}"
                  </p>
                  <div>
                    <p className="text-sm font-semibold">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {translateRole(testimonial.role)} · {testimonial.company}
                    </p>
                  </div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                    {translateKeyResult(testimonial.keyResult)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
