import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";

/**
 * GET /api/search
 * Global search across meetings, documents, and staff
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.trim().length < 2) {
      return successResponse({
        meetings: [],
        documents: [],
        staff: [],
      });
    }

    const searchTerm = query.trim();

    // Search meetings
    const meetings = await prisma.meeting.findMany({
      where: {
        OR: [
          { meetingTitle: { contains: searchTerm, mode: "insensitive" } },
          { meetingDescription: { contains: searchTerm, mode: "insensitive" } },
        ],
        isCancelled: false,
      },
      take: limit,
      include: {
        meetingType: true,
        venue: true,
        organizer: {
          select: {
            id: true,
            staffName: true,
          },
        },
      },
      orderBy: { meetingDate: "desc" },
    });

    // Search documents
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { documentTitle: { contains: searchTerm, mode: "insensitive" } },
          { fileName: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: limit,
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
    });

    // Search staff
    const staff = await prisma.staff.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { staffName: { contains: searchTerm, mode: "insensitive" } },
              { emailAddress: { contains: searchTerm, mode: "insensitive" } },
              { designation: { contains: searchTerm, mode: "insensitive" } },
            ],
          },
        ],
      },
      take: limit,
      include: {
        department: {
          select: {
            id: true,
            departmentName: true,
          },
        },
      },
      orderBy: { staffName: "asc" },
    });

    return successResponse({
      meetings,
      documents,
      staff,
      query: searchTerm,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
