import { Outlet } from "react-router";

import { AppBackdrop } from "@/layouts/components/AppBackdrop";
import { AppFooter } from "@/layouts/components/AppFooter";
import { AppHeader } from "@/layouts/components/AppHeader";
import { AppSidebar } from "@/layouts/components/AppSidebar";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen text-foreground">
      <AppBackdrop />

      <AppSidebar />

      <div className="relative min-h-screen md:pl-72">
        <AppHeader />

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
