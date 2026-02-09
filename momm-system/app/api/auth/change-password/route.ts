import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword, getUserFromRequest } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validations";
import { errorResponse, handleApiError, successResponse } from "@/lib/api-utils";
import { z } from "zod";

/**
 * POST /api/auth/change-password
 * Change current authenticated user password
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    const userDetails = await prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!userDetails) {
      return errorResponse("User not found", 404);
    }

    if (!userDetails.isActive) {
      return errorResponse("Account is deactivated", 403);
    }

    const isValid = await comparePassword(
      validatedData.currentPassword,
      userDetails.passwordHash
    );

    if (!isValid) {
      return errorResponse("Current password is incorrect", 400);
    }

    const newHash = await hashPassword(validatedData.newPassword);

    await prisma.user.update({
      where: { id: user.userId },
      data: { passwordHash: newHash },
    });

    return successResponse(true, "Password updated successfully");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0].message, 400);
    }
    return handleApiError(error);
  }
}
