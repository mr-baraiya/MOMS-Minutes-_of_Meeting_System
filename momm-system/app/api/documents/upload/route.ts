import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { DocumentService } from "@/services/document.service";

/**
 * POST /api/documents/upload
 * Dedicated upload endpoint using Vercel Blob
 * Used by Admin and Convener roles
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Staff cannot upload documents
    if (user.role.toUpperCase() === "STAFF") {
      return NextResponse.json(
        { error: "Staff members cannot upload documents" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const meetingId = formData.get("meetingId") as string;
    const documentTitle = formData.get("documentTitle") as string;

    if (!file || !meetingId) {
      return NextResponse.json(
        { error: "File or Meeting ID missing" },
        { status: 400 }
      );
    }

    if (!documentTitle) {
      return NextResponse.json(
        { error: "Document title is required" },
        { status: 400 }
      );
    }

    // Validate file type (PDF, DOC, DOCX)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOC, DOCX allowed" },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // For CONVENER, verify they own the meeting
    if (user.role.toUpperCase() === "CONVENER") {
      const meetings = await DocumentService.getConvenerMeetings(
        user.staffId!
      );
      const ownsMeeting = meetings.some((m) => m.id === Number(meetingId));

      if (!ownsMeeting) {
        return NextResponse.json(
          { error: "You can only upload documents to your own meetings" },
          { status: 403 }
        );
      }
    }

    // Create blob path with enterprise folder structure
    // documents/meeting-{id}/{timestamp}_{filename}
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const blobFileName = `${timestamp}_${sanitizedFileName}`;
    const blobPath = `documents/meeting-${meetingId}/${blobFileName}`;

    // Upload to Vercel Blob
    const blob = await put(blobPath, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Save metadata to database
    const document = await DocumentService.create({
      meetingId: Number(meetingId),
      documentTitle,
      fileName: file.name,
      filePath: blob.url, // Store the Blob URL
      uploadedBy: user.userId,
    });

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        id: document.id,
        fileName: file.name,
        fileUrl: blob.url,
        documentTitle,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
