import { NextRequest } from "next/server";
import { MeetingMemberService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseId,
} from "@/lib/api-utils";

interface Params {
  params: Promise<{ id: string; memberId: string }>;
}

/**
 * DELETE /api/meetings/[id]/members/[memberId]
 * Remove member from meeting
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id, memberId } = await params;
    const meetingId = parseId(id);
    const staffId = parseId(memberId);

    if (!meetingId || !staffId) {
      return errorResponse("Invalid meeting or staff ID");
    }

    await MeetingMemberService.removeMember(meetingId, staffId);
    return successResponse(null, "Member removed successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
