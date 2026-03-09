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
 * Create a support ticket (authenticated users) or contact message (non-authenticated)
 */
export async function POST(request: NextRequest) {
  try {
    console.log("Support tickets API: Starting request processing...");
    const user = getUserFromRequest(request);
    const body = await request.json();
    
    console.log("Support tickets API: Request body received:", {
      hasUser: !!user,
      bodyKeys: Object.keys(body),
      userInfo: user ? { userId: user.userId, role: user.role } : null
    });

    // For authenticated users, create a full support ticket
    if (user) {
      console.log("Support tickets API: Processing authenticated user request");
      const validatedData = supportTicketSchema.parse(body);

      const ticket = await prisma.supportTicket.create({
        data: {
          userId: user.userId,
          category: validatedData.category,
          subject: validatedData.subject,
          message: validatedData.message,
        },
      });

      console.log("Support tickets API: Ticket created successfully:", ticket.id);
      return successResponse(ticket, "Support ticket created successfully");
    } 
    
    console.log("Support tickets API: Processing non-authenticated user request");
    // For non-authenticated users, validate basic contact form data
    const contactSchema = z.object({
      from_name: z.string().min(2, "Name must be at least 2 characters"),
      from_email: z.string().email("Invalid email address"),
      phone: z.string().optional(),
      category: z.enum(["MEETING_ISSUE", "ACCESS_LOGIN", "DOCUMENTS_MOM", "REPORTS", "OTHER"], {
        error: "Please select a valid category"
      }),
      subject: z.string().min(5, "Subject must be at least 5 characters"),
      message: z.string().min(10, "Message must be at least 10 characters"),
    });

    const validatedContactData = contactSchema.parse(body);

    // Create a generic support ticket for non-authenticated users
    // You might want to create a separate table for contact messages
    // For now, we'll create a support ticket with userId as null or create a guest user
    
    // Option: Log the contact message for manual processing
    console.log('Contact form submission:', {
      from_name: validatedContactData.from_name,
      from_email: validatedContactData.from_email,
      phone: validatedContactData.phone,
      category: validatedContactData.category,
      subject: validatedContactData.subject,
      message: validatedContactData.message,
      timestamp: new Date().toISOString()
    });

    console.log("Support tickets API: Contact form processed successfully");
    return successResponse(
      { 
        message: "Your message has been received. We'll respond within 24 hours.",
        submittedAt: new Date().toISOString() 
      }, 
      "Contact message received successfully"
    );

  } catch (error) {
    console.error("Support tickets API: Error occurred:", error);
    if (error instanceof z.ZodError) {
      console.log("Support tickets API: Validation error details:", error.issues);
      return errorResponse("Validation failed: " + error.issues.map(e => e.message).join(", "), 400);
    }
    return handleApiError(error);
  }
}
