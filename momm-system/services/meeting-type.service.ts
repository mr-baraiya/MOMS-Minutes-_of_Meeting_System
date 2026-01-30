import { prisma } from "@/lib/prisma";
import { CreateMeetingTypeRequest, UpdateMeetingTypeRequest } from "@/types";

export class MeetingTypeService {
  /**
   * Get all meeting types
   */
  static async getAll(includeInactive = false) {
    return prisma.meetingType.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: { meetings: true },
        },
      },
      orderBy: { meetingTypeName: "asc" },
    });
  }

  /**
   * Get meeting type by ID
   */
  static async getById(id: number) {
    return prisma.meetingType.findUnique({
      where: { id },
      include: {
        meetings: {
          take: 10,
          orderBy: { meetingDate: "desc" },
        },
        _count: {
          select: { meetings: true },
        },
      },
    });
  }

  /**
   * Create meeting type
   */
  static async create(data: CreateMeetingTypeRequest) {
    return prisma.meetingType.create({
      data: {
        meetingTypeName: data.meetingTypeName,
      },
    });
  }

  /**
   * Update meeting type
   */
  static async update(id: number, data: UpdateMeetingTypeRequest) {
    return prisma.meetingType.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete meeting type (soft delete)
   */
  static async delete(id: number) {
    return prisma.meetingType.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Check if name exists
   */
  static async existsByName(name: string, excludeId?: number) {
    const meetingType = await prisma.meetingType.findUnique({
      where: { meetingTypeName: name },
    });
    return meetingType && meetingType.id !== excludeId;
  }
}
