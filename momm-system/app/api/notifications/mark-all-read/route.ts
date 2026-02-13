import { NextRequest } from "next/server";
import { NotificationService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";
import { getUserFromRequest } from "@/lib/auth";

/**
 * PATCH /api/notifications/mark-all-read
 * Mark all notifications as read for a user
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get authenticated user
    const user = getUserFromRequest(request);
    
    if (!user) {
      return errorResponse("User not authenticated", 401);
    }

    await NotificationService.markAllAsRead(user.userId);

    return successResponse(null, "All notifications marked as read");
  } catch (error) {
    return handleApiError(error);
  }
}
