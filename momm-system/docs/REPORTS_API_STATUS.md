# Reports API - Implementation Status

## ✅ Completed

### API Endpoints Created

1. **GET /api/reports** - Fetch reports
   - ✅ Role-based filtering (Admin sees all, Convener sees own)
   - ✅ Includes generator and meeting details
   - ✅ Proper authorization checks

2. **POST /api/reports/generate** - Generate new report
   - ✅ Validation for required fields
   - ✅ Role-based restrictions (Staff blocked, Convener limited)
   - ✅ Meeting ownership verification for Conveners
   - ✅ Database record creation
   - ⚠️ **PDF generation is placeholder** (see below)

3. **DELETE /api/reports/[id]** - Delete report
   - ✅ Admin-only access
   - ✅ Report existence check
   - ⚠️ **Blob file deletion is placeholder** (see below)

### UI Components Created
- ✅ ReportGenerator (card-based form)
- ✅ ReportHistoryTable (with custom confirm modal)
- ✅ ReportPreviewDrawer (with embedded PDF viewer)
- ✅ Admin reports page (/admin/reports)
- ✅ Convener reports page (/convener/reports)
- ✅ Sidebar links updated

---

## ⚠️ TODO: Actual PDF Generation

The current implementation creates **placeholder URLs** instead of actual PDFs.

### To Implement Real PDF Generation:

#### Option 1: Server-Side PDF Generation (Recommended)

```typescript
// In: app/api/reports/generate/route.ts
import { put } from '@vercel/blob';
import PDFDocument from 'pdfkit'; // or use puppeteer

// After data fetching:
const pdfBuffer = await generatePDFReport({
  reportType,
  data: reportData,
  dateFrom,
  dateTo,
});

// Upload to Vercel Blob
const blob = await put(
  `reports/${reportName}.pdf`,
  pdfBuffer,
  { access: 'public' }
);

// Use blob.url instead of placeholderUrl
```

#### Option 2: Client-Side PDF (Not Recommended)
- Use libraries like jsPDF
- Generate in browser, upload to API
- Less secure, more client load

### Libraries to Consider:

| Library | Use Case | Pros | Cons |
|---------|----------|------|------|
| **pdfkit** | Server PDF creation | Fast, flexible | Manual layout |
| **puppeteer** | HTML to PDF | Uses HTML/CSS | Heavy, slower |
| **react-pdf** | React-based PDFs | React syntax | Client-side |

### Data Fetching Example:

```typescript
async function fetchReportData(type: string, filters: any) {
  switch (type) {
    case 'meeting-wise':
      return await prisma.meeting.findUnique({
        where: { id: filters.meetingId },
        include: {
          members: { include: { staff: true } },
          documents: true,
          organizer: true,
        },
      });
    
    case 'attendance-summary':
      return await prisma.meetingMember.groupBy({
        by: ['attendanceStatus'],
        where: {
          meeting: {
            meetingDate: {
              gte: filters.dateFrom,
              lte: filters.dateTo,
            },
          },
        },
        _count: true,
      });
    
    // Add other report types...
  }
}
```

---

## 🎯 Current Behavior

**What happens now:**
1. User fills report form
2. API creates database record with placeholder URL
3. Frontend shows success, but PDF link is fake
4. Preview drawer won't load actual PDF

**To test:**
1. Generate a report (fake URL stored)
2. View in history table
3. Preview attempts to load placeholder (will fail)

---

## 🔐 Security Implementation

✅ **Proper guards in place:**
- Staff: No access to reports (403)
- Convener: Only own meetings
- Admin: Full access
- Delete: Admin only

---

## 📝 Next Steps

1. Choose PDF generation library
2. Implement `generatePDFReport()` function
3. Replace `placeholderUrl` with blob URL
4. Add actual report templates (meeting, attendance, etc.)
5. Test with real data
6. Add file deletion in DELETE endpoint

---

**Note:** The UI is fully functional and production-ready. Only the backend PDF generation needs implementation.
