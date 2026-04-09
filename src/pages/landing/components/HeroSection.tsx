import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  HERO_IMPACT_STATS,
  HERO_ROTATING_WORDS,
  TRUSTED_AVATARS,
} from "../data";
import { AsciiSphereCanvas } from "./AsciiSphereCanvas";
import { SectionGridOverlay } from "./SectionGridOverlay";
import { motion } from "motion/react";
import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import HERO_IMAGE from "@/assets/hero-section.png";
import { useBilingual } from "@/hooks/use-bilingual";

export function HeroSection() {
  const copy = useBilingual();
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const translateWord = (word: string) => {
    if (word === "launch") {
      return copy("launch", "khởi chạy");
    }

    if (word === "orchestrate") {
      return copy("orchestrate", "điều phối");
    }

    if (word === "scale") {
      return copy("scale", "mở rộng");
    }

    if (word === "monetize") {
      return copy("monetize", "kiếm tiền");
    }

    return word;
  };

  const translateImpactLabel = (label: string) => {
    if (label === "saved weekly") {
      return copy("saved weekly", "tiết kiệm mỗi tuần");
    }

    if (label === "qualified leads") {
      return copy("qualified leads", "khách hàng tiềm năng đủ chuẩn");
    }

    if (label === "campaign ROAS") {
      return copy("campaign ROAS", "ROAS chiến dịch");
    }

    if (label === "retention growth") {
      return copy("retention growth", "tăng tỷ lệ giữ chân");
    }

    return label;
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveWordIndex(
        (current) => (current + 1) % HERO_ROTATING_WORDS.length,
      );
    }, 2100);

    return () => window.clearInterval(intervalId);
  }, []);

  const activeWord = translateWord(HERO_ROTATING_WORDS[activeWordIndex]);

  return (
    <section className="relative isolate overflow-hidden px-4 pt-30 pb-16 sm:px-6 sm:pt-34 sm:pb-20 lg:px-8 lg:pt-36 lg:pb-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <SectionGridOverlay
          className="absolute inset-x-0 top-0 h-3/4"
          cellSize={96}
          strength="medium"
          fade="left-to-right"
        />
        <motion.div
          className="absolute -top-30 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-primary/18 blur-[130px]"
          animate={{ opacity: [0.3, 0.58, 0.3], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 -bottom-26 h-104 w-104 rounded-full bg-chart-1/14 blur-[120px]"
          animate={{ opacity: [0.22, 0.4, 0.22], scale: [1, 1.12, 1] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
        />

        <motion.div
          className="absolute top-2/5 -right-8 hidden size-120 -translate-y-1/2 lg:block"
          animate={{ opacity: [0.28, 0.54, 0.28], rotate: [0, 6, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        >
          <AsciiSphereCanvas />
        </motion.div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
        <div className="space-y-8">
          <motion.p
            className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {copy(
              "AI Operating System For Creator Teams",
              "Hệ điều hành AI cho đội ngũ creator",
            )}
          </motion.p>

          <motion.h1
            className="font-heading text-[2.45rem] leading-[0.96] font-semibold tracking-tight sm:text-[3.3rem] lg:text-[4.6rem]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            {copy("Plan,", "Lên kế hoạch,")}
            <motion.span
              key={activeWord}
              className="mx-2 inline-block text-primary"
              initial={{ opacity: 0, y: 16, rotateX: 18 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.45 }}
            >
              {activeWord}
            </motion.span>
            {copy(
              "and scale every creator campaign with autonomous precision.",
              "và mở rộng mọi chiến dịch creator với độ chính xác vượt trội.",
            )}
          </motion.h1>

          <motion.p
            className="max-w-[60ch] text-[15px] leading-7 text-muted-foreground sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
          >
            {copy(
              "InsightForce synchronizes your audience signals, creator workflows, and campaign execution into one intelligence layer so you can move faster without sacrificing brand trust.",
              "InsightForce đồng bộ tín hiệu từ khách hàng mục tiêu, quy trình creator và thực thi chiến dịch vào một lớp trí tuệ thống nhất, giúp bạn tăng tốc mà vẫn giữ vững niềm tin thương hiệu.",
            )}
          </motion.p>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
          >
            <NavLink to="/register">
              <Button className="h-12 rounded-full px-7 text-[15px] font-semibold">
                {copy("Start creating", "Bắt đầu tạo")}
                <ArrowRight className="size-4" />
              </Button>
            </NavLink>
            <a href="#workflow">
              <Button
                variant="outline"
                className="h-12 rounded-full px-7 text-[15px] font-semibold"
              >
                {copy("See workflow", "Xem quy trình")}
              </Button>
            </a>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.6 }}
          >
            <div className="flex">
              {TRUSTED_AVATARS.map((avatar, index) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt={copy("Creator", "Nhà sáng tạo")}
                  className={cn(
                    "size-10 rounded-full border-2 border-background object-cover",
                    index !== 0 && "-ml-2",
                  )}
                  loading="lazy"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {copy(
                "Trusted by 2,000+ creators, agencies, and KOL teams.",
                "Được tin dùng bởi hơn 2.000 creator, agency và đội ngũ KOL.",
              )}
            </p>
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.14 }}
        >
          <Card className="overflow-hidden border-border/65 bg-card/68 p-0 shadow-2xl backdrop-blur-sm">
            <img
              src={HERO_IMAGE}
              alt={copy(
                "Creator intelligence dashboard",
                "Bảng điều khiển thông minh cho creator",
              )}
              className="h-108 w-full object-cover sm:h-128"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/84 via-background/10 to-transparent" />

            <div className="absolute right-4 bottom-4 left-4 grid gap-3 sm:grid-cols-2">
              {HERO_IMPACT_STATS.map((item, index) => (
                <motion.div
                  key={item.brand}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 + index * 0.08, duration: 0.45 }}
                >
                  <Card className="border-border/70 bg-background/78 shadow-sm backdrop-blur-md">
                    <CardContent className="px-4">
                      <p className="font-heading text-[1.55rem] leading-none font-semibold text-foreground">
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs tracking-widest text-muted-foreground uppercase">
                        {translateImpactLabel(item.label)}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold text-primary">
                        {item.brand}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
