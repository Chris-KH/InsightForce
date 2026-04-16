import { httpClient } from "@/api/http-client";
import type {
  UserCreateRequest,
  UserResponse,
  UsersListResponse,
} from "@/api/types";

const USERS_BASE_PATH = "/api/v1/users";

export function createUser(payload: UserCreateRequest) {
  return httpClient.post<UserResponse>(USERS_BASE_PATH, payload);
}

export function getUsers() {
  return httpClient.get<UsersListResponse>(USERS_BASE_PATH);
}

export function getUser(userId: string) {
  return httpClient.get<UserResponse>(
    `${USERS_BASE_PATH}/${encodeURIComponent(userId)}`,
  );
}
