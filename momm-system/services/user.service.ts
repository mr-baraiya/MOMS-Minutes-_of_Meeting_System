import prisma from "@/lib/prisma";
import {
  CreateUserRequest,
  UpdateUserRequest,
  PaginationParams,
} from "@/types";
import bcrypt from "bcrypt";

export class UserService {
  /**
   * Get all users with pagination
   */
  static async getAll(params: PaginationParams = {}) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        include: {
          staff: {
            include: {
              department: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  static async getById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        staff: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  /**
   * Get user by username
   */
  static async getByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      include: {
        staff: true,
      },
    });
  }

  /**
   * Get user by email
   */
  static async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        staff: true,
      },
    });
  }

  /**
   * Create new user
   */
  static async create(data: CreateUserRequest) {
    // Hash password with bcrypt (10 rounds)
    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
        role: data.role || "STAFF",
        profilePicture: data.profilePicture,
      },
      include: {
        staff: true,
      },
    });
  }

  /**
   * Update user
   */
  static async update(id: number, data: UpdateUserRequest) {
    const updateData: Record<string, unknown> = {};

    if (data.username) updateData.username = data.username;
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role;
    if (data.profilePicture !== undefined)
      updateData.profilePicture = data.profilePicture;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.password) {
      // Hash password with bcrypt (10 rounds)
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        staff: true,
      },
    });
  }

  /**
   * Delete user (soft delete by setting isActive to false)
   */
  static async delete(id: number) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Hard delete user
   */
  static async hardDelete(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
