import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/layouts/RootLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { LoginPage } from "@/pages/login/LoginPage";
import { LandingPage } from "@/pages/landing/LandingPage";
import { RegisterPage } from "@/pages/register/RegisterPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";

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
    ],
  },
  {
    path: "/app",
    Component: ProtectedRoute,
    children: [
      {
        Component: RootLayout,
        children: [
          {
            path: "/app/dashboard",
            Component: DashboardPage,
          },
        ],
      },
    ],
  },
]);
