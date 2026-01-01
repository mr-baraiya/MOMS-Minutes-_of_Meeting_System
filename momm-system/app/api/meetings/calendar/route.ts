import { NextRequest } from "next/server";
import { MeetingService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

/**
 * GET /api/meetings/calendar
 * Get meetings for calendar view
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return errorResponse("Start date and end date are required");
    }

    const meetings = await MeetingService.getForCalendar(
      new Date(startDate),
      new Date(endDate)
    );

    return successResponse(meetings);
  } catch (error) {
    return handleApiError(error);
  }
}
