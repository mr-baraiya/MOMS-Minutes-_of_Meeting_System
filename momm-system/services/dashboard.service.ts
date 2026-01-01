import prisma from "@/lib/prisma";
import { DashboardStats, RecentMeeting } from "@/types";

export class DashboardService {
  /**
   * Get dashboard statistics
   */
  static async getStats(): Promise<DashboardStats> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalMeetings,
      upcomingMeetings,
      completedMeetings,
      cancelledMeetings,
      totalStaff,
      totalDocuments,
    ] = await Promise.all([
      prisma.meeting.count(),
      prisma.meeting.count({
        where: {
          meetingDate: { gte: startOfToday },
          isCancelled: false,
        },
      }),
      prisma.meeting.count({
        where: {
          meetingDate: { lt: startOfToday },
          isCancelled: false,
        },
      }),
      prisma.meeting.count({
        where: { isCancelled: true },
      }),
      prisma.staff.count({
        where: { isActive: true },
      }),
      prisma.document.count(),
    ]);

    return {
      totalMeetings,
      upcomingMeetings,
      completedMeetings,
      cancelledMeetings,
      totalStaff,
      totalDocuments,
    };
  }

  /**
   * Get recent meetings for dashboard
   */
  static async getRecentMeetings(limit = 5): Promise<RecentMeeting[]> {
    const now = new Date();
    const meetings = await prisma.meeting.findMany({
      include: {
        meetingType: true,
        venue: true,
        organizer: true,
      },
      orderBy: { meetingDate: "desc" },
      take: limit,
    });

    return meetings.map((m) => ({
      id: m.id,
      meetingTitle: m.meetingTitle,
      meetingDate: m.meetingDate,
      meetingType: m.meetingType?.meetingTypeName,
      venue: m.venue?.venueName,
      organizer: m.organizer?.staffName,
      status: m.isCancelled
        ? "cancelled"
        : new Date(m.meetingDate) < now
          ? "completed"
          : "upcoming",
    }));
  }

  /**
   * Get upcoming meetings for dashboard
   */
  static async getUpcomingMeetings(limit = 5) {
    const now = new Date();
    return prisma.meeting.findMany({
      where: {
        meetingDate: { gte: now },
        isCancelled: false,
      },
      include: {
        meetingType: true,
        venue: true,
        organizer: true,
        _count: {
          select: { meetingMembers: true },
        },
      },
      orderBy: { meetingDate: "asc" },
      take: limit,
    });
  }

  /**
   * Get today's meetings
   */
  static async getTodaysMeetings() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return prisma.meeting.findMany({
      where: {
        meetingDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
        isCancelled: false,
      },
      include: {
        meetingType: true,
        venue: true,
        organizer: true,
        meetingMembers: {
          include: {
            staff: {
              select: {
                id: true,
                staffName: true,
              },
            },
          },
        },
      },
      orderBy: { meetingStartTime: "asc" },
    });
  }

  /**
   * Get dashboard data for a specific staff member
   */
  static async getStaffDashboard(staffId: number) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalMeetings,
      upcomingMeetings,
      organizedMeetings,
      recentMeetings,
    ] = await Promise.all([
      // Total meetings (as member or organizer)
      prisma.meeting.count({
        where: {
          OR: [
            { organizerStaffId: staffId },
            { meetingMembers: { some: { staffId } } },
          ],
        },
      }),
      // Upcoming meetings
      prisma.meeting.count({
        where: {
          meetingDate: { gte: startOfToday },
          isCancelled: false,
          OR: [
            { organizerStaffId: staffId },
            { meetingMembers: { some: { staffId } } },
          ],
        },
      }),
      // Meetings organized by this staff
      prisma.meeting.count({
        where: { organizerStaffId: staffId },
      }),
      // Recent meetings
      prisma.meeting.findMany({
        where: {
          OR: [
            { organizerStaffId: staffId },
            { meetingMembers: { some: { staffId } } },
          ],
        },
        include: {
          meetingType: true,
          venue: true,
          meetingMembers: {
            where: { staffId },
          },
        },
        orderBy: { meetingDate: "desc" },
        take: 5,
      }),
    ]);

    return {
      stats: {
        totalMeetings,
        upcomingMeetings,
        organizedMeetings,
      },
      recentMeetings,
    };
  }
}
