import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validations";
import { z } from "zod";

function mapUserResponse(userDetails: {
  id: number;
  username: string;
  email: string;
  role: string;
  profilePicture: string | null;
  staff: {
    id: number;
    staffName: string;
    departmentId: number | null;
    department: { departmentName: string } | null;
  } | null;
}) {
  return {
    id: userDetails.id,
    username: userDetails.username,
    email: userDetails.email,
    role: userDetails.role.toLowerCase() as "admin" | "convener" | "staff",
    profilePicture: userDetails.profilePicture || null,
    staff: userDetails.staff
      ? {
          id: userDetails.staff.id,
          name: userDetails.staff.staffName,
          department: userDetails.staff.department?.departmentName,
          departmentId: userDetails.staff.departmentId,
        }
      : null,
  };
}

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    // Fetch full user details from database
    const userDetails = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        staff: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!userDetails) {
      return errorResponse("User not found", 404);
    }

    if (!userDetails.isActive) {
      return errorResponse("Account is deactivated", 403);
    }

    return successResponse(mapUserResponse(userDetails));
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/auth/me
 * Update current authenticated user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const userDetails = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        staff: true,
      },
    });

    if (!userDetails) {
      return errorResponse("User not found", 404);
    }

    if (!userDetails.isActive) {
      return errorResponse("Account is deactivated", 403);
    }

    if (validatedData.username && validatedData.username !== userDetails.username) {
      const existingByUsername = await prisma.user.findUnique({
        where: { username: validatedData.username },
      });

      if (existingByUsername && existingByUsername.id !== userDetails.id) {
        return errorResponse("Username already exists", 409);
      }
    }

    if (validatedData.email && validatedData.email !== userDetails.email) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingByEmail && existingByEmail.id !== userDetails.id) {
        return errorResponse("Email already exists", 409);
      }
    }

    const profilePicture =
      validatedData.profilePicture === null
        ? null
        : validatedData.profilePicture || undefined;

    if (validatedData.username || validatedData.email || profilePicture !== undefined) {
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          username: validatedData.username,
          email: validatedData.email,
          profilePicture,
        },
      });
    }

    if (validatedData.staffName && userDetails.staff) {
      await prisma.staff.update({
        where: { id: userDetails.staff.id },
        data: { staffName: validatedData.staffName },
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        staff: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!updatedUser) {
      return errorResponse("User not found", 404);
    }

    return successResponse(mapUserResponse(updatedUser), "Profile updated successfully");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0].message, 400);
    }
    return handleApiError(error);
  }
}
