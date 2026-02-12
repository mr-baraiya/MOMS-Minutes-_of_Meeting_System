# 📄 Documents Management System

## Overview

The Documents Management System is a comprehensive feature for managing Minutes of Meeting (MOM) files and meeting-related attachments across different user roles. The system implements role-based access control with three distinct user experiences: Admin, Convener, and Staff.

## 🎯 Features

### Role-Based Views

#### 1. **Admin** - Full Control
- **Route**: `/admin/documents`
- **View**: Professional table-based interface
- **Capabilities**:
  - View all documents across the system
  - Upload documents to any meeting
  - Delete any document
  - Bulk delete multiple documents
  - Advanced filtering (by meeting, department, date, uploader)
  - Audit trail information

#### 2. **Convener** - Manage Own Meetings
- **Route**: `/convener/documents`
- **View**: Hybrid card-based interface
- **Capabilities**:
  - View documents from meetings they organize
  - Upload MOM for their meetings
  - Delete documents from their meetings
  - Filter by meeting and date
  - Drag & drop file upload

#### 3. **Staff** - Read-Only Access
- **Route**: `/staff/documents`
- **View**: Simple card list (read-only)
- **Capabilities**:
  - View documents from meetings they attend
  - Download documents
  - Preview documents
  - Filter by meeting and date
  - Bulk download all documents

## 🏗 Architecture

### Backend Components

#### API Routes
```
/api/documents                 - GET (list), POST (upload)
/api/documents/[id]           - GET (single), DELETE, PATCH (update)
/api/documents/bulk-delete    - POST (admin bulk delete)
/api/documents/meetings       - GET (available meetings for upload)
```

#### Services
- `DocumentService` - Handles all document operations
  - Role-based document retrieval
  - Upload/delete operations
  - Permission verification
  - Statistics and analytics

#### Types
- `Document` - Base document type
- `DocumentWithRelations` - Document with related data
- `DocumentWithMeetingInfo` - Full document info for UI

### Frontend Components

#### Shared Components
```
components/documents/
├── DocumentCard.tsx       - Card view for individual documents
├── DocumentTable.tsx      - Table view with bulk operations
├── PreviewDrawer.tsx      - Right-side preview with PDF viewer
├── UploadModal.tsx        - Upload dialog with drag & drop
├── DocumentFilters.tsx    - Advanced filtering interface
└── index.ts              - Component exports
```

## 🔐 Security & Permissions

### Permission Matrix

| Action | Admin | Convener | Staff |
|--------|-------|----------|-------|
| View All Documents | ✅ | ❌ | ❌ |
| View Own Documents | ✅ | ✅ | ✅ |
| Upload Documents | ✅ | ✅ (own meetings) | ❌ |
| Delete Documents | ✅ (all) | ✅ (own) | ❌ |
| Bulk Delete | ✅ | ❌ | ❌ |
| Edit Metadata | ✅ | ✅ (own) | ❌ |

### Backend Validation
```typescript
// Example permission check
const canManage = await DocumentService.canManageDocument(
  documentId,
  userId,
  userRole,
  staffId
);
```

### File Upload Security
- **Allowed Types**: PDF, DOC, DOCX
- **Max Size**: 10MB
- **Storage**: Vercel Blob Storage (Cloud CDN)
- **Naming**: Timestamped filenames to prevent conflicts
- **Structure**: `documents/meeting-{id}/{timestamp}_{filename}`

## 📦 Database Schema

```prisma
model Document {
  id            Int      @id @default(autoincrement())
  meetingId     Int
  documentTitle String
  fileName      String
  filePath      String
  uploadedBy    Int
  uploadedAt    DateTime @default(now())
  meeting       Meeting  @relation(...)
  uploader      User     @relation(...)
}
```

## 🎨 UI/UX Features

### Animations (Framer Motion)
- Smooth page transitions
- Staggered list animations
- Interactive button states
- Drawer slide-in/out effects

