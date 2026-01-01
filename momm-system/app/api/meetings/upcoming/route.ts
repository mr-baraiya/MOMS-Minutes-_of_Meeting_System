import { NextRequest } from "next/server";
import { MeetingService } from "@/services";
import { successResponse, handleApiError } from "@/lib/api-utils";

/**
 * GET /api/meetings/upcoming
 * Get upcoming meetings
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const meetings = await MeetingService.getUpcoming(limit);
    return successResponse(meetings);
  } catch (error) {
    return handleApiError(error);
  }
}
