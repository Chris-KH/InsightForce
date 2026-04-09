import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CAPABILITY_ITEMS, TRUSTED_COMPANIES } from "../data";
import { CometTrails } from "./CometTrails";
import { FloatingShards } from "./FloatingShards";
import { OrbitRings } from "./OrbitRings";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { motion } from "motion/react";
import { useBilingual } from "@/hooks/use-bilingual";

export function CreatorMomentumSection() {
  const copy = useBilingual();

  const translateCapabilityTitle = (title: string) => {
    if (title === "Audience Signal Graph") {
      return copy("Audience Signal Graph", "Đồ thị tín hiệu khán giả");
    }

    if (title === "Narrative Blueprinting") {
      return copy("Narrative Blueprinting", "Thiết kế bản đồ tường thuật");
    }

    if (title === "KOL Match Intelligence") {
      return copy("KOL Match Intelligence", "Trí tuệ ghép nối KOL");
    }

    if (title === "Brand Safety Guardian") {
      return copy("Brand Safety Guardian", "Bảo hộ an toàn thương hiệu");
    }

    return title;
  };

  const translateCapabilityDescription = (description: string) => {
    if (
      description ===
      "Cluster creator comments, search intent, and purchase language into clear opportunity maps before you publish."
    ) {
      return copy(
        "Cluster creator comments, search intent, and purchase language into clear opportunity maps before you publish.",
        "Phân cụm bình luận creator, ý định tìm kiếm và ngôn ngữ mua hàng thành bản đồ cơ hội rõ ràng trước khi xuất bản.",
      );
    }

    if (
      description ===
      "Generate platform-specific content arcs with hook variants, emotional cues, and CTA sequencing tuned for each audience segment."
    ) {
      return copy(
        "Generate platform-specific content arcs with hook variants, emotional cues, and CTA sequencing tuned for each audience segment.",
        "Tạo mạch nội dung theo từng nền tảng với biến thể hook, tín hiệu cảm xúc và chuỗi CTA được tinh chỉnh cho từng phân khúc khán giả.",
      );
    }

    if (
      description ===
      "Prioritize partner creators using trust overlap, category authority, and conversion-fit scoring across regions."
    ) {
      return copy(
        "Prioritize partner creators using trust overlap, category authority, and conversion-fit scoring across regions.",
        "Ưu tiên creator đối tác bằng mức giao thoa niềm tin, độ uy tín theo ngành hàng và điểm phù hợp chuyển đổi theo từng khu vực.",
      );
    }

    if (
      description ===
      "Detect tonal drift and cultural risk in real time, with guardrails that keep every campaign aligned with brand values."
    ) {
      return copy(
        "Detect tonal drift and cultural risk in real time, with guardrails that keep every campaign aligned with brand values.",
        "Phát hiện lệch tông và rủi ro văn hóa theo thời gian thực, cùng guardrail giúp mọi chiến dịch luôn bám sát giá trị thương hiệu.",
      );
    }

    return description;
  };

  return (
    <section
      id="capabilities"
      className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <SectionGridOverlay
          className="absolute inset-x-0 top-0 h-[74%]"
          cellSize={112}
          strength="soft"
          fade="diagonal"
        />

        <CometTrails
          className="absolute inset-0 opacity-90"
          density="medium"
          direction="diagonal"
          tone="mixed"
        />

        <FloatingShards
          className="absolute inset-0"
          density="high"
          tone="mixed"
        />

        <OrbitRings
          className="absolute top-2 right-[8%] hidden h-72 w-72 lg:block"
          tone="mixed"
          spin="slow"
        />

        <motion.div
          className="absolute top-10 -left-20 h-72 w-72 rounded-full bg-primary/12 blur-[110px]"
          animate={{ opacity: [0.24, 0.42, 0.24], scale: [1, 1.06, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-12 bottom-8 h-64 w-64 rounded-full bg-chart-1/10 blur-[100px]"
          animate={{ opacity: [0.2, 0.34, 0.2], scale: [1, 1.12, 1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11px] tracking-[0.13em] uppercase">
            {copy("Core Capabilities", "Năng lực cốt lõi")}
          </Badge>
          <h2 className="mt-4 font-heading text-[2.05rem] leading-tight font-semibold tracking-tight sm:text-[2.85rem]">
            {copy(
              "The command layer behind high-converting creator campaigns",
              "Lớp điều phối đứng sau các chiến dịch creator chuyển đổi cao",
            )}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            {copy(
              "Replace disconnected tools with one intelligence stack that maps audience demand, designs narratives, matches KOL partners, and protects every message before launch.",
              "Thay thế các công cụ rời rạc bằng một stack trí tuệ thống nhất để lập bản đồ nhu cầu khán giả, thiết kế câu chuyện, ghép KOL phù hợp và bảo vệ mọi thông điệp trước khi ra mắt.",
            )}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-12">
          {CAPABILITY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-border/65 bg-card/65 shadow-sm backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-start justify-between gap-5 pb-3">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
                        {item.number}
                      </p>
                      <h3 className="mt-2 font-heading text-2xl leading-tight font-semibold tracking-tight">
                        {translateCapabilityTitle(item.title)}
                      </h3>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-background/80 p-3 text-primary">
                      <Icon className="size-5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {translateCapabilityDescription(item.description)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-10 overflow-hidden rounded-2xl border border-border/65 bg-card/55 backdrop-blur-sm lg:mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
        >
          <motion.div
            className="flex w-max items-center gap-8 px-5 py-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          >
            {[...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES].map(
              (company, index) => (
                <span
                  key={`${company}-${index}`}
                  className="text-sm font-medium tracking-wide text-muted-foreground"
                >
                  {company}
                </span>
              ),
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
