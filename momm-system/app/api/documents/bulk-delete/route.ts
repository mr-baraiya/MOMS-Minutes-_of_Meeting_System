import { NextRequest, NextResponse } from "next/server";
import { DocumentService } from "@/services/document.service";
import { getUserFromRequest } from "@/lib/auth";
import { del } from "@vercel/blob";
import path from "path";
import { promises as fs } from "fs";

async function deleteStoredFile(filePath: string): Promise<void> {
  if (filePath.startsWith("http")) {
    await del(filePath);
  } else if (filePath.startsWith("/uploads/")) {
    try {
      await fs.unlink(path.join(process.cwd(), "public", filePath));
    } catch {
      // ignore – file may already be gone
    }
  }
}

/**
 * POST /api/documents/bulk-delete
 * Bulk delete documents (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can bulk delete
    if (user.role.toUpperCase() !== "ADMIN") {
      return NextResponse.json(
        { error: "Only administrators can bulk delete documents" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { documentIds } = body;

    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      return NextResponse.json(
        { error: "Document IDs array is required" },
        { status: 400 }
      );
    }

    // Get all documents to delete their files
    const documentsToDelete = await Promise.all(
      documentIds.map((id) => DocumentService.getById(id))
    );

    // Delete files from storage
    const deletePromises = documentsToDelete
      .filter((doc) => doc && doc.filePath)
      .map((doc) =>
        deleteStoredFile(doc!.filePath).catch((error) => {
          console.error(`Failed to delete file: ${doc!.filePath}`, error);
        })
      );
    
    await Promise.all(deletePromises);

    // Bulk delete from database
    const result = await DocumentService.bulkDelete(documentIds);

    return NextResponse.json({
      message: `Successfully deleted ${result.count} document(s)`,
      count: result.count,
    });
  } catch (error) {
    console.error("Error bulk deleting documents:", error);
    return NextResponse.json(
      { error: "Failed to delete documents" },
      { status: 500 }
    );
  }
}
