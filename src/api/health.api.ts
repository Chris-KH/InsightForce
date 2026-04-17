import { httpClient } from "@/api/http-client";
import type { HealthResponse } from "@/api/types";

type RequestOptions = {
  signal?: AbortSignal;
};

export function getHealthStatus(options: RequestOptions = {}) {
  return httpClient.get<HealthResponse>("/health", {
    signal: options.signal,
  });
}
