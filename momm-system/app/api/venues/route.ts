import { NextRequest } from "next/server";
import { VenueService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

/**
 * GET /api/venues
 * Get all venues
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get("includeInactive") === "true";
    const venueType = searchParams.get("type") as "PHYSICAL" | "VIRTUAL" | null;

    if (venueType) {
      const venues = await VenueService.getByType(venueType);
      return successResponse(venues);
    }

    const venues = await VenueService.getAll(includeInactive);
    return successResponse(venues);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/venues
 * Create a new venue
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.venueName) {
      return errorResponse("Venue name is required");
    }

    const venue = await VenueService.create({
      venueName: body.venueName,
      venueType: body.venueType,
      location: body.location,
    });

    return successResponse(venue, "Venue created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
