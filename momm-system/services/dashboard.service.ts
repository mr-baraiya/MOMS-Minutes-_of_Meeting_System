import prisma from "@/lib/prisma";
import { DashboardStats, RecentMeeting } from "@/types";

/**
 * Normalize date for @db.Date fields
 */
function normalizeDate(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

const TODAY = normalizeDate();

/* -------------------------------------------------------------
   DASHBOARD SERVICE
-------------------------------------------------------------- */
export class DashboardService {
  /* -----------------------------------------------------------
      GET OVERALL DASHBOARD STATS
  ----------------------------------------------------------- */
  static async getStats(): Promise<DashboardStats> {
    return await Promise.all([
      prisma.meeting.count(), // total

      prisma.meeting.count({
        where: {
          meetingDate: { gte: TODAY },
          isCancelled: false,
        },
      }),

      prisma.meeting.count({
        where: {
          meetingDate: { lt: TODAY },
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
    ]).then(
      ([
        totalMeetings,
        upcomingMeetings,
        completedMeetings,
        cancelledMeetings,
        totalStaff,
        totalDocuments,
      ]) => ({
        totalMeetings,
        upcomingMeetings,
        completedMeetings,
        cancelledMeetings,
        totalStaff,
        totalDocuments,
      })
    );
  }

  /* -----------------------------------------------------------
      RECENT MEETINGS
  ----------------------------------------------------------- */
  static async getRecentMeetings(limit = 5): Promise<RecentMeeting[]> {
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
        : m.meetingDate < TODAY
        ? "completed"
        : "upcoming",
    }));
  }

  /* -----------------------------------------------------------
      UPCOMING MEETINGS (>= today)
  ----------------------------------------------------------- */
  static async getUpcomingMeetings(limit = 5) {
    return prisma.meeting.findMany({
      where: {
        meetingDate: { gte: TODAY },
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

  /* -----------------------------------------------------------
      TODAY'S MEETINGS (== today)
  ----------------------------------------------------------- */
  static async getTodaysMeetings() {
    return prisma.meeting.findMany({
      where: {
        meetingDate: { equals: TODAY },
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

  /* -----------------------------------------------------------
      STAFF DASHBOARD
  ----------------------------------------------------------- */
  static async getStaffDashboard(staffId: number) {
    return await Promise.all([
      // Total meetings involving this staff
      prisma.meeting.count({
        where: {
          OR: [
            { organizerStaffId: staffId },
            { meetingMembers: { some: { staffId } } },
          ],
        },
      }),

      // Upcoming meetings for this staff
      prisma.meeting.count({
        where: {
          meetingDate: { gte: TODAY },
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

      // List of recent meetings
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
    ]).then(
      ([
        totalMeetings,
        upcomingMeetings,
        organizedMeetings,
        recentMeetings,
      ]) => ({
        stats: {
          totalMeetings,
          upcomingMeetings,
          organizedMeetings,
        },
        recentMeetings,
      })
    );
  }
}
