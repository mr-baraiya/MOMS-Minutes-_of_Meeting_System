import { NextRequest, NextResponse } from "next/server";
import { DocumentService } from "@/services/document.service";
import { getUserFromRequest } from "@/lib/auth";
import { del } from "@vercel/blob";

/**
 * GET /api/documents/[id]
 * Get document by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documentId = parseInt(params.id);
    const document = await DocumentService.getById(documentId);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Permission checks based on role
    const role = user.role.toUpperCase();
    if (role === "STAFF") {
      // Staff can only view documents from meetings they're part of
      const staffDocuments = await DocumentService.getByStaffMembership(
        user.staffId!
      );
      const hasAccess = staffDocuments.some((d) => d.id === documentId);

      if (!hasAccess) {
        return NextResponse.json(
          { error: "You don't have access to this document" },
          { status: 403 }
        );
      }
    } else if (role === "CONVENER") {
      // Convener can only view documents from their meetings
      const convenerDocuments = await DocumentService.getByConvenerId(
        user.staffId!
      );
      const hasAccess = convenerDocuments.some((d) => d.id === documentId);

      if (!hasAccess) {
        return NextResponse.json(
          { error: "You don't have access to this document" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/documents/[id]
 * Delete document
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documentId = parseInt(params.id);

    // Get document first
    const document = await DocumentService.getById(documentId);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const canManage = await DocumentService.canManageDocument(
      documentId,
      user.userId,
      user.role.toUpperCase() as any,
      user.staffId
    );

    if (!canManage) {
      return NextResponse.json(
        { error: "You don't have permission to delete this document" },
        { status: 403 }
      );
    }

    // Delete file from Vercel Blob
    if (document.filePath) {
      try {
        await del(document.filePath);
      } catch (error) {
        console.error("Error deleting blob:", error);
        // Continue even if blob deletion fails
      }
    }

    // Delete database record
    await DocumentService.delete(documentId);

    return NextResponse.json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/documents/[id]
 * Update document metadata (title only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documentId = parseInt(params.id);
    const body = await request.json();
    const { documentTitle } = body;

    if (!documentTitle) {
      return NextResponse.json(
        { error: "Document title is required" },
        { status: 400 }
      );
    }

    // Check permissions
    const canManage = await DocumentService.canManageDocument(
      documentId,
      user.userId,
      user.role.toUpperCase() as any,
      user.staffId
    );

    if (!canManage) {
      return NextResponse.json(
        { error: "You don't have permission to update this document" },
        { status: 403 }
      );
    }

    // Update document
    const updatedDocument = await DocumentService.update(documentId, {
      documentTitle,
    });

    return NextResponse.json({
      message: "Document updated successfully",
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}
