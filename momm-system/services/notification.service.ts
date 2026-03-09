import { prisma } from "@/lib/prisma";

export type NotificationType = 
  | "MEETING_CREATED"
  | "MEETING_UPDATED"
  | "MEETING_CANCELLED"
  | "ATTENDANCE_MARKED"
  | "DOCUMENT_UPLOADED"
  | "REPORT_GENERATED"
  | "SUPPORT_TICKET_UPDATED"
  | "GENERAL";

interface CreateNotificationData {
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  referenceId?: number;
}

export class NotificationService {
  /**
   * Create a single notification
   */
  static async create(data: CreateNotificationData) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        referenceId: data.referenceId,
      },
    });
  }

  /**
   * Create multiple notifications (bulk)
   */
  static async createMany(notifications: CreateNotificationData[]) {
    return prisma.notification.createMany({
      data: notifications,
    });
  }

  /**
   * Get notifications for a user
   */
  static async getByUserId(userId: number, limit = 20, unreadOnly = false) {
    try {
      return await prisma.notification.findMany({
        where: {
          userId,
          ...(unreadOnly && { isRead: false }),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    } catch (error) {
      console.error('NotificationService - getByUserId error:', error);
      throw error;
    }
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: number) {
    try {
      return await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });
    } catch (error) {
      console.error('NotificationService - getUnreadCount error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: number, userId: number) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns the notification
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: number) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Delete notification
   */
  static async delete(notificationId: number, userId: number) {
    return prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns the notification
      },
    });
  }

  /**
   * Notify meeting participants when meeting is created
   */
  static async notifyMeetingCreated(
    meetingId: number,
    meetingTitle: string,
    participantUserIds: number[]
  ) {
    const notifications = participantUserIds.map((userId) => ({
      userId,
      title: "New Meeting Scheduled",
      message: `You have been invited to "${meetingTitle}".`,
      type: "MEETING_CREATED" as NotificationType,
      referenceId: meetingId,
    }));

    return this.createMany(notifications);
  }

  /**
   * Notify when attendance is marked
   */
  static async notifyAttendanceMarked(
    meetingId: number,
    meetingTitle: string,
    adminUserId: number
  ) {
    return this.create({
      userId: adminUserId,
      title: "Attendance Marked",
      message: `Attendance has been marked for "${meetingTitle}".`,
      type: "ATTENDANCE_MARKED",
      referenceId: meetingId,
    });
  }

  /**
   * Notify when document is uploaded
   */
  static async notifyDocumentUploaded(
    meetingId: number,
    documentTitle: string,
    participantUserIds: number[]
  ) {
    const notifications = participantUserIds.map((userId) => ({
      userId,
      title: "New Document Uploaded",
      message: `A new document "${documentTitle}" has been uploaded.`,
      type: "DOCUMENT_UPLOADED" as NotificationType,
      referenceId: meetingId,
    }));

    return this.createMany(notifications);
  }

  /**
   * Notify when report is generated
   */
  static async notifyReportGenerated(
    reportId: number,
    reportName: string,
    userId: number
  ) {
    return this.create({
      userId,
      title: "Report Ready",
      message: `Your report "${reportName}" is ready to download.`,
      type: "REPORT_GENERATED",
      referenceId: reportId,
    });
  }

  /**
   * Notify when support ticket is updated
   */
  static async notifySupportTicketUpdated(
    ticketId: number,
    ticketSubject: string,
    userId: number
  ) {
    return this.create({
      userId,
      title: "Support Ticket Updated",
      message: `Your ticket "${ticketSubject}" has been updated.`,
      type: "SUPPORT_TICKET_UPDATED",
      referenceId: ticketId,
    });
  }
}
