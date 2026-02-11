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
 * GET /api/meetings/[id]
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingId = parseId(id);
    if (!meetingId) {
      return errorResponse("Invalid meeting ID");
    }

    const meeting = await MeetingService.getById(meetingId);
    if (!meeting) {
      return errorResponse("Meeting not found", 404);
    }

    return successResponse(meeting);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/meetings/[id]
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingId = parseId(id);
    if (!meetingId) {
      return errorResponse("Invalid meeting ID");
    }

    const body = await request.json();

    // Validate end time if both times are provided
    if (body.meetingStartTime && body.meetingEndTime) {
      if (new Date(body.meetingEndTime) <= new Date(body.meetingStartTime)) {
        return errorResponse("End time must be after start time");
      }
    }

    // Use updateWithMembers if memberIds are provided, otherwise use regular update
    const meeting = body.memberIds !== undefined
      ? await MeetingService.updateWithMembers(meetingId, body)
      : await MeetingService.update(meetingId, body);
      
    return successResponse(meeting, "Meeting updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/meetings/[id]
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingId = parseId(id);
    if (!meetingId) {
      return errorResponse("Invalid meeting ID");
    }

    await MeetingService.delete(meetingId);
    return successResponse(null, "Meeting deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
