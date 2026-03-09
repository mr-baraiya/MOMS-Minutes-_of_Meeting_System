import { NextRequest } from "next/server";
import { MeetingService, NotificationService } from "@/services";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  handleApiError,
  parsePaginationParams,
} from "@/lib/api-utils";
import { getUserFromRequest, createAuthError } from "@/lib/auth";
import { MeetingFilters } from "@/types";

/**
 * GET /api/meetings
 * Get all meetings with filters
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = getUserFromRequest(request);
    if (!currentUser) {
      return createAuthError("Unauthorized", 401);
    }

    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePaginationParams(searchParams);

    const filters: MeetingFilters = {
      page,
      limit,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      meetingTypeId: searchParams.get("meetingTypeId")
        ? parseInt(searchParams.get("meetingTypeId")!, 10)
        : undefined,
      venueId: searchParams.get("venueId")
        ? parseInt(searchParams.get("venueId")!, 10)
        : undefined,
      isCancelled: searchParams.has("isCancelled")
        ? searchParams.get("isCancelled") === "true"
        : undefined,
      search: searchParams.get("search") || undefined,
    };

    // Role-based scoping
    if (currentUser.role === "convener") {
      if (!currentUser.staffId) {
        return errorResponse("Convener staff id missing", 400);
      }
      // Convener sees meetings they organized OR were added to as member
      filters.convenerStaffId = currentUser.staffId;
    } else if (currentUser.role === "staff") {
      if (!currentUser.staffId) {
        return errorResponse("Staff id missing", 400);
      }
      filters.memberStaffId = currentUser.staffId;
    } else if (currentUser.role === "admin") {
      // allow optional organizer filter if provided explicitly
      if (searchParams.get("organizerStaffId")) {
        filters.organizerStaffId = parseInt(searchParams.get("organizerStaffId")!, 10);
      }
    }

    const result = await MeetingService.getAll(filters);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/meetings
 * Create a new meeting
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.meetingTitle) {
      return errorResponse("Meeting title is required");
    }
    if (!body.meetingDate) {
      return errorResponse("Meeting date is required");
    }
    if (!body.meetingStartTime) {
      return errorResponse("Meeting start time is required");
    }
    if (!body.meetingEndTime) {
      return errorResponse("Meeting end time is required");
    }
    if (!body.organizerStaffId) {
      return errorResponse("Organizer is required");
    }

    // Validate end time is after start time
    if (new Date(body.meetingEndTime) <= new Date(body.meetingStartTime)) {
      return errorResponse("End time must be after start time");
    }

    const meeting = await MeetingService.create(body);

    // Send notifications to meeting members
    if (meeting && body.memberIds && body.memberIds.length > 0) {
      try {
        // Get user IDs for all staff members
        const staffMembers = await Promise.all(
          body.memberIds.map(async (staffId: number) => {
            const staff = await prisma?.staff.findUnique({
              where: { id: staffId },
              select: { userId: true },
            });
            return staff?.userId;
          })
        );

        const validUserIds = staffMembers.filter((id): id is number => id !== undefined);
        
        if (validUserIds.length > 0) {
          await NotificationService.notifyMeetingCreated(
            meeting.id,
            meeting.meetingTitle,
            validUserIds
          );
        }
      } catch (notifError) {
        console.error('Failed to send notifications:', notifError);
        // Don't fail the meeting creation if notification fails
      }
    }

    return successResponse(meeting, "Meeting created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
