import { NextRequest } from "next/server";
import { VenueService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseId,
} from "@/lib/api-utils";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/venues/[id]
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const venueId = parseId(id);
    if (!venueId) {
      return errorResponse("Invalid venue ID");
    }

    const venue = await VenueService.getById(venueId);
    if (!venue) {
      return errorResponse("Venue not found", 404);
    }

    return successResponse(venue);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/venues/[id]
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const venueId = parseId(id);
    if (!venueId) {
      return errorResponse("Invalid venue ID");
    }

    const body = await request.json();
    const venue = await VenueService.update(venueId, body);
    return successResponse(venue, "Venue updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/venues/[id]
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const venueId = parseId(id);
    if (!venueId) {
      return errorResponse("Invalid venue ID");
    }

    await VenueService.delete(venueId);
    return successResponse(null, "Venue deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
