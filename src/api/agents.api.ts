import { httpClient } from "@/api/http-client";
import { getMockAgentsStatus, withApiMockFallback } from "@/api/mock-fallback";
import type { AgentsStatusResponse } from "@/api/types";

const AGENTS_BASE_PATH = "/api/v1/agents";

export function getAgentsStatus() {
  return withApiMockFallback(
    "agents.status",
    () => httpClient.get<AgentsStatusResponse>(`${AGENTS_BASE_PATH}/status`),
    () => getMockAgentsStatus(),
  );
}
