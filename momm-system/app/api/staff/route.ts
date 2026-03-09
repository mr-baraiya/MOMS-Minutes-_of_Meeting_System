import { NextRequest } from "next/server";
import { StaffService } from "@/services";
import { prisma } from "@/lib/prisma";
import { Role } from "@/types";
import bcrypt from "bcryptjs";
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
    const includeInactive = searchParams.get("includeInactive") === "true";
    const roleFilter = searchParams.get("role") || undefined;

    // Return all active staff for dropdowns
    if (all) {
      const staff = await StaffService.getAllActive();
      return successResponse(staff);
    }

    const result = await StaffService.getAll({
      page,
      limit,
      departmentId: departmentId ? parseInt(departmentId, 10) : undefined,
      includeInactive,
      roleFilter,
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

    if (!body.staffName || !body.emailAddress) {
      return errorResponse("Staff name and email are required");
    }

    // Check if email exists
    const exists = await StaffService.existsByEmail(body.emailAddress);
    if (exists) {
      return errorResponse("Email already exists", 409);
    }

    let userId = body.userId;

    // If userId not provided, try to create a user account
    if (!userId && body.username && body.password) {
        // Check if username already exists
        const userExists = await prisma.user.findFirst({
            where: { 
                OR: [
                    { username: body.username },
                    { email: body.emailAddress }
                ]
            }
        });

        if (userExists) {
            return errorResponse("Username or email already associated with a user account", 409);
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = await prisma.user.create({
            data: {
                username: body.username,
                email: body.emailAddress,
                passwordHash: hashedPassword,
                role: Role.STAFF, // Default role
                isActive: true
            }
        });
        userId = newUser.id;
    }

    if (!userId) {
        return errorResponse("User ID is required or provide username/password to create a new user account");
    }

    const staffData = { ...body, userId };
    // Remove password/username from staff data if they exist to avoid schema errors if strict
    delete staffData.username;
    delete staffData.password;

    const staff = await StaffService.create(staffData);
    return successResponse(staff, "Staff created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
