import prisma from "@/lib/prisma";
import {
  CreateMeetingRequest,
  UpdateMeetingRequest,
  CancelMeetingRequest,
  MeetingFilters,
} from "@/types";

export class MeetingService {
  /**
   * Get all meetings with filters and pagination
   */
  static async getAll(filters: MeetingFilters = {}) {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      meetingTypeId,
      organizerStaffId,
      venueId,
      isCancelled,
      search,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (startDate || endDate) {
      where.meetingDate = {};
      if (startDate) (where.meetingDate as Record<string, Date>).gte = new Date(startDate);
      if (endDate) (where.meetingDate as Record<string, Date>).lte = new Date(endDate);
    }

    if (meetingTypeId) where.meetingTypeId = meetingTypeId;
    if (organizerStaffId) where.organizerStaffId = organizerStaffId;
    if (venueId) where.venueId = venueId;
    if (isCancelled !== undefined) where.isCancelled = isCancelled;

    if (search) {
      where.OR = [
        { meetingTitle: { contains: search, mode: "insensitive" } },
        { meetingDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    const [meetings, total] = await Promise.all([
      prisma.meeting.findMany({
        where,
        skip,
        take: limit,
        include: {
          meetingType: true,
          organizer: {
            include: {
              department: true,
            },
          },
          venue: true,
          _count: {
            select: {
              meetingMembers: true,
              documents: true,
            },
          },
        },
        orderBy: { meetingDate: "desc" },
      }),
      prisma.meeting.count({ where }),
    ]);

    return {
      data: meetings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get upcoming meetings
   */
  static async getUpcoming(limit = 5) {
    const now = new Date();
    return prisma.meeting.findMany({
      where: {
        meetingDate: { gte: now },
        isCancelled: false,
      },
      include: {
        meetingType: true,
        organizer: true,
        venue: true,
      },
      orderBy: { meetingDate: "asc" },
      take: limit,
    });
  }

  /**
   * Get meetings for calendar view
   */
  static async getForCalendar(startDate: Date, endDate: Date) {
    return prisma.meeting.findMany({
      where: {
        meetingDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        meetingType: true,
        venue: true,
      },
      orderBy: { meetingStartTime: "asc" },
    });
  }

  /**
   * Get meeting by ID with all relations
   */
  static async getById(id: number) {
    return prisma.meeting.findUnique({
      where: { id },
      include: {
        meetingType: true,
        organizer: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
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
          orderBy: { staff: { staffName: "asc" } },
        },
        documents: {
          include: {
            uploader: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: { uploadedAt: "desc" },
        },
      },
    });
  }

  /**
   * Get meetings by staff (as member or organizer)
   */
  static async getByStaffId(staffId: number, params: MeetingFilters = {}) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { organizerStaffId: staffId },
        { meetingMembers: { some: { staffId } } },
      ],
    };

    const [meetings, total] = await Promise.all([
      prisma.meeting.findMany({
        where,
        skip,
        take: limit,
        include: {
          meetingType: true,
          organizer: true,
          venue: true,
          meetingMembers: {
            where: { staffId },
          },
        },
        orderBy: { meetingDate: "desc" },
      }),
      prisma.meeting.count({ where }),
    ]);

    return {
      data: meetings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create meeting
   */
  static async create(data: CreateMeetingRequest) {
    const meeting = await prisma.meeting.create({
      data: {
        meetingTitle: data.meetingTitle,
        meetingDescription: data.meetingDescription,
        meetingDate: new Date(data.meetingDate),
        meetingStartTime: new Date(data.meetingStartTime),
        meetingEndTime: new Date(data.meetingEndTime),
        meetingTypeId: data.meetingTypeId,
        organizerStaffId: data.organizerStaffId,
        venueId: data.venueId,
        meetingLink: data.meetingLink,
      },
      include: {
        meetingType: true,
        organizer: true,
        venue: true,
      },
    });

    // Add members if provided
    if (data.memberIds && data.memberIds.length > 0) {
      await prisma.meetingMember.createMany({
        data: data.memberIds.map((staffId) => ({
          meetingId: meeting.id,
          staffId,
        })),
      });
    }

    return this.getById(meeting.id);
  }

  /**
   * Update meeting
   */
  static async update(id: number, data: UpdateMeetingRequest) {
    const updateData: Record<string, unknown> = {};

    if (data.meetingTitle) updateData.meetingTitle = data.meetingTitle;
    if (data.meetingDescription !== undefined)
      updateData.meetingDescription = data.meetingDescription;
    if (data.meetingDate) updateData.meetingDate = new Date(data.meetingDate);
    if (data.meetingStartTime)
      updateData.meetingStartTime = new Date(data.meetingStartTime);
    if (data.meetingEndTime)
      updateData.meetingEndTime = new Date(data.meetingEndTime);
    if (data.meetingTypeId !== undefined)
      updateData.meetingTypeId = data.meetingTypeId;
    if (data.organizerStaffId !== undefined)
      updateData.organizerStaffId = data.organizerStaffId;
    if (data.venueId !== undefined) updateData.venueId = data.venueId;
    if (data.meetingLink !== undefined) updateData.meetingLink = data.meetingLink;

    return prisma.meeting.update({
      where: { id },
      data: updateData,
      include: {
        meetingType: true,
        organizer: true,
        venue: true,
      },
    });
  }

  /**
   * Cancel meeting
   */
  static async cancel(id: number, data: CancelMeetingRequest) {
    return prisma.meeting.update({
      where: { id },
      data: {
        isCancelled: true,
        cancellationReason: data.cancellationReason,
        cancelledAt: new Date(),
      },
    });
  }

  /**
   * Delete meeting
   */
  static async delete(id: number) {
    return prisma.meeting.delete({
      where: { id },
    });
  }
}
