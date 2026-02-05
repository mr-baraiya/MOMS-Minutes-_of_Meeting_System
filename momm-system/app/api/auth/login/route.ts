import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { z } from "zod";

/**
 * POST /api/auth/login
 * Authenticate user with JWT
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validatedData = loginSchema.parse(body);

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: validatedData.username },
      include: {
        staff: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse("Invalid username or password", 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse("Your account has been deactivated. Please contact an administrator.", 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(validatedData.password, user.passwordHash);

    if (!isPasswordValid) {
      return errorResponse("Invalid username or password", 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role.toLowerCase() as 'admin' | 'convener' | 'staff',
      staffId: user.staff?.id,
    });

    // Create response with token in both body and httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role.toLowerCase() as 'admin' | 'convener' | 'staff',
            staff: user.staff ? {
              id: user.staff.id,
              name: user.staff.staffName,
              department: user.staff.department?.departmentName,
            } : null,
          },
        },
      },
      { status: 200 }
    );

    // Set httpOnly cookie for security
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
      return errorResponse(error.errors[0].message, 400);
    }
    return handleApiError(error);
  }
}
