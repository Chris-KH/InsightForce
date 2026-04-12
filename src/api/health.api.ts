import { httpClient } from "@/api/http-client";
import type { HealthResponse } from "@/api/types";

export function getHealthStatus() {
  return httpClient.get<HealthResponse>("/health");
}
