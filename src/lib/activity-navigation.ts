import type { NavigateFunction } from "react-router";

export function navigateToActivityRoute(
  navigate: NavigateFunction,
  route: string,
) {
  navigate(route);

  if (typeof window === "undefined") {
    return;
  }

  const [path, hash] = route.split("#");
  if (!hash) {
    return;
  }

  let attempts = 0;
  const maxAttempts = 30;

  const scrollWhenReady = () => {
    attempts += 1;

    const isExpectedRoute =
      window.location.pathname === path && window.location.hash === `#${hash}`;

    if (!isExpectedRoute) {
      if (attempts < maxAttempts) {
        window.requestAnimationFrame(scrollWhenReady);
      }
      return;
    }

    const target = document.getElementById(hash);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    if (attempts < maxAttempts) {
      window.requestAnimationFrame(scrollWhenReady);
    }
  };

  window.requestAnimationFrame(scrollWhenReady);
}
