import { NextRequest } from "next/server";
import { NotificationService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/notifications
 * Get notifications for the logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = getUserFromRequest(request);
    
    if (!user) {
      return errorResponse("User not authenticated", 401);
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    // Check if user.userId is valid
    if (!user.userId || isNaN(user.userId)) {
      return errorResponse("Invalid user ID", 400);
    }

    // Check if the user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true }
    });
    
    if (!userExists) {
      return errorResponse("User not found", 404);
    }

    // Get notifications and unread count
    const [notifications, unreadCount] = await Promise.all([
      NotificationService.getByUserId(user.userId, limit, unreadOnly),
      NotificationService.getUnreadCount(user.userId)
    ]);

    return successResponse({
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
    });
  } catch (error) {
    console.error('Notifications API error:', error);
    return handleApiError(error);
  }
}
