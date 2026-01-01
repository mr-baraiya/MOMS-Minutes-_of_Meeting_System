import { NextRequest } from "next/server";
import { DocumentService } from "@/services";
import {
  successResponse,
  errorResponse,
  handleApiError,
  parseId,
} from "@/lib/api-utils";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/meetings/[id]/documents
 * Get all documents for a meeting
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingId = parseId(id);
    if (!meetingId) {
      return errorResponse("Invalid meeting ID");
    }

    const documents = await DocumentService.getByMeetingId(meetingId);
    return successResponse(documents);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/meetings/[id]/documents
 * Upload document for a meeting
 */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const meetingId = parseId(id);
    if (!meetingId) {
      return errorResponse("Invalid meeting ID");
    }

    const body = await request.json();

    if (!body.documentTitle || !body.fileName || !body.filePath || !body.uploadedBy) {
      return errorResponse("Document title, file name, file path, and uploader are required");
    }

    const document = await DocumentService.create({
      meetingId,
      documentTitle: body.documentTitle,
      fileName: body.fileName,
      filePath: body.filePath,
      uploadedBy: body.uploadedBy,
    });

    return successResponse(document, "Document uploaded successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
