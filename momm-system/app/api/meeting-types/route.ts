import { NextRequest } from "next/server";
import { MeetingTypeService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

/**
 * GET /api/meeting-types
 * Get all meeting types
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get("includeInactive") === "true";

    const meetingTypes = await MeetingTypeService.getAll(includeInactive);
    return successResponse(meetingTypes);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/meeting-types
 * Create a new meeting type
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.meetingTypeName) {
      return errorResponse("Meeting type name is required");
    }

    const exists = await MeetingTypeService.existsByName(body.meetingTypeName);
    if (exists) {
      return errorResponse("Meeting type already exists", 409);
    }

    const meetingType = await MeetingTypeService.create({
      meetingTypeName: body.meetingTypeName,
    });

    return successResponse(meetingType, "Meeting type created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
