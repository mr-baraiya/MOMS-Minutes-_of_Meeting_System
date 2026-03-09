import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock next/server so NextResponse.json works outside a Next.js runtime ──
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => ({
      _body: body,
      _status: init?.status ?? 200,
      json: async () => body,
      status: init?.status ?? 200,
    }),
  },
}));

import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  paginatedResponse,
  handleApiError,
} from '@/lib/api-utils';

// ───────────────────────────────────────────────────────────
// successResponse
// ───────────────────────────────────────────────────────────
describe('successResponse', () => {
  it('sets success: true', async () => {
    const res = successResponse({ id: 1 }) as any;
    expect((await res.json()).success).toBe(true);
  });

  it('returns the data as-is', async () => {
    const data = { id: 1, name: 'Test' };
    const res = successResponse(data) as any;
    const body = await res.json();
    expect(body.data).toEqual(data);
  });

  it('includes optional message when provided', async () => {
    const res = successResponse({}, 'Created successfully') as any;
    const body = await res.json();
    expect(body.message).toBe('Created successfully');
  });

  it('defaults to HTTP 200', () => {
    const res = successResponse({}) as any;
    expect(res.status).toBe(200);
  });

  it('works with an array payload', async () => {
    const res = successResponse([1, 2, 3]) as any;
    const body = await res.json();
    expect(body.data).toEqual([1, 2, 3]);
  });

  it('works with a null payload', async () => {
    const res = successResponse(null) as any;
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeNull();
  });
});

// ───────────────────────────────────────────────────────────
// errorResponse
// ───────────────────────────────────────────────────────────
describe('errorResponse', () => {
  it('sets success: false', async () => {
    const res = errorResponse('Bad request') as any;
    expect((await res.json()).success).toBe(false);
  });

  it('includes the error message', async () => {
    const res = errorResponse('Something went wrong') as any;
    const body = await res.json();
    expect(body.error).toBe('Something went wrong');
  });

  it('defaults to status 400', () => {
    const res = errorResponse('fail') as any;
    expect(res.status).toBe(400);
  });

  it('uses a custom status code', () => {
    const res = errorResponse('not found', 404) as any;
    expect(res.status).toBe(404);
  });

  it('uses status 500 for server errors', () => {
    const res = errorResponse('internal', 500) as any;
    expect(res.status).toBe(500);
  });
});

// ───────────────────────────────────────────────────────────
// unauthorizedResponse
// ───────────────────────────────────────────────────────────
describe('unauthorizedResponse', () => {
  it('returns status 401', () => {
    const res = unauthorizedResponse() as any;
    expect(res.status).toBe(401);
  });

  it('uses default message "Unauthorized"', async () => {
    const res = unauthorizedResponse() as any;
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('uses a custom message when provided', async () => {
    const res = unauthorizedResponse('Token expired') as any;
    const body = await res.json();
    expect(body.error).toBe('Token expired');
  });
});

// ───────────────────────────────────────────────────────────
// forbiddenResponse
// ───────────────────────────────────────────────────────────
describe('forbiddenResponse', () => {
  it('returns status 403', () => {
    const res = forbiddenResponse() as any;
    expect(res.status).toBe(403);
  });

  it('uses default message "Forbidden"', async () => {
    const res = forbiddenResponse() as any;
    const body = await res.json();
    expect(body.error).toBe('Forbidden');
  });

  it('uses a custom message when provided', async () => {
    const res = forbiddenResponse('Insufficient role') as any;
    const body = await res.json();
    expect(body.error).toBe('Insufficient role');
  });
});

// ───────────────────────────────────────────────────────────
// paginatedResponse
// ───────────────────────────────────────────────────────────
describe('paginatedResponse', () => {
  const pagination = { page: 1, limit: 10, total: 25, totalPages: 3 };

  it('sets success: true', async () => {
    const res = paginatedResponse([1, 2], pagination) as any;
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('includes the data array', async () => {
    const data = [{ id: 1 }, { id: 2 }];
    const res = paginatedResponse(data, pagination) as any;
    const body = await res.json();
    expect(body.data).toEqual(data);
  });

  it('includes all pagination fields', async () => {
    const res = paginatedResponse([], pagination) as any;
    const body = await res.json();
    expect(body.pagination.page).toBe(1);
    expect(body.pagination.limit).toBe(10);
    expect(body.pagination.total).toBe(25);
    expect(body.pagination.totalPages).toBe(3);
  });
});

// ───────────────────────────────────────────────────────────
// handleApiError
// ───────────────────────────────────────────────────────────
describe('handleApiError', () => {
  it('handles a generic Error with status 500', async () => {
    const res = handleApiError(new Error('Unexpected crash')) as any;
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Unexpected crash');
  });

  it('detects "Unique constraint" and returns 409', async () => {
    const res = handleApiError(new Error('Unique constraint failed on the fields: (email)')) as any;
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/already exists/);
  });

  it('detects "Record to update not found" and returns 404', async () => {
    const res = handleApiError(new Error('Record to update not found')) as any;
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toMatch(/not found/i);
  });

  it('detects "Foreign key constraint" and returns 400', async () => {
    const res = handleApiError(new Error('Foreign key constraint failed')) as any;
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/Related record/i);
  });

  it('handles non-Error unknown values with a 500 fallback', async () => {
    const res = handleApiError('some string error') as any;
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/unexpected/i);
  });

  it('handles null error gracefully', async () => {
    const res = handleApiError(null) as any;
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});
