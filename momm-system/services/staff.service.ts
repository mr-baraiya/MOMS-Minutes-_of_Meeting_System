import { prisma } from "@/lib/prisma";
import {
  CreateStaffRequest,
  UpdateStaffRequest,
  PaginationParams,
} from "@/types";

export class StaffService {
  /**
   * Get all staff with pagination
   */
  static async getAll(params: PaginationParams & { departmentId?: number; includeInactive?: boolean } = {}) {
    const { page = 1, limit = 10, departmentId, includeInactive = false } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (!includeInactive) {
      where.isActive = true;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where,
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
   * Get staff by ID
   */
  static async getById(id: number) {
    return prisma.staff.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
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
   * Delete staff permanently
   */
  static async deletePermanently(id: number) {
    // First get the userId associated with the staff to delete the user account too
    const staff = await prisma.staff.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (staff && staff.userId) {
      // Delete user first (cascade might rely on relation) - actually easier to delete user if cascade is set
      // Schema says: user User @relation(fields: [userId], references: [id], onDelete: Cascade) in Staff model? No.
      // In User model: staff Staff?
      // In Staff model: user User @relation(fields: [userId], references: [id], onDelete: Cascade)
      
      // So if we delete User, Staff is deleted.
      // But we are deleting Staff here.
      
      // If we delete staff, the user remains. We probably want to delete the user too for a clean cleanup?
      // "Permanently delete inactive staff" likely implies full removal.
      
      return prisma.$transaction([
        prisma.staff.delete({ where: { id } }),
        prisma.user.delete({ where: { id: staff.userId } })
      ]);
    }
    
    return prisma.staff.delete({
      where: { id },
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
