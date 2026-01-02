import { NextRequest } from "next/server";
import { AuthService } from "@/services";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

/**
 * POST /api/auth/login
 * Authenticate user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.username || !body.password) {
      return errorResponse("Username and password are required");
    }

    const result = await AuthService.login({
      username: body.username,
      password: body.password,
    });

    if (!result) {
      return errorResponse("Invalid credentials", 401);
    }

    return successResponse(result, "Login successful");
  } catch (error) {
    return handleApiError(error);
  }
}
