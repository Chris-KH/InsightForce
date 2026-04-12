import { httpClient } from "@/api/http-client";
import type { AgentsStatusResponse } from "@/api/types";

const AGENTS_BASE_PATH = "/api/v1/agents";

export function getAgentsStatus() {
  return httpClient.get<AgentsStatusResponse>(`${AGENTS_BASE_PATH}/status`);
}
