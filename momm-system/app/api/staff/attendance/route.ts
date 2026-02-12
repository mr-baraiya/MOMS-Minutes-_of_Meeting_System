import { NextRequest } from "next/server";
import { MeetingMemberService } from "@/services";
import {
  successResponse,
  handleApiError,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/api-utils";
import { getUserFromRequest } from "@/lib/auth";

/**
 * GET /api/staff/attendance
 * Get attendance history for the logged-in staff member
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return unauthorizedResponse();
    }

    if (!user.staffId) {
       return forbiddenResponse("User is not associated with a staff profile");
    }

    const history = await MeetingMemberService.getAttendanceHistory(user.staffId);
    
    return successResponse(history);
  } catch (error) {
    return handleApiError(error);
  }
}
