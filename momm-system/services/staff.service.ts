import prisma from "@/lib/prisma";
import {
  CreateStaffRequest,
  UpdateStaffRequest,
  PaginationParams,
} from "@/types";

export class StaffService {
  /**
   * Get all staff with pagination
   */
  static async getAll(params: PaginationParams & { departmentId?: number } = {}) {
    const { page = 1, limit = 10, departmentId } = params;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(departmentId && { departmentId }),
    };

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
              isActive: true,
            },
          },
          department: true,
        },
        orderBy: { staffName: "asc" },
      }),
      prisma.staff.count({ where }),
    ]);

    return {
      data: staff,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all active staff (for dropdowns)
   */
  static async getAllActive() {
    return prisma.staff.findMany({
      where: { isActive: true },
      select: {
        id: true,
        staffName: true,
        designation: true,
        emailAddress: true,
        department: {
          select: {
            id: true,
            departmentName: true,
          },
        },
      },
      orderBy: { staffName: "asc" },
    });
  }

  /**
   * Get staff by ID
   */
  static async getById(id: number) {
    return prisma.staff.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        department: true,
        organizedMeetings: {
          take: 5,
          orderBy: { meetingDate: "desc" },
        },
        meetingMembers: {
          take: 5,
          include: {
            meeting: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Get staff by user ID
   */
  static async getByUserId(userId: number) {
    return prisma.staff.findUnique({
      where: { userId },
      include: {
        user: true,
        department: true,
      },
    });
  }

  /**
   * Create staff
   */
  static async create(data: CreateStaffRequest) {
    return prisma.staff.create({
      data: {
        userId: data.userId,
        staffName: data.staffName,
        designation: data.designation,
        mobileNo: data.mobileNo,
        emailAddress: data.emailAddress,
        departmentId: data.departmentId,
        profilePicture: data.profilePicture,
      },
      include: {
        user: true,
        department: true,
      },
    });
  }

  /**
   * Update staff
   */
  static async update(id: number, data: UpdateStaffRequest) {
    return prisma.staff.update({
      where: { id },
      data,
      include: {
        user: true,
        department: true,
      },
    });
  }

  /**
   * Delete staff (soft delete)
   */
  static async delete(id: number) {
    return prisma.staff.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Check if email exists
   */
  static async existsByEmail(email: string, excludeId?: number) {
    const staff = await prisma.staff.findUnique({
      where: { emailAddress: email },
    });
    return staff && staff.id !== excludeId;
  }
}
