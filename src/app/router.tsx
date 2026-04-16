import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/layouts/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
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
          {
            path: "ops-control",
            lazy: async () => ({
              Component: (await import("@/pages/focus/OpsControlPage"))
                .OpsControlPage,
            }),
          },
          {
            path: "audience-signals",
            lazy: async () => ({
              Component: (await import("@/pages/focus/AudienceSignalsPage"))
                .AudienceSignalsPage,
            }),
          },
          {
            path: "strategy-lab",
            lazy: async () => ({
              Component: (await import("@/pages/focus/StrategyLabPage"))
                .StrategyLabPage,
            }),
          },
          {
            path: "finance-control",
            lazy: async () => ({
              Component: (await import("@/pages/focus/FinanceControlPage"))
                .FinanceControlPage,
            }),
          },
          {
            path: "publish-ops",
            lazy: async () => ({
              Component: (await import("@/pages/focus/PublishOpsPage"))
                .PublishOpsPage,
            }),
          },
        ],
      },
    ],
  },
]);
