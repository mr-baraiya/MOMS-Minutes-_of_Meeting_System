import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { errorResponse, handleApiError, successResponse } from "@/lib/api-utils";
import path from "path";
import { promises as fs } from "fs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function uploadFile(file: File, userId: number): Promise<string> {
  const extension = file.name.split(".").pop() || "png";
  const fileName = `user-${userId}-${Date.now()}.${extension}`;

  // Use Vercel Blob in production or when token is available
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`profile-photos/${fileName}`, file, {
        access: "public",
        contentType: file.type,
      });
      return blob.url;
    } catch (err) {
      // In dev, fall through to local storage if token is invalid
      if (process.env.NODE_ENV === "production") throw err;
      console.warn("[profile-photo] Blob upload failed, falling back to local storage:", err);
    }
  }

  // Local filesystem fallback (dev only)
  const uploadDir = path.join(process.cwd(), "public", "uploads", "profile-photos");
  await fs.mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, fileName), buffer);
  return `/uploads/profile-photos/${fileName}`;
}

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

    const url = await uploadFile(file, user.userId);

    await prisma.user.update({
      where: { id: user.userId },
      data: { profilePicture: url },
    });

    return successResponse({ profilePicture: url }, "Profile photo updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
