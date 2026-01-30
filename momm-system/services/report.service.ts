import { prisma } from "@/lib/prisma";
import { GenerateReportRequest, ReportType } from "@/types";

export class ReportService {
  /**
   * Get all reports with pagination
   */
  static async getAll(params: { page?: number; limit?: number } = {}) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        skip,
        take: limit,
        include: {
          meeting: {
            select: {
              id: true,
              meetingTitle: true,
              meetingDate: true,
            },
          },
          generator: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: { generatedAt: "desc" },
      }),
      prisma.report.count(),
    ]);

    return {
      data: reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get reports by type
   */
  static async getByType(reportType: ReportType) {
    return prisma.report.findMany({
      where: { reportType },
      include: {
        meeting: true,
        generator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { generatedAt: "desc" },
    });
  }

  /**
   * Get report by ID
   */
  static async getById(id: number) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        meeting: {
          include: {
            meetingType: true,
            organizer: true,
            venue: true,
            meetingMembers: {
              include: {
                staff: true,
              },
            },
          },
        },
        generator: true,
      },
    });
  }

  /**
   * Get reports for a meeting
   */
  static async getByMeetingId(meetingId: number) {
    return prisma.report.findMany({
      where: { meetingId },
      include: {
        generator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { generatedAt: "desc" },
    });
  }

  /**
   * Create report record
   */
  static async create(data: GenerateReportRequest & { filePath: string; generatedBy: number }) {
    return prisma.report.create({
      data: {
        reportName: data.reportName,
        reportType: data.reportType,
        meetingId: data.meetingId,
        filePath: data.filePath,
        generatedBy: data.generatedBy,
      },
      include: {
        meeting: true,
        generator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * Delete report
   */
  static async delete(id: number) {
    return prisma.report.delete({
      where: { id },
    });
  }

  /**
   * Generate meeting summary data
   */
  static async getMeetingSummaryData(meetingId: number) {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        meetingType: true,
        organizer: {
          include: {
            department: true,
          },
        },
        venue: true,
        meetingMembers: {
          include: {
            staff: {
              include: {
                department: true,
              },
            },
          },
        },
        documents: true,
      },
    });

    if (!meeting) return null;

    const attendanceSummary = {
      total: meeting.meetingMembers.length,
      present: meeting.meetingMembers.filter((m) => m.isPresent).length,
      absent: meeting.meetingMembers.filter((m) => !m.isPresent).length,
    };

    return {
      meeting,
      attendanceSummary,
      documentsCount: meeting.documents.length,
    };
  }

  /**
   * Generate summary report data for date range
   */
  static async getSummaryReportData(startDate: Date, endDate: Date) {
    const meetings = await prisma.meeting.findMany({
      where: {
        meetingDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        meetingType: true,
        organizer: true,
        venue: true,
        meetingMembers: true,
        _count: {
          select: {
            meetingMembers: true,
            documents: true,
          },
        },
      },
      orderBy: { meetingDate: "asc" },
    });

    const totalMeetings = meetings.length;
    const completedMeetings = meetings.filter(
      (m) => !m.isCancelled && new Date(m.meetingDate) < new Date()
    ).length;
    const cancelledMeetings = meetings.filter((m) => m.isCancelled).length;
    const upcomingMeetings = meetings.filter(
      (m) => !m.isCancelled && new Date(m.meetingDate) >= new Date()
    ).length;

    const meetingsByType = meetings.reduce(
      (acc, m) => {
        const type = m.meetingType?.meetingTypeName || "Unknown";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      dateRange: { startDate, endDate },
      summary: {
        totalMeetings,
        completedMeetings,
        cancelledMeetings,
        upcomingMeetings,
      },
      meetingsByType,
      meetings,
    };
  }
}
