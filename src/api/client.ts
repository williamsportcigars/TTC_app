/**
 * Thin fetch wrapper for the ttc-customer Worker.
 *
 * Native fetch from an iOS app isn't subject to browser CORS, so nothing
 * here needs any worker-side CORS change — this just needs to keep sending
 * and parsing the exact same JSON shapes the web MyHumidor portal uses.
 */

export const CUSTOMER_API_BASE_URL = 'https://ttc-customer.williamsportcigars.workers.dev';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${CUSTOMER_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError('Could not reach TTC. Check your connection and try again.');
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON or empty response body — leave body as null and fall
    // through to the status check below.
  }

  if (!response.ok) {
    const message =
      (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
        ? body.error
        : null) ?? `Something went wrong (${response.status}). Please try again.`;
    throw new ApiError(message, response.status);
  }

  return body as T;
}

export function postJson<T>(path: string, data: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(data) });
}

export function getJson<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}
