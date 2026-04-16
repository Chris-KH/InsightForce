import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/layouts/RootLayout";

const routeHydrateFallbackElement = (
  <div className="flex min-h-[42vh] items-center justify-center px-6 py-10">
    <div className="rounded-full border border-border/70 bg-card/75 px-4 py-2 text-xs font-medium text-muted-foreground">
      Loading workspace...
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    hydrateFallbackElement: routeHydrateFallbackElement,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("@/pages/landing/LandingPage")).LandingPage,
        }),
      },
    ],
  },
  {
    hydrateFallbackElement: routeHydrateFallbackElement,
    lazy: async () => ({
      Component: (await import("@/layouts/AuthLayout")).AuthLayout,
    }),
    children: [
      {
        path: "/login",
        lazy: async () => ({
          Component: (await import("@/pages/login/LoginPage")).LoginPage,
        }),
      },
      {
        path: "/register",
        lazy: async () => ({
          Component: (await import("@/pages/register/RegisterPage"))
            .RegisterPage,
        }),
      },
      {
        path: "/register/verify",
        lazy: async () => ({
          Component: (await import("@/pages/register/VerifyEmailPage"))
            .VerifyEmailPage,
        }),
      },
      {
        path: "/register/success",
        lazy: async () => ({
          Component: (await import("@/pages/register/RegisterSuccessPage"))
            .RegisterSuccessPage,
        }),
      },
    ],
  },
  {
    path: "/app",
    hydrateFallbackElement: routeHydrateFallbackElement,
    lazy: async () => ({
      Component: (await import("@/components/ProtectedRoute")).ProtectedRoute,
    }),
    children: [
      {
        lazy: async () => ({
          Component: (await import("@/layouts/AppLayout")).default,
        }),
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import("@/pages/dashboard/DashboardPage"))
                .DashboardPage,
            }),
          },
          {
            path: "dashboard",
            lazy: async () => ({
              Component: (await import("@/pages/dashboard/DashboardPage"))
                .DashboardPage,
            }),
          },
          {
            path: "audience",
            lazy: async () => ({
              Component: (await import("@/pages/audience/AudiencePage"))
                .AudiencePage,
            }),
          },
          {
            path: "strategy",
            lazy: async () => ({
              Component: (await import("@/pages/strategy/StrategyPage"))
                .StrategyPage,
            }),
          },
          {
            path: "finance",
            lazy: async () => ({
              Component: (await import("@/pages/finance/FinancePage"))
                .FinancePage,
            }),
          },
          {
            path: "automation",
            lazy: async () => ({
              Component: (await import("@/pages/automation/AutomationPage"))
                .AutomationPage,
            }),
          },
        ],
      },
    ],
  },
]);
