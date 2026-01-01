import { NextRequest } from "next/server";
import { DepartmentService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-utils";

/**
 * GET /api/departments
 * Get all departments
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get("includeInactive") === "true";

    const departments = await DepartmentService.getAll(includeInactive);
    return successResponse(departments);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/departments
 * Create a new department
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.departmentName) {
      return errorResponse("Department name is required");
    }

    // Check if name exists
    const exists = await DepartmentService.existsByName(body.departmentName);
    if (exists) {
      return errorResponse("Department name already exists", 409);
    }

    const department = await DepartmentService.create({
      departmentName: body.departmentName,
    });

    return successResponse(department, "Department created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
