import { NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = path.extname(file.name) || ".png";
    const fileName = `user-${user.userId}-${Date.now()}${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "profile-photos");
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/profile-photos/${fileName}`;

    await prisma.user.update({
      where: { id: user.userId },
      data: { profilePicture: publicUrl },
    });

    return successResponse({ profilePicture: publicUrl }, "Profile photo updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
