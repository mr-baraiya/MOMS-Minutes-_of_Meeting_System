import { NextRequest } from "next/server";
import { DashboardService } from "@/services";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const staffId = searchParams.get("staffId");
    const userId = searchParams.get("userId");

    // Validate required parameters for each role
    if (!role) {
      return Response.json({ success: false, error: "Role parameter is required" }, { status: 400 });
    }

    console.log(`Dashboard API called with role: ${role}, staffId: ${staffId}, userId: ${userId}`);

    // Role-based dashboard data
    if (role === "admin") {
      const stats = await DashboardService.getAdminStats();
      const recentMeetings = await DashboardService.getRecentMeetings(5);
      const recentActivity = await DashboardService.getSystemActivity(10);
      const meetingsPerMonth = await DashboardService.getMeetingsPerMonth(6);
      const attendanceTrend = await DashboardService.getAttendanceTrend(6);
      const overallAttendance = await DashboardService.getOverallAttendance();
      const upcomingMeetings = await DashboardService.getUpcomingMeetings(5);
      const departmentStats = await DashboardService.getDepartmentStats();
      const meetingTypeStats = await DashboardService.getMeetingTypeStats();

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
        departmentStats,
        meetingTypeStats,
      });
    }

    if (role === "convener") {
      if (!userId) {
        return Response.json({ success: false, error: "UserId parameter is required for convener" }, { status: 400 });
      }
      const userIdNum = parseInt(userId, 10);
      if (isNaN(userIdNum)) {
        return Response.json({ success: false, error: "Invalid userId parameter" }, { status: 400 });
      }
      
      const stats = await DashboardService.getConvenerStats(userIdNum);
      const upcomingMeetings = await DashboardService.getConvenerUpcomingMeetings(userIdNum, 5);
      const recentMeetings = await DashboardService.getConvenerRecentMeetings(userIdNum, 5);
      const pendingTasks = await DashboardService.getConvenerPendingTasks(userIdNum);

      return successResponse({
        stats,
        upcomingMeetings,
        recentMeetings,
        pendingTasks,
      });
    }

    if (role === "staff") {
      if (!staffId) {
        return Response.json({ success: false, error: "StaffId parameter is required for staff" }, { status: 400 });
      }
      const staffIdNum = parseInt(staffId, 10);
      if (isNaN(staffIdNum)) {
        return Response.json({ success: false, error: "Invalid staffId parameter" }, { status: 400 });
      }
      
      const dashboard = await DashboardService.getStaffDashboard(staffIdNum);
      return successResponse(dashboard);
    }

    // Default/legacy behavior
    console.log("Using default dashboard behavior");
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
    console.error('Dashboard API error:', error);
    return handleApiError(error);
  }
}
