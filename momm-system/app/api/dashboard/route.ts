import { NextRequest } from "next/server";
import { DashboardService } from "@/services";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const staffId = searchParams.get("staffId");
    const userId = searchParams.get("userId");

    // Role-based dashboard data
    if (role === "admin") {
      const stats = await DashboardService.getAdminStats();
      const recentMeetings = await DashboardService.getRecentMeetings(5);
      const recentActivity = await DashboardService.getSystemActivity(10);
      const meetingsPerMonth = await DashboardService.getMeetingsPerMonth(6);
      const attendanceTrend = await DashboardService.getAttendanceTrend(6);
      const overallAttendance = await DashboardService.getOverallAttendance();
      const upcomingMeetings = await DashboardService.getUpcomingMeetings(5);

      return successResponse({
        stats: {
          ...stats,
          overallAttendance,
        },
        recentMeetings,
        upcomingMeetings,
        recentActivity,
        meetingsPerMonth,
        attendanceTrend,
      });
    }

    if (role === "convener" && userId) {
      const stats = await DashboardService.getConvenerStats(parseInt(userId, 10));
      const upcomingMeetings = await DashboardService.getConvenerUpcomingMeetings(parseInt(userId, 10), 5);
      const recentMeetings = await DashboardService.getConvenerRecentMeetings(parseInt(userId, 10), 5);
      const pendingTasks = await DashboardService.getConvenerPendingTasks(parseInt(userId, 10));

      return successResponse({
        stats,
        upcomingMeetings,
        recentMeetings,
        pendingTasks,
      });
    }

    if (role === "staff" && staffId) {
      const dashboard = await DashboardService.getStaffDashboard(parseInt(staffId, 10));
      return successResponse(dashboard);
    }

    // Default/legacy behavior
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
