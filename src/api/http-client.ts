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
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
  headers?: HeadersInit;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

function appendQuery(path: string, query?: QueryParams): string {
  if (!query) {
    return path;
  }

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

  const queryString = searchParams.toString();
  if (!queryString) {
    return path;
  }

  return `${path}?${queryString}`;
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

async function parseResponseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const method = options.method ?? "GET";
  const requestPath = appendQuery(`${API_BASE_URL}${path}`, options.query);

  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(requestPath, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, `Request failed with status ${response.status}`),
      response.status,
      data,
    );
  }

  return data as T;
}

export const httpClient = {
  get<T>(path: string, options: Omit<RequestOptions, "method" | "body"> = {}) {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T>(
    path: string,
    body?: unknown,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ) {
    return request<T>(path, { ...options, method: "POST", body });
  },
  put<T>(
    path: string,
    body?: unknown,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ) {
    return request<T>(path, { ...options, method: "PUT", body });
  },
  patch<T>(
    path: string,
    body?: unknown,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ) {
    return request<T>(path, { ...options, method: "PATCH", body });
  },
  delete<T>(
    path: string,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ) {
    return request<T>(path, { ...options, method: "DELETE" });
  },
};
