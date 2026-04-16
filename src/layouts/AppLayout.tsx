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

        <main className="px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
          <div className="mx-auto w-full max-w-screen-2xl">
            <Outlet />
          </div>
        </main>

        <AppFooter />
      </div>
    </div>
  );
}
