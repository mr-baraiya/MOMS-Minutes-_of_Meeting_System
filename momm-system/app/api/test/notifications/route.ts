import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-utils";

/**
 * GET /api/test/notifications
 * Simple test endpoint to verify notifications functionality
 */
export async function GET(request: NextRequest) {
  try {
    return successResponse({
      message: "Notifications API test endpoint",
      timestamp: new Date().toISOString(),
      status: "OK"
    });
  } catch (error) {
    return errorResponse("Test endpoint failed", 500);
  }
}