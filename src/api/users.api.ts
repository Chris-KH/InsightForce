import { httpClient } from "@/api/http-client";
import type {
  UserCreateRequest,
  UserResponse,
  UsersListResponse,
} from "@/api/types";

const USERS_BASE_PATH = "/api/v1/users";

type RequestOptions = {
  signal?: AbortSignal;
};

export function createUser(payload: UserCreateRequest) {
  return httpClient.post<UserResponse>(USERS_BASE_PATH, payload);
}

export function getUsers(options: RequestOptions = {}) {
  return httpClient.get<UsersListResponse>(USERS_BASE_PATH, {
    signal: options.signal,
  });
}

export function getUser(userId: string, options: RequestOptions = {}) {
  return httpClient.get<UserResponse>(
    `${USERS_BASE_PATH}/${encodeURIComponent(userId)}`,
    {
      signal: options.signal,
    },
  );
}
