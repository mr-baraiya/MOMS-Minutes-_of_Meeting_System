import { NextRequest } from "next/server";
import { UserService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseId,
} from "@/lib/api-utils";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/users/[id]
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const userId = parseId(id);
    if (!userId) {
      return errorResponse("Invalid user ID");
    }

    const user = await UserService.getById(userId);
    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/users/[id]
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const userId = parseId(id);
    if (!userId) {
      return errorResponse("Invalid user ID");
    }

    const body = await request.json();

    // Check username uniqueness if updating
    if (body.username) {
      const existing = await UserService.getByUsername(body.username);
      if (existing && existing.id !== userId) {
        return errorResponse("Username already exists", 409);
      }
    }

    // Check email uniqueness if updating
    if (body.email) {
      const existing = await UserService.getByEmail(body.email);
      if (existing && existing.id !== userId) {
        return errorResponse("Email already exists", 409);
      }
    }

    const user = await UserService.update(userId, body);
    return successResponse(user, "User updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/users/[id]
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const userId = parseId(id);
    if (!userId) {
      return errorResponse("Invalid user ID");
    }

    await UserService.delete(userId);
    return successResponse(null, "User deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
