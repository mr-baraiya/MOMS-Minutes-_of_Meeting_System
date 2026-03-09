import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { errorResponse, handleApiError, successResponse } from "@/lib/api-utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * POST /api/auth/profile-photo
 * Upload and update profile photo for current user
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return errorResponse("Profile photo file is required", 400);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse("Only JPG, PNG, or WEBP images are allowed", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("Profile photo must be 5MB or smaller", 400);
    }

    const extension = file.name.split(".").pop() || "png";
    const blobName = `profile-photos/user-${user.userId}-${Date.now()}.${extension}`;

    const blob = await put(blobName, file, {
      access: "public",
      contentType: file.type,
    });

    await prisma.user.update({
      where: { id: user.userId },
      data: { profilePicture: blob.url },
    });

    return successResponse({ profilePicture: blob.url }, "Profile photo updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
