import { prisma } from "@/lib/prisma";
import { CreateDepartmentRequest, UpdateDepartmentRequest } from "@/types";

export class DepartmentService {
  /**
   * Get all departments
   */
  static async getAll(includeInactive = false) {
    return prisma.department.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: { staff: true },
        },
      },
      orderBy: { departmentName: "asc" },
    });
  }

  /**
   * Get department by ID
   */
  static async getById(id: number) {
    return prisma.department.findUnique({
      where: { id },
      include: {
        staff: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: { staff: true },
        },
      },
    });
  }

  /**
   * Create department
   */
  static async create(data: CreateDepartmentRequest) {
    return prisma.department.create({
      data: {
        departmentName: data.departmentName,
      },
    });
  }

  /**
   * Update department
   */
  static async update(id: number, data: UpdateDepartmentRequest) {
    return prisma.department.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete department (soft delete)
   */
  static async delete(id: number) {
    return prisma.department.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Check if department name exists
   */
  static async existsByName(name: string, excludeId?: number) {
    const department = await prisma.department.findUnique({
      where: { departmentName: name },
    });
    return department && department.id !== excludeId;
  }
}
