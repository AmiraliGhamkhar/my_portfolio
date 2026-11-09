export interface ApiEnvelope<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 0, code = 'network_error') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError('The service could not be reached.');
  }

  let payload: { data?: T; error?: { code?: string; message?: string } };
  try {
    payload = await response.json();
  } catch {
    throw new ApiError('The service returned an invalid response.', response.status);
  }
  if (!response.ok || payload.data === undefined) {
    throw new ApiError(
      payload.error?.message || 'The request could not be completed.',
      response.status,
      payload.error?.code || 'request_failed',
    );
  }
  return payload.data;
}

export interface PublicTranslationRecord {
  title?: string;
  name?: string;
  role?: string;
  statement?: string;
  about?: string;
  summary?: string;
  description?: string;
  category?: string;
  details?: string[];
  case_study?: string;
  seo_title?: string;
  seo_description?: string;
  [key: string]: unknown;
}

export interface PublicProjectRecord extends PublicTranslationRecord {
  id?: number;
  slug: string;
  images?: Array<{ id?: number; url: string; alt?: string }>;
  number?: string;
  category?: string;
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  video_url?: string;
  cover_url?: string;
  featured?: boolean | number;
  sort_order?: number;
  problem?: string;
  solution?: string;
  engineering?: string[];
  outcome?: string;
}

export async function getCsrfToken(): Promise<string> {
  const result = await apiRequest<{ csrf_token: string }>('/api/v1/csrf');
  return result.csrf_token;
}
