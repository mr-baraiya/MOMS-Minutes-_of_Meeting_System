import { NextRequest } from "next/server";
import { MeetingService } from "@/services";
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
 * POST /api/meetings/[id]/cancel
 * Cancel a meeting
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingId = parseId(id);
    if (!meetingId) {
      return errorResponse("Invalid meeting ID");
    }

    const body = await request.json();

    if (!body.cancellationReason) {
      return errorResponse("Cancellation reason is required");
    }

    // Check if meeting exists
    const existingMeeting = await MeetingService.getById(meetingId);
    if (!existingMeeting) {
      return errorResponse("Meeting not found", 404);
    }

    if (existingMeeting.isCancelled) {
      return errorResponse("Meeting is already cancelled", 400);
    }

    const meeting = await MeetingService.cancel(meetingId, {
      cancellationReason: body.cancellationReason,
    });

    return successResponse(meeting, "Meeting cancelled successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
