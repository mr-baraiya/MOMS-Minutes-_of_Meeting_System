import { NextRequest } from "next/server";
import { MeetingTypeService } from "@/services";
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
 * GET /api/meeting-types/[id]
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingTypeId = parseId(id);
    if (!meetingTypeId) {
      return errorResponse("Invalid meeting type ID");
    }

    const meetingType = await MeetingTypeService.getById(meetingTypeId);
    if (!meetingType) {
      return errorResponse("Meeting type not found", 404);
    }

    return successResponse(meetingType);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/meeting-types/[id]
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingTypeId = parseId(id);
    if (!meetingTypeId) {
      return errorResponse("Invalid meeting type ID");
    }

    const body = await request.json();

    if (body.meetingTypeName) {
      const exists = await MeetingTypeService.existsByName(
        body.meetingTypeName,
        meetingTypeId
      );
      if (exists) {
        return errorResponse("Meeting type already exists", 409);
      }
    }

    const meetingType = await MeetingTypeService.update(meetingTypeId, body);
    return successResponse(meetingType, "Meeting type updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/meeting-types/[id]
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingTypeId = parseId(id);
    if (!meetingTypeId) {
      return errorResponse("Invalid meeting type ID");
    }

    await MeetingTypeService.delete(meetingTypeId);
    return successResponse(null, "Meeting type deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
