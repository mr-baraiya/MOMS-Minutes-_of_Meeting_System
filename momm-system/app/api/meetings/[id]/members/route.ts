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
 * GET /api/meetings/[id]/members
 * Get all members of a meeting
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingId = parseId(id);
    if (!meetingId) {
      return errorResponse("Invalid meeting ID");
    }

    const searchParams = request.nextUrl.searchParams;
    const summary = searchParams.get("summary") === "true";

    if (summary) {
      const attendance = await MeetingMemberService.getAttendanceSummary(meetingId);
      return successResponse(attendance);
    }

    const members = await MeetingMemberService.getByMeetingId(meetingId);
    return successResponse(members);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/meetings/[id]/members
 * Add member(s) to meeting
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingId = parseId(id);
    if (!meetingId) {
      return errorResponse("Invalid meeting ID");
    }

    const body = await request.json();

    // Bulk add members
    if (body.staffIds && Array.isArray(body.staffIds)) {
      const result = await MeetingMemberService.addMembers(meetingId, body.staffIds);
      return successResponse(result, `Added ${result.count} member(s) to meeting`);
    }

    // Single member add
    if (!body.staffId) {
      return errorResponse("Staff ID is required");
    }

    // Check if already a member
    const isMember = await MeetingMemberService.isMember(meetingId, body.staffId);
    if (isMember) {
      return errorResponse("Staff is already a member of this meeting", 409);
    }

    const member = await MeetingMemberService.addMember(meetingId, {
      staffId: body.staffId,
      remarks: body.remarks,
    });

    return successResponse(member, "Member added successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
