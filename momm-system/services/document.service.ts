import { prisma } from "@/lib/prisma";
import { UploadDocumentRequest } from "@/types";
import { Role } from "@prisma/client";

interface DocumentFilters {
  search?: string;
  meetingId?: number;
  departmentId?: number;
  uploadedBy?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export class DocumentService {
  /**
   * Get all documents with comprehensive filters (Admin view)
   */
  static async getAllWithFilters(filters?: DocumentFilters) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { documentTitle: { contains: filters.search, mode: "insensitive" } },
        { fileName: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.meetingId) {
      where.meetingId = filters.meetingId;
    }

    if (filters?.uploadedBy) {
      where.uploadedBy = filters.uploadedBy;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.uploadedAt = {};
      if (filters.dateFrom) where.uploadedAt.gte = filters.dateFrom;
      if (filters.dateTo) where.uploadedAt.lte = filters.dateTo;
    }

    // Department filter through meeting organizer
    if (filters?.departmentId) {
      where.meeting = {
        organizer: {
          departmentId: filters.departmentId,
        },
      };
    }

    return prisma.document.findMany({
      where,
      include: {
        meeting: {
          select: {
            id: true,
            meetingTitle: true,
            meetingDate: true,
            organizer: {
              select: {
                staffName: true,
                department: {
                  select: {
                    departmentName: true,
                  },
                },
              },
            },
          },
        },
        uploader: {
          select: {
            id: true,
            username: true,
            email: true,
            staff: {
              select: {
                staffName: true,
                department: {
                  select: {
                    departmentName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });
  }

  /**
   * Get documents for convener's meetings only
   */
  static async getByConvenerId(staffId: number, filters?: DocumentFilters) {
    const where: any = {
      meeting: {
        organizerStaffId: staffId,
      },
    };

    if (filters?.search) {
      where.OR = [
        { documentTitle: { contains: filters.search, mode: "insensitive" } },
        { fileName: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.meetingId) {
      where.meetingId = filters.meetingId;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.uploadedAt = {};
      if (filters.dateFrom) where.uploadedAt.gte = filters.dateFrom;
      if (filters.dateTo) where.uploadedAt.lte = filters.dateTo;
    }

    return prisma.document.findMany({
      where,
      include: {
        meeting: {
          select: {
            id: true,
            meetingTitle: true,
            meetingDate: true,
            organizer: {
              select: {
                staffName: true,
              },
            },
          },
        },
        uploader: {
          select: {
            id: true,
            username: true,
            staff: {
              select: {
                staffName: true,
              },
            },
          },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });
  }

  /**
   * Get documents for meetings where staff is a member
   */
  static async getByStaffMembership(staffId: number, filters?: DocumentFilters) {
    const where: any = {
      meeting: {
        meetingMembers: {
          some: {
            staffId,
          },
        },
      },
    };

    if (filters?.search) {
      where.OR = [
        { documentTitle: { contains: filters.search, mode: "insensitive" } },
        { fileName: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.meetingId) {
      where.meetingId = filters.meetingId;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.uploadedAt = {};
      if (filters.dateFrom) where.uploadedAt.gte = filters.dateFrom;
      if (filters.dateTo) where.uploadedAt.lte = filters.dateTo;
    }

    return prisma.document.findMany({
      where,
      include: {
        meeting: {
          select: {
            id: true,
            meetingTitle: true,
            meetingDate: true,
            organizer: {
              select: {
                staffName: true,
              },
            },
          },
        },
        uploader: {
          select: {
            id: true,
            username: true,
            staff: {
              select: {
                staffName: true,
              },
            },
          },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });
  }

  /**
   * Get all documents for a meeting
   */
  static async getByMeetingId(meetingId: number) {
    return prisma.document.findMany({
      where: { meetingId },
      include: {
        uploader: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });
  }

  /**
   * Get document by ID with full relations
   */
  static async getById(id: number) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        meeting: {
          include: {
            organizer: {
              select: {
                id: true,
                staffName: true,
                department: {
                  select: {
                    departmentName: true,
                  },
                },
              },
            },
          },
        },
        uploader: {
          select: {
            id: true,
            username: true,
            email: true,
            staff: {
              select: {
                staffName: true,
                department: {
                  select: {
                    departmentName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get recent documents
   */
  static async getRecent(limit = 10) {
    return prisma.document.findMany({
      include: {
        meeting: {
          select: {
            id: true,
            meetingTitle: true,
            meetingDate: true,
          },
        },
        uploader: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { uploadedAt: "desc" },
      take: limit,
    });
  }

  /**
   * Create document record
   */
  static async create(data: UploadDocumentRequest) {
    return prisma.document.create({
      data: {
        meetingId: data.meetingId,
        documentTitle: data.documentTitle,
        fileName: data.fileName,
        filePath: data.filePath,
        uploadedBy: data.uploadedBy,
      },
      include: {
        meeting: {
          select: {
            id: true,
            meetingTitle: true,
            meetingDate: true,
          },
        },
        uploader: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * Update document
   */
  static async update(
    id: number,
    data: { documentTitle?: string; fileName?: string; filePath?: string }
  ) {
    return prisma.document.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete document
   */
  static async delete(id: number) {
    return prisma.document.delete({
      where: { id },
    });
  }

  /**
   * Bulk delete documents (Admin only)
   */
  static async bulkDelete(ids: number[]) {
    return prisma.document.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  /**
   * Get documents uploaded by user
   */
  static async getByUserId(userId: number, limit = 10) {
    return prisma.document.findMany({
      where: { uploadedBy: userId },
      include: {
        meeting: {
          select: {
            id: true,
            meetingTitle: true,
            meetingDate: true,
          },
        },
      },
      orderBy: { uploadedAt: "desc" },
      take: limit,
    });
  }

  /**
   * Check if user can manage document (delete/update)
   */
  static async canManageDocument(
    documentId: number,
    userId: number,
    userRole: Role,
    staffId?: number
  ): Promise<boolean> {
    // Admin can manage all documents
    if (userRole === "ADMIN") {
      return true;
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        meeting: {
          select: {
            organizerStaffId: true,
          },
        },
      },
    });

    if (!document) return false;

    // Convener can manage documents for their meetings
    if (
      userRole === "CONVENER" &&
      staffId &&
      document.meeting.organizerStaffId === staffId
    ) {
      return true;
    }

    // Staff cannot manage documents
    return false;
  }

  /**
   * Get document count by meeting
   */
  static async countByMeeting(meetingId: number) {
    return prisma.document.count({
      where: { meetingId },
    });
  }

  /**
   * Get document statistics
   */
  static async getStatistics() {
    const totalDocuments = await prisma.document.count();
    const documentsThisMonth = await prisma.document.count({
      where: {
        uploadedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });
    const documentsThisWeek = await prisma.document.count({
      where: {
        uploadedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return {
      totalDocuments,
      documentsThisMonth,
      documentsThisWeek,
    };
  }

  /**
   * Get meetings that have the convener as organizer (for dropdown)
   */
  static async getConvenerMeetings(staffId: number) {
    return prisma.meeting.findMany({
      where: {
        organizerStaffId: staffId,
        isCancelled: false,
      },
      select: {
        id: true,
        meetingTitle: true,
        meetingDate: true,
      },
      orderBy: { meetingDate: "desc" },
    });
  }
}
