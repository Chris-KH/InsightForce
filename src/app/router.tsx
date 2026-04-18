import { createBrowserRouter } from "react-router";
import { RouteHydrateFallback } from "@/app/RouteHydrateFallback";
import { RootLayout } from "@/layouts/RootLayout";

const routeHydrateFallbackElement = <RouteHydrateFallback />;

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
          {
            path: "profile",
            lazy: async () => ({
              Component: (await import("@/pages/profile/ProfilePage"))
                .ProfilePage,
            }),
          },
        ],
      },
    ],
  },
]);
