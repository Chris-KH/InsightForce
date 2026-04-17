import { Outlet } from "react-router";

import { AppBackdrop } from "@/layouts/components/AppBackdrop";
import { AppActivityToaster } from "@/layouts/components/AppActivityToaster";
import { AppFooter } from "@/layouts/components/AppFooter";
import { AppHeader } from "@/layouts/components/AppHeader";
import { AppRuntimeActivityBridge } from "@/layouts/components/AppRuntimeActivityBridge";
import { AppSidebar } from "@/layouts/components/AppSidebar";
import { AppTaskAutoResume } from "@/layouts/components/AppTaskAutoResume";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen text-foreground">
      <AppBackdrop />

      <AppSidebar />

      <div className="relative min-h-screen md:pl-72">
        <AppHeader />
        <AppTaskAutoResume />
        <AppRuntimeActivityBridge />
        <AppActivityToaster />

        <main className="px-3 py-4 sm:px-5 lg:px-6 xl:px-8">
          <div className="mx-auto w-full max-w-440">
            <Outlet />
          </div>
        </main>

        <AppFooter />
      </div>
    </div>
  );
}
