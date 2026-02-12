# 🚀 Vercel Blob Quick Reference

## 📦 Package
```bash
npm install @vercel/blob
```

## 🔑 Core Functions

### Upload
```typescript
import { put } from "@vercel/blob";

const blob = await put(blobPath, file, {
  access: "public",
  addRandomSuffix: false,
});

// Returns: { url: "https://...", pathname: "...", ... }
```

### Delete
```typescript
import { del } from "@vercel/blob";

await del(blobUrl);
// Or
await del([url1, url2, url3]); // Bulk delete
```

### List (Optional)
```typescript
import { list } from "@vercel/blob";

const { blobs } = await list({ prefix: "documents/meeting-1/" });
```

## 🏗 Folder Structure

```
documents/
  meeting-{id}/
    {timestamp}_{sanitized_filename}
    
Example:
documents/meeting-5/1707782400000_Meeting_Minutes.pdf
```

## 🔐 Access Control

### Upload Permissions
```typescript
// ❌ STAFF
if (user.role === "STAFF") return 403;

// ✅ CONVENER (own meetings only)
if (user.role === "CONVENER") {
  const ownsMeeting = await checkOwnership(user.staffId, meetingId);
  if (!ownsMeeting) return 403;
}

// ✅ ADMIN (all meetings)
// No additional check
```

### Delete Permissions
```typescript
const canDelete = await DocumentService.canManageDocument(
  documentId,
  userId,
  userRole,
  staffId
);
```

## 📁 Database Schema

```typescript
model Document {
  filePath String // Full Blob URL
}

// Example value:
// "https://xxxx.public.blob.vercel-storage.com/documents/meeting-5/1707782400000_MOM.pdf"
```

## 🎯 API Endpoints

### Upload
```typescript
POST /api/documents/upload

FormData {
  file: File
  meetingId: string
  documentTitle: string
}

→ { success: true, document: { fileUrl, ... } }
```

### Delete
```typescript
DELETE /api/documents/[id]

→ { message: "Document deleted successfully" }
```

### Bulk Delete (Admin)
```typescript
POST /api/documents/bulk-delete

{ documentIds: [1, 2, 3] }

→ { count: 3 }
```

## 🎨 Frontend Usage

### Upload
```tsx
const formData = new FormData();
formData.append("file", file);
formData.append("meetingId", meetingId.toString());
formData.append("documentTitle", title);

await fetch("/api/documents/upload", {
  method: "POST",
  body: formData,
});
```

### Download
```tsx
<a href={doc.filePath} target="_blank" download>
  Download
</a>
```

### Preview
```tsx
<iframe src={doc.filePath} />
```

## ⚙️ Environment

### Production (Vercel)
✅ Automatic - no config needed

### Local Development
```bash
vercel env pull
# Creates .env.local with BLOB_READ_WRITE_TOKEN
```

## 🧪 Testing Checklist

- [ ] Upload PDF (works)
- [ ] Upload DOCX (works)
- [ ] Upload JPG (rejected)
- [ ] Upload 15MB file (rejected)
- [ ] Staff upload (rejected)
- [ ] Convener upload to other's meeting (rejected)
- [ ] Admin upload to any meeting (works)
- [ ] Download via Blob URL (works)
- [ ] Preview PDF (works)
- [ ] Delete document (Blob + DB removed)
- [ ] Bulk delete (works for admin)

## 🚨 Common Issues

### Upload fails
- Check file type/size
- Verify permissions
- Check Blob storage limits

### Download fails
- Verify Blob URL format
- Check if URL is public
- Test URL directly

### Delete fails
- Check user permissions
- Verify document exists
- Check Blob URL validity

## 📚 Full Documentation

- [Vercel Blob Integration Guide](./VERCEL_BLOB_INTEGRATION.md)
- [Implementation Summary](./BLOB_INTEGRATION_SUMMARY.md)
- [Documents Feature Guide](./DOCUMENTS_FEATURE.md)

---

**Quick Tip**: All Blob URLs are CDN-distributed and globally fast! 🚀
