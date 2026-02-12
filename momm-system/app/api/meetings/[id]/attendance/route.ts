import { NextRequest } from "next/server";
import { MeetingMemberService, MeetingService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseId,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/api-utils";
import { getUserFromRequest } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/meetings/[id]/attendance
 * Mark attendance for meeting members
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const meetingId = parseId(id);
    if (!meetingId) {
      return errorResponse("Invalid meeting ID");
    }

    // Role-based Access Control
    if (user.role === "admin") {
      // Admin can mark attendance for any meeting
    } else if (user.role === "convener") {
      // Convener can only mark attendance for their own meetings
      const meeting = await MeetingService.getById(meetingId);
      if (!meeting) {
        return errorResponse("Meeting not found", 404);
      }
      
      // Check if the current user is the organizer of this meeting
      // Note: user.userId is the usage id, user.staffId is the staff id
      if (meeting.organizerStaffId !== user.staffId) {
        return forbiddenResponse("You can only mark attendance for meetings you organize");
      }
    } else {
      // Staff cannot mark attendance
      return forbiddenResponse("Staff members are not authorized to mark attendance");
    }

    const body = await request.json();

    // Bulk attendance
    if (body.attendance && Array.isArray(body.attendance)) {
      const results = await MeetingMemberService.bulkMarkAttendance(meetingId, {
        attendance: body.attendance,
      });
      return successResponse(results, "Attendance marked successfully");
    }

    // Single attendance
    if (!body.memberId) {
      return errorResponse("Member ID is required");
    }

    const result = await MeetingMemberService.markAttendance({
      memberId: body.memberId,
      isPresent: body.isPresent ?? false,
      remarks: body.remarks,
    });

    return successResponse(result, "Attendance marked successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
