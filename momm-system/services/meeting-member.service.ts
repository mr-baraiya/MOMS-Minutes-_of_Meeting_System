import prisma from "@/lib/prisma";
import {
  AddMeetingMemberRequest,
  MarkAttendanceRequest,
  BulkMarkAttendanceRequest,
} from "@/types";

export class MeetingMemberService {
  /**
   * Get all members of a meeting
   */
  static async getByMeetingId(meetingId: number) {
    return prisma.meetingMember.findMany({
      where: { meetingId },
      include: {
        staff: {
          include: {
            department: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { staff: { staffName: "asc" } },
    });
  }

  /**
   * Get attendance summary for a meeting
   */
  static async getAttendanceSummary(meetingId: number) {
    const members = await prisma.meetingMember.findMany({
      where: { meetingId },
      include: {
        staff: {
          select: {
            id: true,
            staffName: true,
            designation: true,
          },
        },
      },
    });

    const total = members.length;
    const present = members.filter((m) => m.isPresent).length;
    const absent = total - present;

    return {
      total,
      present,
      absent,
      attendancePercentage: total > 0 ? Math.round((present / total) * 100) : 0,
      members: members.map((m) => ({
        id: m.id,
        staffId: m.staffId,
        staffName: m.staff.staffName,
        designation: m.staff.designation,
        isPresent: m.isPresent,
        attendanceMarkedAt: m.attendanceMarkedAt,
        remarks: m.remarks,
      })),
    };
  }

  /**
   * Add member to meeting
   */
  static async addMember(meetingId: number, data: AddMeetingMemberRequest) {
    return prisma.meetingMember.create({
      data: {
        meetingId,
        staffId: data.staffId,
        remarks: data.remarks,
      },
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
   * Add multiple members to meeting
   */
  static async addMembers(meetingId: number, staffIds: number[]) {
    // Filter out existing members
    const existingMembers = await prisma.meetingMember.findMany({
      where: {
        meetingId,
        staffId: { in: staffIds },
      },
      select: { staffId: true },
    });

    const existingStaffIds = new Set(existingMembers.map((m) => m.staffId));
    const newStaffIds = staffIds.filter((id) => !existingStaffIds.has(id));

    if (newStaffIds.length === 0) {
      return { count: 0 };
    }

    return prisma.meetingMember.createMany({
      data: newStaffIds.map((staffId) => ({
        meetingId,
        staffId,
      })),
    });
  }

  /**
   * Remove member from meeting
   */
  static async removeMember(meetingId: number, staffId: number) {
    return prisma.meetingMember.delete({
      where: {
        meetingId_staffId: {
          meetingId,
          staffId,
        },
      },
    });
  }

  /**
   * Mark attendance for a member
   */
  static async markAttendance(data: MarkAttendanceRequest) {
    return prisma.meetingMember.update({
      where: { id: data.memberId },
      data: {
        isPresent: data.isPresent,
        attendanceMarkedAt: new Date(),
        remarks: data.remarks,
      },
      include: {
        staff: true,
      },
    });
  }

  /**
   * Bulk mark attendance
   */
  static async bulkMarkAttendance(
    meetingId: number,
    data: BulkMarkAttendanceRequest
  ) {
    const results = await Promise.all(
      data.attendance.map((item) =>
        prisma.meetingMember.update({
          where: { id: item.memberId },
          data: {
            isPresent: item.isPresent,
            attendanceMarkedAt: new Date(),
            remarks: item.remarks,
          },
        })
      )
    );

    return results;
  }

  /**
   * Check if staff is member of meeting
   */
  static async isMember(meetingId: number, staffId: number) {
    const member = await prisma.meetingMember.findUnique({
      where: {
        meetingId_staffId: {
          meetingId,
          staffId,
        },
      },
    });
    return !!member;
  }
}
