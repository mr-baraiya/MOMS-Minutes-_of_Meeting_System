import { NextRequest } from "next/server";
import { DashboardService } from "@/services";
import { successResponse, handleApiError } from "@/lib/api-utils";

/**
 * GET /api/dashboard
 * Get dashboard statistics and recent data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const staffId = searchParams.get("staffId");

    // If staffId is provided, return staff-specific dashboard
    if (staffId) {
      const dashboard = await DashboardService.getStaffDashboard(
        parseInt(staffId, 10)
      );
      return successResponse(dashboard);
    }

    // Otherwise return general dashboard
    const [stats, recentMeetings, upcomingMeetings, todaysMeetings] =
      await Promise.all([
        DashboardService.getStats(),
        DashboardService.getRecentMeetings(5),
        DashboardService.getUpcomingMeetings(5),
        DashboardService.getTodaysMeetings(),
      ]);

    return successResponse({
      stats,
      recentMeetings,
      upcomingMeetings,
      todaysMeetings,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
