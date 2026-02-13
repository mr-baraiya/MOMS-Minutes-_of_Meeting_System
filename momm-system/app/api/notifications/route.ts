import { NextRequest } from "next/server";
import { NotificationService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { getUserFromRequest } from "@/lib/auth";

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
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const notifications = await NotificationService.getByUserId(
      user.userId,
      limit,
      unreadOnly
    );

    const unreadCount = await NotificationService.getUnreadCount(user.userId);

    return successResponse({
      notifications,
      unreadCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
