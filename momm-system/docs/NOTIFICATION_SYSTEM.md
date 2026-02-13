# Notification System Documentation

## Overview
The MOM system now includes a comprehensive role-based notification system that automatically notifies users of important events.

## Database Schema

### Notification Model
```prisma
model Notification {
  id          Int              @id @default(autoincrement())
  userId      Int              @map("user_id")
  title       String           @db.VarChar(200)
  message     String
  type        NotificationType
  referenceId Int?             @map("reference_id")
  isRead      Boolean          @default(false)
  createdAt   DateTime         @default(now())
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Notification Types
- `MEETING_CREATED` - When a meeting is scheduled
- `MEETING_UPDATED` - When meeting details change
- `MEETING_CANCELLED` - When a meeting is cancelled
- `ATTENDANCE_MARKED` - When attendance is recorded
- `DOCUMENT_UPLOADED` - When a MOM document is added
- `REPORT_GENERATED` - When a report is ready
- `SUPPORT_TICKET_UPDATED` - When a support ticket changes status
- `GENERAL` - Generic notifications

## API Endpoints

### Get Notifications
```
GET /api/notifications?userId={userId}&limit={limit}&unreadOnly={true|false}
```

### Mark as Read
```
PATCH /api/notifications/{id}/read
Body: { userId: number }
```

### Mark All as Read
```
PATCH /api/notifications/mark-all-read
Body: { userId: number }
```

## Notification Service

### Available Methods

#### Create Single Notification
```typescript
await NotificationService.create({
  userId: 123,
  title: "Meeting Scheduled",
  message: "You have been invited to the quarterly review.",
  type: "MEETING_CREATED",
  referenceId: 456, // Optional meeting/document/report ID
});
```

#### Create Multiple Notifications (Bulk)
```typescript
await NotificationService.createMany([
  { userId: 1, title: "...", message: "...", type: "MEETING_CREATED" },
  { userId: 2, title: "...", message: "...", type: "MEETING_CREATED" },
]);
```

#### Pre-built Helpers
```typescript
// Notify meeting participants
await NotificationService.notifyMeetingCreated(
  meetingId,
  meetingTitle,
  [userId1, userId2, userId3]
);

// Notify when document is uploaded
await NotificationService.notifyDocumentUploaded(
  meetingId,
  documentTitle,
  [userId1, userId2]
);

// Notify when attendance is marked
await NotificationService.notifyAttendanceMarked(
  meetingId,
  meetingTitle,
  adminUserId
);

// Notify when report is ready
await NotificationService.notifyReportGenerated(
  reportId,
  reportName,
  userId
);
```

## Frontend Integration

### Header Component
The notification bell icon in the header automatically:
- Displays unread count badge
- Fetches notifications when component mounts
- Shows dropdown with recent notifications
- Allows marking individual notifications as read
- Provides "Mark all as read" option

### Auto-refresh
Notifications are fetched:
- On component mount
- When user ID changes
- After marking as read/unread

## Adding Notification Triggers

### Example: Meeting Creation
```typescript
// In /api/meetings/route.ts
import { NotificationService } from '@/services';

// After creating meeting
const meeting = await MeetingService.create(data);

// Get participant user IDs
const participantUserIds = [...]; // Query staff.userId for each member

// Send notifications
await NotificationService.notifyMeetingCreated(
  meeting.id,
  meeting.meetingTitle,
  participantUserIds
);
```

### Example: Document Upload
```typescript
// In /api/documents/route.ts
const document = await DocumentService.create(data);

// Get meeting participants
const meeting = await prisma.meeting.findUnique({
  where: { id: meetingId },
  include: {
    meetingMembers: {
      include: { staff: { select: { userId: true } } }
    }
  }
});

const userIds = meeting.meetingMembers.map(m => m.staff.userId);

// Notify participants
await NotificationService.notifyDocumentUploaded(
  meetingId,
  documentTitle,
  userIds
);
```

## Role-Based Logic

### Who gets notified?
- **Meeting Created**: All invited staff and convener
- **Attendance Marked**: Admin users
- **Document Uploaded**: All meeting participants
- **Report Generated**: The user who requested the report
- **Support Ticket Updated**: The ticket creator

### Permission Handling
Notifications are user-scoped:
- Users only see their own notifications
- Mark as read requires userId verification
- Delete operations verify ownership

## Migration

To apply the notification schema:

```bash
cd momm-system
npx prisma migrate dev --name add_notifications
npx prisma generate
```

## Best Practices

1. **Always wrap in try-catch**: Don't let notification failures break core functionality
2. **Bulk operations**: Use `createMany` for multiple users instead of loops
3. **Error logging**: Log notification failures for debugging
4. **Reference IDs**: Always include referenceId to link back to source
5. **Clear messages**: Write user-friendly notification text

## Future Enhancements

- Real-time push notifications via WebSocket
- Email notifications for critical events
- Notification preferences per user
- Notification history/archive page
- Read receipts and delivery status
