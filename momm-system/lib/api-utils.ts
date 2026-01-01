import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

/**
 * Create a success response
 */
export function successResponse<T>(data: T, message?: string): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return NextResponse.json(response);
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string,
  status: number = 400
): NextResponse {
  const response: ApiResponse<null> = {
    success: false,
    error,
  };
  return NextResponse.json(response, { status });
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination,
  });
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof Error) {
    // Prisma errors
    if (error.message.includes("Unique constraint")) {
      return errorResponse("A record with this value already exists", 409);
    }
    if (error.message.includes("Record to update not found")) {
      return errorResponse("Record not found", 404);
    }
    if (error.message.includes("Foreign key constraint")) {
      return errorResponse("Related record not found", 400);
    }

    return errorResponse(error.message, 500);
  }

  return errorResponse("An unexpected error occurred", 500);
}

/**
 * Parse pagination params from URL search params
 */
export function parsePaginationParams(searchParams: URLSearchParams): {
  page: number;
  limit: number;
} {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
  );
  return { page, limit };
}

/**
 * Parse ID from params
 */
export function parseId(id: string): number | null {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}
