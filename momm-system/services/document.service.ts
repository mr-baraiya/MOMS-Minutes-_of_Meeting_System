import { prisma } from "@/lib/prisma";
import { UploadDocumentRequest } from "@/types";

export class DocumentService {
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
   * Get document by ID
   */
  static async getById(id: number) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        meeting: true,
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
        meeting: true,
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
}
