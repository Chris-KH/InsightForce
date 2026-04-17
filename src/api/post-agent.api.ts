import { httpClient } from "@/api/http-client";
import type { PostAgentRequest, PostAgentResponse } from "@/api/types";

const POST_AGENT_ENDPOINT =
  import.meta.env.VITE_AUTOPILOT_POST_ENDPOINT ??
  "http://127.0.0.1:8000/api/v1/post/post";

export function submitPostAgentRequest(payload: PostAgentRequest) {
  return httpClient.post<PostAgentResponse>(POST_AGENT_ENDPOINT, payload);
}
