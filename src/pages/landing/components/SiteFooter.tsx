import { Globe2, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-heading text-[1.7rem] leading-none font-semibold text-primary sm:text-3xl">
            InsightForge AI
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Pioneering the future of organic data intelligence, built for teams
            that value depth over volume.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Button variant="outline" size="icon-sm" aria-label="Share">
              <Share2 />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Public profile"
            >
              <Globe2 />
            </Button>
          </div>
        </div>

        <div>
          <p className="font-heading text-lg font-medium">Product</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <a href="#">Analytics</a>
            </li>
            <li>
              <a href="#">Sentiment</a>
            </li>
            <li>
              <a href="#">Security</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-heading text-lg font-medium">Company</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Privacy</a>
            </li>
          </ul>
        </div>
      </div>

      <Separator className="mx-auto mt-10 w-full max-w-7xl" />
      <div className="mx-auto mt-6 flex w-full max-w-7xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>InsightForge AI</p>
        <p>© 2024 InsightForge AI. Rooted in Intelligence.</p>
      </div>
    </footer>
  );
}
