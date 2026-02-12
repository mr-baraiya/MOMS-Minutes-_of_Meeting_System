import { NextRequest, NextResponse } from "next/server";
import { DocumentService } from "@/services/document.service";
import { getUserFromRequest } from "@/lib/auth";
import { put } from "@vercel/blob";

/**
 * GET /api/documents
 * Get documents based on user role and filters
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const filters = {
      search: searchParams.get("search") || undefined,
      meetingId: searchParams.get("meetingId")
        ? parseInt(searchParams.get("meetingId")!)
        : undefined,
      departmentId: searchParams.get("departmentId")
        ? parseInt(searchParams.get("departmentId")!)
        : undefined,
      uploadedBy: searchParams.get("uploadedBy")
        ? parseInt(searchParams.get("uploadedBy")!)
        : undefined,
      dateFrom: searchParams.get("dateFrom")
        ? new Date(searchParams.get("dateFrom")!)
        : undefined,
      dateTo: searchParams.get("dateTo")
        ? new Date(searchParams.get("dateTo")!)
        : undefined,
    };

    let documents;

    // Role-based document retrieval
    const role = user.role.toUpperCase();
    switch (role) {
      case "ADMIN":
        documents = await DocumentService.getAllWithFilters(filters);
        break;

      case "CONVENER":
        if (!user.staffId) {
          return NextResponse.json(
            { error: "Staff profile not found" },
            { status: 404 }
          );
        }
        documents = await DocumentService.getByConvenerId(
          user.staffId,
          filters
        );
        break;

      case "STAFF":
        if (!user.staffId) {
          return NextResponse.json(
            { error: "Staff profile not found" },
            { status: 404 }
          );
        }
        documents = await DocumentService.getByStaffMembership(
          user.staffId,
          filters
        );
        break;

      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/documents
 * Upload a new document
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Staff cannot upload documents
    if (user.role.toUpperCase() === "STAFF") {
      return NextResponse.json(
        { error: "Staff members cannot upload documents" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const meetingId = parseInt(formData.get("meetingId") as string);
    const documentTitle = formData.get("documentTitle") as string;

    if (!file || !meetingId || !documentTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
      const ownsMeeting = meetings.some((m) => m.id === meetingId);

      if (!ownsMeeting) {
        return NextResponse.json(
          { error: "You can only upload documents to your own meetings" },
          { status: 403 }
        );
      }
    }

    // Create blob path with enterprise folder structure
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const blobFileName = `${timestamp}_${sanitizedFileName}`;
    const blobPath = `documents/meeting-${meetingId}/${blobFileName}`;

    // Upload to Vercel Blob
    const blob = await put(blobPath, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Create database record with Blob URL
    const document = await DocumentService.create({
      meetingId,
      documentTitle,
      fileName: file.name,
      filePath: blob.url,
      uploadedBy: user.userId,
    });

    return NextResponse.json(
      {
        message: "Document uploaded successfully",
        document,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
