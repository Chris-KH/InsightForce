import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/layouts/RootLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import AppLayout from "@/layouts/AppLayout";
import { LoginPage } from "@/pages/login/LoginPage";
import { LandingPage } from "@/pages/landing/LandingPage";
import { RegisterPage } from "@/pages/register/RegisterPage";
import { VerifyEmailPage } from "@/pages/register/VerifyEmailPage";
import { RegisterSuccessPage } from "@/pages/register/RegisterSuccessPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { AudiencePage } from "@/pages/audience/AudiencePage";
import { StrategyPage } from "@/pages/strategy/StrategyPage";
import { FinancePage } from "@/pages/finance/FinancePage";
import { AutomationPage } from "@/pages/automation/AutomationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
      {
        path: "/register/verify",
        Component: VerifyEmailPage,
      },
      {
        path: "/register/success",
        Component: RegisterSuccessPage,
      },
    ],
  },
  {
    path: "/app",
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          { index: true, Component: DashboardPage },
          { path: "dashboard", Component: DashboardPage },
          { path: "audience", Component: AudiencePage },
          { path: "strategy", Component: StrategyPage },
          { path: "finance", Component: FinancePage },
          { path: "automation", Component: AutomationPage },
        ],
      },
    ],
  },
]);
