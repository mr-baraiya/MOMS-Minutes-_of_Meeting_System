import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

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

    return successResponse({
      id: userDetails.id,
      username: userDetails.username,
      email: userDetails.email,
      role: userDetails.role.toLowerCase() as 'admin' | 'convener' | 'staff',
      staff: userDetails.staff ? {
        id: userDetails.staff.id,
        name: userDetails.staff.staffName,
        department: userDetails.staff.department?.departmentName,
        departmentId: userDetails.staff.departmentId,
      } : null,
    });
  } catch (error) {
    return errorResponse("Failed to fetch user details", 500);
  }
}
