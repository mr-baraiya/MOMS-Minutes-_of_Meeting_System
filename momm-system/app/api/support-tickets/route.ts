import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { errorResponse, handleApiError, successResponse } from "@/lib/api-utils";
import { supportTicketSchema } from "@/lib/validations";
import { z } from "zod";

/**
 * GET /api/support-tickets
 * List current user's support tickets
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(tickets);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/support-tickets
 * Create a support ticket for current user
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const validatedData = supportTicketSchema.parse(body);

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.userId,
        category: validatedData.category,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });

    return successResponse(ticket, "Support ticket created successfully");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0].message, 400);
    }
    return handleApiError(error);
  }
}
