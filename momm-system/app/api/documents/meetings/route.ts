import { NextRequest, NextResponse } from "next/server";
import { DocumentService } from "@/services/document.service";
import { getUserFromRequest } from "@/lib/auth";

/**
 * GET /api/documents/meetings
 * Get meetings available for document upload (based on role)
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Staff cannot upload documents
    if (user.role.toUpperCase() === "STAFF") {
      return NextResponse.json(
        { error: "Staff members cannot upload documents" },
        { status: 403 }
      );
    }

    let meetings;

    if (user.role.toUpperCase() === "CONVENER") {
      // Conveners can only upload to their own meetings
      let staffId = user.staffId;
      if (!staffId) {
        const { prisma } = await import("@/lib/prisma");
        const staffRecord = await prisma.staff.findFirst({
          where: { userId: user.userId },
          select: { id: true },
        });
        staffId = staffRecord?.id;
      }
      if (!staffId) {
        return NextResponse.json(
          { error: "Staff profile not found" },
          { status: 404 }
        );
      }
      meetings = await DocumentService.getConvenerMeetings(staffId);
    } else if (user.role.toUpperCase() === "ADMIN") {
      // Admins can upload to any meeting
      const { prisma } = await import("@/lib/prisma");
      meetings = await prisma.meeting.findMany({
        where: {
          isCancelled: false,
        },
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
        orderBy: { meetingDate: "desc" },
        take: 50,
      });
    }

    return NextResponse.json({ meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}
