import { NextRequest } from "next/server";
import { NotificationService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseId,
} from "@/lib/api-utils";
import { getUserFromRequest } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/notifications/[id]/read
 * Mark notification as read
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    // Get authenticated user
    const user = getUserFromRequest(request);
    
    if (!user) {
      return errorResponse("User not authenticated", 401);
    }

    const { id } = await params;
    const notificationId = parseId(id);
    
    if (!notificationId) {
      return errorResponse("Invalid notification ID");
    }

    await NotificationService.markAsRead(notificationId, user.userId);

    return successResponse(null, "Notification marked as read");
  } catch (error) {
    return handleApiError(error);
  }
}
