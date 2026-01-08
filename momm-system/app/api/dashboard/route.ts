import { NextRequest } from "next/server";
import { DashboardService } from "@/services";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const staffId = searchParams.get("staffId");

    if (staffId) {
      const dashboard = await DashboardService.getStaffDashboard(parseInt(staffId, 10));
      return successResponse(dashboard);
    }

    const stats = await DashboardService.getStats();
    const recentMeetings = await DashboardService.getRecentMeetings(5);
    const upcomingMeetings = await DashboardService.getUpcomingMeetings(5);
    const todaysMeetings = await DashboardService.getTodaysMeetings();

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
