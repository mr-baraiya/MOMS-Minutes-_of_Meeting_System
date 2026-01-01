import { NextRequest } from "next/server";
import { StaffService } from "@/services";
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
 * GET /api/staff/[id]
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const staffId = parseId(id);
    if (!staffId) {
      return errorResponse("Invalid staff ID");
    }

    const staff = await StaffService.getById(staffId);
    if (!staff) {
      return errorResponse("Staff not found", 404);
    }

    return successResponse(staff);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/staff/[id]
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const staffId = parseId(id);
    if (!staffId) {
      return errorResponse("Invalid staff ID");
    }

    const body = await request.json();

    if (body.emailAddress) {
      const exists = await StaffService.existsByEmail(body.emailAddress, staffId);
      if (exists) {
        return errorResponse("Email already exists", 409);
      }
    }

    const staff = await StaffService.update(staffId, body);
    return successResponse(staff, "Staff updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/staff/[id]
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const staffId = parseId(id);
    if (!staffId) {
      return errorResponse("Invalid staff ID");
    }

    await StaffService.delete(staffId);
    return successResponse(null, "Staff deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
