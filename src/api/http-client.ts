import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export type QueryPrimitive = string | number | boolean;
export type QueryValue = QueryPrimitive | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  query?: QueryParams;
  signal?: AbortSignal;
  headers?: HeadersInit;
  timeoutMs?: number;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

function normalizeHeaders(
  headers?: HeadersInit,
): Record<string, string> | undefined {
  if (!headers) {
    return undefined;
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return headers;
}

function serializeQuery(query: QueryParams = {}): string {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, rawValue]) => {
    if (Array.isArray(rawValue)) {
      rawValue.forEach((value) => {
        if (value === null || value === undefined) {
          return;
        }
        searchParams.append(key, String(value));
      });
      return;
    }

    if (rawValue === null || rawValue === undefined) {
      return;
    }

    searchParams.append(key, String(rawValue));
  });

  return searchParams.toString();
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object" && data !== null) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === "string") {
      return detail;
    }

    if (typeof detail === "object" && detail !== null) {
      return JSON.stringify(detail);
    }

    const message = (data as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;
    return new ApiError(
      getErrorMessage(data, error.message || "Request failed"),
      status,
      data,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  return new ApiError("Request failed", 0);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  paramsSerializer: {
    serialize: (params) => serializeQuery(params as QueryParams),
  },
});

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export const httpClient = {
  get<T>(path: string, options: RequestOptions = {}) {
    return request<T>({
      url: path,
      method: "GET",
      params: options.query,
      signal: options.signal,
      headers: normalizeHeaders(options.headers),
      timeout: options.timeoutMs,
    });
  },
  post<T>(path: string, body?: unknown, options: RequestOptions = {}) {
    return request<T>({
      url: path,
      method: "POST",
      data: body,
      params: options.query,
      signal: options.signal,
      headers: normalizeHeaders(options.headers),
      timeout: options.timeoutMs,
    });
  },
  put<T>(path: string, body?: unknown, options: RequestOptions = {}) {
    return request<T>({
      url: path,
      method: "PUT",
      data: body,
      params: options.query,
      signal: options.signal,
      headers: normalizeHeaders(options.headers),
      timeout: options.timeoutMs,
    });
  },
  patch<T>(path: string, body?: unknown, options: RequestOptions = {}) {
    return request<T>({
      url: path,
      method: "PATCH",
      data: body,
      params: options.query,
      signal: options.signal,
      headers: normalizeHeaders(options.headers),
      timeout: options.timeoutMs,
    });
  },
  delete<T>(path: string, options: RequestOptions = {}) {
    return request<T>({
      url: path,
      method: "DELETE",
      params: options.query,
      signal: options.signal,
      headers: normalizeHeaders(options.headers),
      timeout: options.timeoutMs,
    });
  },
};
