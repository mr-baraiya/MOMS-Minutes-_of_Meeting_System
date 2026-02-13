import { prisma } from "@/lib/prisma";
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

      // Attended meetings
      prisma.meetingMember.count({
        where: {
          staffId,
          isPresent: true,
        },
      }),

      // Missed meetings
      prisma.meetingMember.count({
        where: {
          staffId,
          isPresent: false,
        },
      }),

      // Pending meetings
      prisma.meetingMember.count({
        where: {
          staffId,
          attendanceMarkedAt: null,
        },
      }),

      // Documents available
      prisma.document.count({
        where: {
          meeting: {
            meetingMembers: {
              some: { staffId },
            },
          },
        },
      }),

      // List of upcoming meetings
      prisma.meeting.findMany({
        where: {
          meetingDate: { gte: TODAY },
          isCancelled: false,
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
        orderBy: { meetingDate: "asc" },
        take: 5,
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

      // Attendance history
      prisma.meetingMember.findMany({
        where: { staffId },
        include: {
          meeting: {
            include: {
              meetingType: true,
            },
          },
        },
        orderBy: {
          meeting: {
            meetingDate: "desc",
          },
        },
        take: 10,
      }),
    ]).then(
      ([
        assignedMeetings,
        upcomingMeetings,
        organizedMeetings,
        attendedMeetings,
        missedMeetings,
        pendingMeetings,
        documentsAvailable,
        upcomingMeetingsList,
        recentMeetings,
        attendanceHistory,
      ]) => ({
        stats: {
          assignedMeetings,
          upcomingMeetings,
          attendedMeetings,
          missedMeetings,
          pendingMeetings,
          documentsAvailable,
        },
        upcomingMeetings: upcomingMeetingsList.map((m) => ({
          id: m.id,
          title: m.meetingTitle,
          date: m.meetingDate.toISOString().split('T')[0],
          time: m.meetingStartTime || 'TBD',
          type: m.meetingType?.meetingTypeName || 'N/A',
          venue: m.venue?.venueName || 'N/A',
        })),
        recentMeetings: recentMeetings.map((m) => ({
          id: m.id,
          title: m.meetingTitle,
          date: m.meetingDate.toISOString().split('T')[0],
          type: m.meetingType?.meetingTypeName || 'N/A',
        })),
        attendanceHistory: attendanceHistory.map((record) => ({
          id: record.id,
          meetingTitle: record.meeting.meetingTitle,
          date: record.meeting.meetingDate.toISOString().split('T')[0],
          status: record.attendanceMarkedAt ? (record.isPresent ? 'present' : 'absent') : 'pending',
          meetingType: record.meeting.meetingType?.meetingTypeName || 'N/A',
        })),
      })
    );
  }

  /* -----------------------------------------------------------
      DEPARTMENT STATS
  ----------------------------------------------------------- */
  static async getDepartmentStats() {
    const departments = await prisma.department.findMany({
      select: {
        departmentName: true,
        staff: {
          select: {
            _count: {
              select: { organizedMeetings: true },
            },
          },
        },
      },
    });

    return departments
      .map((d) => ({
        name: d.departmentName,
        value: d.staff.reduce((acc, s) => acc + s._count.organizedMeetings, 0),
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }

  /* -----------------------------------------------------------
      MEETING TYPE STATS
  ----------------------------------------------------------- */
  static async getMeetingTypeStats() {
    const types = await prisma.meetingType.findMany({
      select: {
        meetingTypeName: true,
        _count: {
          select: { meetings: true },
        },
      },
    });

    return types
      .map((t) => ({
        name: t.meetingTypeName,
        value: t._count.meetings,
      }))
      .filter((t) => t.value > 0)
      .sort((a, b) => b.value - a.value);
  }

  /* -----------------------------------------------------------
      ADMIN DASHBOARD STATS
  ----------------------------------------------------------- */
  static async getAdminStats() {
    return await Promise.all([
      prisma.user.count(),
      prisma.meeting.count(),
      prisma.department.count(),
      prisma.venue.count(),
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
    ]).then(
      ([
        totalUsers,
        totalMeetings,
        totalDepartments,
        totalVenues,
        activeMeetings,
        completedMeetings,
        cancelledMeetings,
        totalStaff,
      ]) => ({
        totalUsers,
        totalMeetings,
        totalDepartments,
        totalVenues,
        activeMeetings,
        completedMeetings,
        cancelledMeetings,
        totalStaff,
      })
    );
  }

  /* -----------------------------------------------------------
      CONVENER DASHBOARD STATS
  ----------------------------------------------------------- */
  static async getConvenerStats(userId: number) {
    // Get staff record for this user
    const staff = await prisma.staff.findFirst({
      where: { userId },
    });

    if (!staff) {
      return {
        myMeetings: 0,
        upcomingMeetings: 0,
        completedMeetings: 0,
        pendingDocuments: 0,
        totalParticipants: 0,
        thisWeekMeetings: 0,
      };
    }

    const weekFromNow = new Date(TODAY);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    return await Promise.all([
      // My meetings
      prisma.meeting.count({
        where: { organizerStaffId: staff.id },
      }),

      // Upcoming meetings
      prisma.meeting.count({
        where: {
          organizerStaffId: staff.id,
          meetingDate: { gte: TODAY },
          isCancelled: false,
        },
      }),

      // Completed meetings
      prisma.meeting.count({
        where: {
          organizerStaffId: staff.id,
          meetingDate: { lt: TODAY },
          isCancelled: false,
        },
      }),

      // Meetings without documents
      prisma.meeting.count({
        where: {
          organizerStaffId: staff.id,
          meetingDate: { lt: TODAY },
          isCancelled: false,
          documents: { none: {} },
        },
      }),

      // Total participants across all meetings
      prisma.meetingMember.count({
        where: {
          meeting: {
            organizerStaffId: staff.id,
          },
        },
      }),

      // This week's meetings
      prisma.meeting.count({
        where: {
          organizerStaffId: staff.id,
          meetingDate: {
            gte: TODAY,
            lt: weekFromNow,
          },
          isCancelled: false,
        },
      }),
    ]).then(
      ([
        myMeetings,
        upcomingMeetings,
        completedMeetings,
        pendingDocuments,
        totalParticipants,
        thisWeekMeetings,
      ]) => ({
        myMeetings,
        upcomingMeetings,
        completedMeetings,
        pendingDocuments,
        totalParticipants,
        thisWeekMeetings,
      })
    );
  }

  /* -----------------------------------------------------------
      CONVENER UPCOMING MEETINGS
  ----------------------------------------------------------- */
  static async getConvenerUpcomingMeetings(userId: number, limit = 5) {
    const staff = await prisma.staff.findFirst({
      where: { userId },
    });

    if (!staff) return [];

    const meetings = await prisma.meeting.findMany({
      where: {
        organizerStaffId: staff.id,
        meetingDate: { gte: TODAY },
        isCancelled: false,
      },
      include: {
        meetingType: true,
        venue: true,
        _count: {
          select: { meetingMembers: true },
        },
      },
      orderBy: { meetingDate: "asc" },
      take: limit,
    });

    return meetings.map((m) => ({
      id: m.id,
      title: m.meetingTitle,
      date: m.meetingDate.toISOString().split('T')[0],
      time: m.meetingStartTime || 'TBD',
      type: m.meetingType?.meetingTypeName || 'N/A',
      venue: m.venue?.venueName || 'N/A',
      participantsCount: m._count.meetingMembers,
    }));
  }

  /* -----------------------------------------------------------
      CONVENER RECENT MEETINGS
  ----------------------------------------------------------- */
  static async getConvenerRecentMeetings(userId: number, limit = 5) {
    const staff = await prisma.staff.findFirst({
      where: { userId },
    });

    if (!staff) return [];

    const meetings = await prisma.meeting.findMany({
      where: {
        organizerStaffId: staff.id,
      },
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
      title: m.meetingTitle,
      date: m.meetingDate.toISOString().split('T')[0],
      time: m.meetingStartTime || 'TBD',
      type: m.meetingType?.meetingTypeName || 'N/A',
      venue: m.venue?.venueName || 'N/A',
      status: m.isCancelled
        ? "cancelled"
        : m.meetingDate < TODAY
        ? "completed"
        : "scheduled",
      convener: m.organizer?.staffName,
    }));
  }

  /* -----------------------------------------------------------
      CONVENER PENDING TASKS
  ----------------------------------------------------------- */
  static async getConvenerPendingTasks(userId: number) {
    const staff = await prisma.staff.findFirst({
      where: { userId },
    });

    if (!staff) return [];

    const meetingsWithoutDocuments = await prisma.meeting.findMany({
      where: {
        organizerStaffId: staff.id,
        meetingDate: { lt: TODAY },
        isCancelled: false,
        documents: { none: {} },
      },
      orderBy: { meetingDate: "desc" },
      take: 5,
    });

    return meetingsWithoutDocuments.map((m) => ({
      title: "Upload MOM document",
      meetingTitle: m.meetingTitle,
      dueDate: m.meetingDate.toISOString().split('T')[0],
      meetingId: m.id,
    }));
  }

  /* -----------------------------------------------------------
      SYSTEM ACTIVITY (for Admin)
  ----------------------------------------------------------- */
  static async getSystemActivity(limit = 10) {
    // Get recent meetings and documents as activities
    const recentMeetings = await prisma.meeting.findMany({
      include: {
        organizer: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit / 2,
    });

    const recentDocuments = await prisma.document.findMany({
      include: {
        meeting: true,
        uploader: true,
      },
      orderBy: { uploadedAt: "desc" },
      take: limit / 2,
    });

    const activities = [
      ...recentMeetings.map((m) => ({
        id: m.id,
        action: `Meeting "${m.meetingTitle}" created`,
        user: m.organizer?.staffName || 'System',
        timestamp: m.createdAt?.toLocaleString() || 'N/A',
        type: 'meeting' as const,
      })),
      ...recentDocuments.map((d) => ({
        id: d.id,
        action: `Document uploaded for "${d.meeting.meetingTitle}"`,
        user: d.uploader?.username || 'System',
        timestamp: d.uploadedAt.toLocaleString(),
        type: 'document' as const,
      })),
    ];

    // Sort by timestamp and return
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /* -----------------------------------------------------------
      MEETINGS PER MONTH (Last 6 months for admin dashboard)
  ----------------------------------------------------------- */
  static async getMeetingsPerMonth(months = 6) {
    const now = new Date();
    const monthsData = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const count = await prisma.meeting.count({
        where: {
          meetingDate: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      monthsData.push({
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        meetings: count,
      });
    }

    return monthsData;
  }

  /* -----------------------------------------------------------
      ATTENDANCE TREND (Last 6 months)
  ----------------------------------------------------------- */
  static async getAttendanceTrend(months = 6) {
    const now = new Date();
    const trendData = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      // Get all meetings in this month that have passed
      const meetings = await prisma.meeting.findMany({
        where: {
          meetingDate: {
            gte: date,
            lt: nextDate,
          },
          isCancelled: false,
        },
        include: {
          meetingMembers: true,
        },
      });

      // Calculate attendance percentage
      let totalMembers = 0;
      let presentMembers = 0;

      meetings.forEach(meeting => {
        totalMembers += meeting.meetingMembers.length;
        presentMembers += meeting.meetingMembers.filter(m => m.isPresent).length;
      });

      const attendanceRate = totalMembers > 0 
        ? Math.round((presentMembers / totalMembers) * 100) 
        : 0;

      trendData.push({
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        attendance: attendanceRate,
      });
    }

    return trendData;
  }

  /* -----------------------------------------------------------
      OVERALL ATTENDANCE PERCENTAGE FOR ADMIN DASHBOARD
  ----------------------------------------------------------- */
  static async getOverallAttendance() {
    const allMembers = await prisma.meetingMember.findMany({
      where: {
        meeting: {
          isCancelled: false,
        },
      },
    });

    if (allMembers.length === 0) return 0;

    const presentCount = allMembers.filter(m => m.isPresent).length;
    return Math.round((presentCount / allMembers.length) * 100);
  }
}

