import { NextRequest } from "next/server";
import { DepartmentService } from "@/services";
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
 * GET /api/departments/[id]
 * Get department by ID
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const departmentId = parseId(id);
    if (!departmentId) {
      return errorResponse("Invalid department ID");
    }

    const department = await DepartmentService.getById(departmentId);
    if (!department) {
      return errorResponse("Department not found", 404);
    }

    return successResponse(department);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/departments/[id]
 * Update department
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const departmentId = parseId(id);
    if (!departmentId) {
      return errorResponse("Invalid department ID");
    }

    const body = await request.json();

    // Check if name exists (excluding current)
    if (body.departmentName) {
      const exists = await DepartmentService.existsByName(
        body.departmentName,
        departmentId
      );
      if (exists) {
        return errorResponse("Department name already exists", 409);
      }
    }

    const department = await DepartmentService.update(departmentId, body);
    return successResponse(department, "Department updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/departments/[id]
 * Delete department (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const departmentId = parseId(id);
    if (!departmentId) {
      return errorResponse("Invalid department ID");
    }

    await DepartmentService.delete(departmentId);
    return successResponse(null, "Department deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
