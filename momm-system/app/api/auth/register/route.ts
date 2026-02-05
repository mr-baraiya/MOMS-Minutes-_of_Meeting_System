import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { errorResponse, handleApiError } from "@/lib/api-utils";
import { z } from "zod";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validatedData = registerSchema.parse(body);

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (existingUser) {
      return errorResponse("Username already exists", 409);
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      return errorResponse("Email already exists", 409);
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user and staff record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user - All new users default to staff role
      // Admin can change roles later through user management
      const user = await tx.user.create({
        data: {
          username: validatedData.username,
          email: validatedData.email,
          passwordHash,
          role: validatedData.role || 'STAFF', // Use validated role or default to STAFF
          isActive: true,
        },
      });

      // Create staff record if staffName is provided
      let staff = null;
      if (validatedData.staffName) {
        staff = await tx.staff.create({
          data: {
            staffName: validatedData.staffName,
            emailAddress: validatedData.email, // Use user email for staff record
            userId: user.id,
            departmentId: validatedData.departmentId || null,
            isActive: true,
          },
        });
      }

      return { user, staff };
    });

    // Generate JWT token
    const token = generateToken({
      userId: result.user.id,
      username: result.user.username,
      role: result.user.role.toLowerCase() as 'admin' | 'convener' | 'staff',
      staffId: result.staff?.id,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: {
          token,
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role.toLowerCase() as 'admin' | 'convener' | 'staff',
            staff: result.staff ? {
              id: result.staff.id,
              name: result.staff.staffName,
            } : null,
          },
        },
      },
      { status: 201 }
    );

    // Set httpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0].message, 400);
    }
    return handleApiError(error);
  }
}
