import { httpClient } from "@/api/http-client";
import { getMockAgentsStatus, withApiMockFallback } from "@/api/mock-fallback";
import type {
  AgentsStatusResponse,
  OrchestratorRequest,
  OrchestratorResponse,
} from "@/api/types";

const AGENTS_BASE_PATH = "/api/v1/agents";

export function getAgentsStatus() {
  return withApiMockFallback(
    "agents.status",
    () => httpClient.get<AgentsStatusResponse>(`${AGENTS_BASE_PATH}/status`),
    () => getMockAgentsStatus(),
  );
}

export function orchestrateAgentsPipeline(payload: OrchestratorRequest) {
  return httpClient.post<OrchestratorResponse>(
    `${AGENTS_BASE_PATH}/orchestrate`,
    payload,
  );
}
