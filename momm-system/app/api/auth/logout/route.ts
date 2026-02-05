import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Clear authentication token
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully",
    },
    { status: 200 }
  );

  // Clear the token cookie
  response.cookies.delete('token');

  return response;
}
