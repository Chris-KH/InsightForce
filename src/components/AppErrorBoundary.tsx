import React from "react";

import {
  disablePerformanceSafeMode,
  enablePerformanceSafeMode,
} from "@/lib/performance-mode";

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: unknown) {
    // Keep a lightweight console trail so runtime crashes can be diagnosed.
    console.error("AppErrorBoundary caught an error", error);
    // Automatically move app visuals into stable mode after runtime crashes.
    enablePerformanceSafeMode();
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  private handleRetryWithFullEffects = () => {
    disablePerformanceSafeMode();
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
        <div className="w-full max-w-xl rounded-3xl border border-border/70 bg-card/90 p-6 shadow-[0_18px_46px_rgba(15,23,42,0.12)]">
          <p className="text-xs font-semibold tracking-[0.13em] text-primary uppercase">
            Runtime recovery
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            The interface recovered from an unexpected runtime error.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Try continuing your workflow. Your persisted runtime state remains
            in memory and local storage. Stable rendering mode is now enabled to
            reduce crash risk.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-95"
            >
              Retry In Stable Mode
            </button>
            <button
              type="button"
              onClick={this.handleRetryWithFullEffects}
              className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Retry With Full Effects
            </button>
          </div>
        </div>
      </div>
    );
  }
}