### User Experience
- **Search & Filter**: Real-time search with advanced filters
- **Preview**: In-app PDF preview in drawer
- **Download**: One-click download or bulk download
- **Upload**: Drag & drop file upload with validation
- **Responsive**: Mobile-friendly design
- **Toast Notifications**: User feedback for all actions

## 🚀 Usage Examples

### Uploading a Document (Convener)
```typescript
// Click "Upload MOM" button
// Select meeting from dropdown
// Enter document title
// Drag & drop or browse for file
// Submit
```

### Filtering Documents (Admin)
```typescript
// Use search bar for text search
// Click "Filters" button
// Select meeting, department, date range
// Documents update automatically
```

### Previewing a Document (All Users)
```typescript
// Click "Preview" icon on any document
// Right drawer opens with document info
// PDF preview shown inline
// Download or close drawer
```

## 📊 Statistics & Analytics

The system tracks:
- Total documents count
- Documents uploaded this month/week
- Documents per meeting
- Upload activity by user

## 🔄 API Usage

### Fetch Documents
```javascript
const response = await fetch('/api/documents?search=meeting&meetingId=5');
const { documents } = await response.json();
```

### Upload Document
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('meetingId', meetingId);
formData.append('documentTitle', title);

const response = await fetch('/api/documents', {
  method: 'POST',
  body: formData,
});
```

### Delete Document
```javascript
const response = await fetch(`/api/documents/${documentId}`, {
  method: 'DELETE',
});
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Admin can view all documents
- [ ] Convener can only view own meeting documents
- [ ] Staff can only view documents from attended meetings
- [ ] Upload works with valid file types
- [ ] Upload rejects invalid file types and large files
- [ ] Preview drawer shows document info correctly
- [ ] PDF preview works in drawer
- [ ] Delete requires confirmation
- [ ] Bulk delete works for admin
- [ ] Filters update document list correctly
- [ ] Permissions are enforced on backend

## 🔧 Configuration

### Storage Backend
**Vercel Blob Storage** - Enterprise cloud storage with global CDN
- No additional environment variables required on Vercel
- Automatic authentication in production
- For local development: `vercel env pull`

### File Storage
Documents are stored in Vercel Blob with enterprise folder structure:
```
documents/meeting-{id}/{timestamp}_{filename}
```
Database stores the full Blob URL for direct access.

### Related Documentation
- [Vercel Blob Integration Guide](./VERCEL_BLOB_INTEGRATION.md)
- [Blob Integration Summary](./BLOB_INTEGRATION_SUMMARY.md)

## 📝 Future Enhancements

Potential improvements:
- [ ] Document versioning
- [ ] Comments and annotations
- [ ] Email notifications on upload
- [ ] Document templates
- [ ] Export to different formats
- [ ] OCR for searchable PDFs
- [ ] Cloud storage integration (S3, Azure Blob)
- [ ] Document approval workflow

## 🐛 Troubleshooting

### Document Not Uploading
- Check file type (must be PDF, DOC, or DOCX)
- Check file size (must be under 10MB)
- Verify user has upload permissions
- Check meeting exists and user has access
- Verify Vercel Blob credentials (in production)

### Preview Not Working
- Ensure PDF viewer is supported in browser
- Check Blob URL is accessible (click to open directly)
- Verify document was uploaded successfully
- Check browser console for errors

### Download Issues
- Verify Blob URL is publicly accessible
- Check browser allows downloads
- Try opening URL in new tab first

### Permission Errors
- Verify JWT token is valid
- Check user role matches required permission
- For conveners, verify they own the meeting

### Blob Storage Errors
- Check Vercel dashboard for storage limits
- Verify project has Blob storage enabled
- Check network connectivity
- See [Vercel Blob Integration](./VERCEL_BLOB_INTEGRATION.md) for details

## 📚 Related Documentation

- [API Testing Guide](./API_TESTING_GUIDE.md)
- [Authentication Guide](./AUTHENTICATION_GUIDE.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)

---

**Built with**: Next.js 16, TypeScript, Prisma, Framer Motion, Tailwind CSS
