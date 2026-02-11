import { NextRequest } from "next/server";
import { UserService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
  parsePaginationParams,
} from "@/lib/api-utils";
import { getUserFromRequest, hasRole, createAuthError } from "@/lib/auth";

/**
 * GET /api/users
 * Get all users with pagination (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    const currentUser = getUserFromRequest(request);
    if (!currentUser || !hasRole(currentUser, ['admin'])) {
      return createAuthError('Admin access required', 403);
    }

    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePaginationParams(searchParams);

    const result = await UserService.getAll({ page, limit });
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/users
 * Create a new user (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const currentUser = getUserFromRequest(request);
    if (!currentUser || !hasRole(currentUser, ['admin'])) {
      return createAuthError('Admin access required', 403);
    }

    const body = await request.json();

    if (!body.username || !body.email || !body.password) {
      return errorResponse("Username, email, and password are required");
    }

    // Check if username exists
    const existingByUsername = await UserService.getByUsername(body.username);
    if (existingByUsername) {
      return errorResponse("Username already exists", 409);
    }

    // Check if email exists
    const existingByEmail = await UserService.getByEmail(body.email);
    if (existingByEmail) {
      return errorResponse("Email already exists", 409);
    }

    const user = await UserService.create(body);
    return successResponse(user, "User created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
