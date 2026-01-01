import { NextRequest } from "next/server";
import { StaffService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
  parsePaginationParams,
} from "@/lib/api-utils";

/**
 * GET /api/staff
 * Get all staff with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit } = parsePaginationParams(searchParams);
    const departmentId = searchParams.get("departmentId");
    const all = searchParams.get("all") === "true";

    // Return all active staff for dropdowns
    if (all) {
      const staff = await StaffService.getAllActive();
      return successResponse(staff);
    }

    const result = await StaffService.getAll({
      page,
      limit,
      departmentId: departmentId ? parseInt(departmentId, 10) : undefined,
    });

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/staff
 * Create new staff
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.userId || !body.staffName || !body.emailAddress) {
      return errorResponse("User ID, staff name, and email are required");
    }

    // Check if email exists
    const exists = await StaffService.existsByEmail(body.emailAddress);
    if (exists) {
      return errorResponse("Email already exists", 409);
    }

    const staff = await StaffService.create(body);
    return successResponse(staff, "Staff created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
