import { Outlet } from "react-router";

import { AppFooter } from "@/layouts/components/AppFooter";
import { AppHeader } from "@/layouts/components/AppHeader";
import { AppSidebar } from "@/layouts/components/AppSidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />

      <div className="min-h-screen md:pl-60">
        <AppHeader />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        <AppFooter />
      </div>
    </div>
  );
}
