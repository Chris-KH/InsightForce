import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { router } from "@/app/router";
import { queryClient } from "@/app/query-client";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AppErrorBoundary>
          <RouterProvider router={router} />
        </AppErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
