import { API_BASE_URL } from './config';

const REQUEST_TIMEOUT_MS = 5000;

let accessToken: string | null = null;

export type ApiErrorBody = {
  code?: string;
  message?: string;
  timestamp?: string;
};

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly timestamp: string | undefined;

  constructor(status: number, body: ApiErrorBody | undefined) {
    super(body?.message ?? `API request failed with status ${status}`);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = body?.code;
    this.timestamp = body?.timestamp;
  }
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers: {
          Accept: 'application/json',
          ...(accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
          ...options.headers,
        },
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      let body: ApiErrorBody | undefined;

      try {
        body = await response.json() as ApiErrorBody;
      } catch {
        body = undefined;
      }

      throw new ApiRequestError(response.status, body);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}