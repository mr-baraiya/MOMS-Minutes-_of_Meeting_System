import { NextRequest } from "next/server";
import { MeetingMemberService } from "@/services";
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
 * PUT /api/meetings/[id]/attendance
 * Mark attendance for meeting members
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingId = parseId(id);
    if (!meetingId) {
      return errorResponse("Invalid meeting ID");
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
