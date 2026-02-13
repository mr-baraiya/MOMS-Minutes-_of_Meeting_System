# MOMS - Minutes of Meeting System

A comprehensive web-based system for managing organizational meetings, attendance tracking, document management, and automated reporting with role-based access control.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Service Layer](#service-layer)
8. [Authentication & Authorization](#authentication--authorization)
9. [Installation & Setup](#installation--setup)
10. [Environment Configuration](#environment-configuration)
11. [Running the Application](#running-the-application)
12. [Project Structure](#project-structure)

---

## Project Overview

The Minutes of Meeting System (MOMS) is a full-stack enterprise application designed to digitize and streamline organizational meeting management. The system provides comprehensive tools for scheduling meetings, tracking attendance, managing documents, generating reports, and sending real-time notifications to stakeholders.

### Key Capabilities

- Multi-role user management (Admin, Convener, Staff)
- Secure JWT-based authentication with password recovery
- Meeting lifecycle management (creation, scheduling, cancellation)
- Real-time attendance tracking with remarks
- Document upload and management using Vercel Blob storage
- Automated report generation (meeting summaries, attendance reports)
- Role-based notification system
- Global search across meetings, documents, and staff
- Department and staff management
- Venue management (physical and virtual)
- Meeting type categorization
- Support ticket system
- Interactive dashboards with analytics

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12.34.0, GSAP 3.14.2
- **Icons**: Lucide React 0.563.0
- **Charts**: Recharts 3.7.0
- **Notifications**: React Hot Toast 2.6.0, SweetAlert2 11.26.18

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes (RESTful)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 7.2.0
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs 3.0.3
- **File Storage**: Vercel Blob 2.2.0
- **Email**: Nodemailer 7.0.12, EmailJS 4.4.1
- **Validation**: Zod 4.3.6

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Build Tool**: Next.js Turbopack
- **Database Tools**: Prisma Studio

---

## Features

### Authentication & User Management
- User registration with email verification
- Secure login with JWT tokens
- Password reset via email tokens
- Profile management with photo upload
- Role-based access control (RBAC)

### Meeting Management
- Create, update, and cancel meetings
- Schedule meetings with date, time, and venue
- Assign meeting types and organizers
- Add multiple participants
- Virtual and physical meeting support
- Meeting link integration
- Cancellation with reason tracking

### Attendance Tracking
- Mark attendance for meeting participants
- Add remarks for each attendee
- Timestamp attendance marking
- View attendance history
- Generate attendance reports

### Document Management
- Upload documents to meetings (PDF, DOCX, etc.)
- Vercel Blob integration for secure storage
- Document metadata tracking
- Bulk delete operations
- Download capabilities
- Access control based on roles

### Notification System
- Real-time event-based notifications
- 8 notification types:
  - Meeting Created
  - Meeting Updated
  - Meeting Cancelled
  - Attendance Marked
  - Document Uploaded
  - Report Generated
  - Support Ticket Updated
  - General Notifications
- Mark as read functionality
- Unread count tracking
- User-specific notification filtering

### Reporting & Analytics
- Generate meeting summary reports
- Attendance reports
- Department-wise analytics
- Custom date range filtering
- Export capabilities

### Administrative Features
- Department management
- Staff management with departments
- Venue management (physical/virtual)
- Meeting type management
- User management with role assignment
- System settings configuration
- Support ticket management

### Search & Discovery
- Global search across:
  - Meetings (title, description)
  - Documents (title, filename)
  - Staff (name, email, designation)
- Real-time search suggestions
- Result categorization

---

## Architecture

### Application Architecture

```
MOMS (Next.js App Router)
│
├── Frontend Layer
│   ├── Pages (App Router)
│   ├── Components (React)
│   └── Context (AuthContext)
│
├── API Layer (REST)
│   ├── Route Handlers
│   ├── Middleware
│   └── Response Utilities
│
├── Service Layer
│   ├── Business Logic
│   ├── Data Validation
│   └── External Integrations
│
└── Data Layer
    ├── Prisma ORM
    ├── PostgreSQL Database
    └── Vercel Blob Storage
```

### Design Patterns

- **Service Layer Pattern**: Business logic separated from API routes
- **Repository Pattern**: Database operations abstracted via Prisma ORM
- **Middleware Pattern**: Authentication and authorization handlers
- **Factory Pattern**: Response utilities for consistent API responses
- **Observer Pattern**: Event-driven notification system

---

## Database Schema

### Core Models

#### User
```typescript
- id: Integer (PK)
- username: String (Unique)
- email: String (Unique)
- passwordHash: String
- role: Enum (ADMIN, CONVENER, STAFF)
- profilePicture: String (Optional)
- isActive: Boolean
- createdAt: DateTime
- modifiedAt: DateTime
- resetToken: String (Optional)
- resetTokenExpiry: DateTime (Optional)
```

#### Department
```typescript
- id: Integer (PK)
- departmentName: String (Unique)
- isActive: Boolean
- createdAt: DateTime
```

#### Staff
```typescript
- id: Integer (PK)
- userId: Integer (FK -> User, Unique)
- staffName: String
- designation: String (Optional)
- mobileNo: String (Optional)
- emailAddress: String (Unique)
- departmentId: Integer (FK -> Department)
- profilePicture: String (Optional)
- isActive: Boolean
- createdAt: DateTime
```

#### MeetingType
```typescript
- id: Integer (PK)
- meetingTypeName: String (Unique)
- isActive: Boolean
- createdAt: DateTime
```

#### Venue
```typescript
- id: Integer (PK)
- venueName: String
- venueType: Enum (PHYSICAL, VIRTUAL)
- location: String (Optional)
- isActive: Boolean
- createdAt: DateTime
```

#### Meeting
```typescript
- id: Integer (PK)
- meetingTitle: String
- meetingDescription: String (Optional)
- meetingDate: Date
- meetingStartTime: DateTime
- meetingEndTime: DateTime
- meetingTypeId: Integer (FK -> MeetingType)
- organizerStaffId: Integer (FK -> Staff)
- venueId: Integer (FK -> Venue)
- meetingLink: String (Optional)
- isCancelled: Boolean
- cancellationReason: String (Optional)
- cancelledAt: DateTime (Optional)
- createdAt: DateTime
- modifiedAt: DateTime
```

#### MeetingMember
```typescript
- id: Integer (PK)
- meetingId: Integer (FK -> Meeting)
- staffId: Integer (FK -> Staff)
- isPresent: Boolean
- attendanceMarkedAt: DateTime (Optional)
- remarks: String (Optional)
- createdAt: DateTime
- Unique: [meetingId, staffId]
```

#### Document
```typescript
- id: Integer (PK)
- meetingId: Integer (FK -> Meeting)
- documentTitle: String
- fileName: String
- filePath: String (Blob URL)
- uploadedBy: Integer (FK -> User)
- uploadedAt: DateTime
```

#### Report
```typescript
- id: Integer (PK)
- reportName: String
- reportType: Enum (MEETING_SUMMARY, ATTENDANCE, DEPARTMENT)
- meetingId: Integer (FK -> Meeting, Optional)
- filePath: String
- generatedBy: Integer (FK -> User)
- generatedAt: DateTime
```

#### Notification
```typescript
- id: Integer (PK)
- userId: Integer (FK -> User)
- title: String
- message: String
- type: NotificationType Enum
- referenceId: Integer (Optional)
- isRead: Boolean
- createdAt: DateTime
- Index: [userId, isRead]
```

#### SupportTicket
```typescript
- id: Integer (PK)
- userId: Integer (FK -> User)
- category: Enum (TECHNICAL, FEATURE, BUG, GENERAL)
- subject: String
- message: String
- status: Enum (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- createdAt: DateTime
- updatedAt: DateTime
```

### Enumerations

#### Role
- ADMIN
- CONVENER
- STAFF

#### VenueType
- PHYSICAL
- VIRTUAL

#### NotificationType
- MEETING_CREATED
- MEETING_UPDATED
- MEETING_CANCELLED
- ATTENDANCE_MARKED
- DOCUMENT_UPLOADED
- REPORT_GENERATED
- SUPPORT_TICKET_UPDATED
- GENERAL

#### ReportType
- MEETING_SUMMARY
- ATTENDANCE
- DEPARTMENT

#### SupportCategory
- TECHNICAL
- FEATURE
- BUG
- GENERAL

#### SupportTicketStatus
- OPEN
- IN_PROGRESS
- RESOLVED
- CLOSED

---

## API Documentation

| User Type | Description |
|-----------|-------------|
| **Admin** | Manages system configuration, users, departments, meeting types, venues, and has full access to all meetings |
| **Staff** | Organization employees who can be invited to meetings, record minutes, and manage assigned meetings |
| **Meeting Member** | Participants invited to specific meetings with view and contribution access |

## 4. Functional Requirements

### 4.1 Authentication & Authorization

#### 4.1.1 Sign Up
- Users can register using:
  - Full Name
  - Email
  - Password
  - Role (Admin / Staff / Member)
- Password must follow security rules (minimum 8 characters)
- Email verification required
- Account activation by admin

#### 4.1.2 Sign In
- Users log in using email and password
- Incorrect credentials display error messages
- Successful login redirects to dashboard
- Session management with JWT tokens

#### 4.1.3 Password Recovery
- Forgot password functionality
- Email-based password reset
- Secure token generation and validation

### 4.2 Dashboard

#### 4.2.1 Admin Dashboard
---

## API Documentation

All API endpoints follow RESTful conventions and return JSON responses. Authentication is required for most endpoints using JWT Bearer tokens.

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation completed successfully"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* Optional error details */ }
}
```

---

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "ADMIN|CONVENER|STAFF"
}
```

**Response:** User object with JWT token

**Authentication:** Not required

---

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "ADMIN"
  }
}
```

**Authentication:** Not required

---

#### POST /api/auth/logout
Logout current user (clear client-side token).

**Authentication:** Required

---

#### POST /api/auth/forgot-password
Request password reset token via email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Authentication:** Not required

---

#### POST /api/auth/reset-password
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "string"
}
```

**Authentication:** Not required

---

#### POST /api/auth/change-password
Change password for authenticated user.

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Authentication:** Required

---

#### GET /api/auth/me
Get current authenticated user profile.

**Response:** User object with staff details (if applicable)

**Authentication:** Required

---

#### PATCH /api/auth/me
Update current user profile.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "profilePicture": "string"
}
```

**Authentication:** Required

---

#### POST /api/auth/profile-photo
Upload profile photo for authenticated user.

**Request:** Multipart form data with `photo` field

**Authentication:** Required

---

### Meeting Endpoints

#### GET /api/meetings
Get all meetings with filtering options.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `search`: string (search in title/description)
- `meetingTypeId`: number
- `organizerStaffId`: number
- `venueId`: number
- `startDate`: ISO date string
- `endDate`: ISO date string
- `isCancelled`: boolean
- `status`: "upcoming|past|cancelled"

**Response:** Paginated meetings list

**Authentication:** Required

---

#### POST /api/meetings
Create a new meeting.

**Request Body:**
```json
{
  "meetingTitle": "string",
  "meetingDescription": "string",
  "meetingDate": "2026-02-20",
  "meetingStartTime": "2026-02-20T10:00:00Z",
  "meetingEndTime": "2026-02-20T11:00:00Z",
  "meetingTypeId": 1,
  "organizerStaffId": 1,
  "venueId": 1,
  "meetingLink": "https://meet.example.com",
  "memberIds": [1, 2, 3]
}
```

**Response:** Created meeting object

**Authentication:** Required (Admin/Convener)

**Side Effects:** Sends notifications to all meeting members

---

#### GET /api/meetings/[id]
Get meeting details by ID.

**Response:** Meeting object with related data (members, documents, venue, organizer)

**Authentication:** Required

---

#### PATCH /api/meetings/[id]
Update meeting details.

**Request Body:** Partial meeting object

**Authentication:** Required (Admin/Convener/Organizer)

---

#### DELETE /api/meetings/[id]
Delete a meeting permanently.

**Authentication:** Required (Admin only)

---

#### POST /api/meetings/[id]/cancel
Cancel a meeting with reason.

**Request Body:**
```json
{
  "cancellationReason": "string"
}
```

**Response:** Updated meeting with cancellation details

**Authentication:** Required (Admin/Convener/Organizer)

---

#### GET /api/meetings/[id]/members
Get all members of a specific meeting.

**Response:** List of meeting members with staff details and attendance

**Authentication:** Required

---

#### POST /api/meetings/[id]/members
Add member to a meeting.

**Request Body:**
```json
{
  "staffId": 1
}
```

**Authentication:** Required (Admin/Convener/Organizer)

---

#### DELETE /api/meetings/[id]/members/[memberId]
Remove member from a meeting.

**Authentication:** Required (Admin/Convener/Organizer)

---

#### GET /api/meetings/[id]/attendance
Get attendance records for a meeting.

**Response:** List of attendance records with staff details

**Authentication:** Required

---

#### POST /api/meetings/[id]/attendance
Mark attendance for meeting members.

**Request Body:**
```json
{
  "attendance": [
    {
      "staffId": 1,
      "isPresent": true,
      "remarks": "On time"
    }
  ]
}
```

**Authentication:** Required (Admin/Convener/Organizer)

---

#### GET /api/meetings/[id]/documents
Get all documents for a specific meeting.

**Response:** List of documents with uploader details

**Authentication:** Required

---

#### GET /api/meetings/calendar
Get meetings in calendar format.

**Query Parameters:**
- `month`: number (1-12)
- `year`: number
- `view`: "month|week|day"

**Response:** Meetings grouped by date

**Authentication:** Required

---

#### GET /api/meetings/upcoming
Get upcoming meetings for authenticated user.

**Query Parameters:**
- `limit`: number (default: 5)
- `days`: number (default: 7, next N days)

**Authentication:** Required

---

### Document Endpoints

#### GET /api/documents
Get all documents with filtering.

**Query Parameters:**
- `page`: number
- `limit`: number
- `meetingId`: number
- `search`: string
- `uploadedBy`: number
- `startDate`: ISO date
- `endDate`: ISO date

**Authentication:** Required

---

#### POST /api/documents/upload
Upload a document to a meeting.

**Request:** Multipart form data
- `file`: File
- `meetingId`: number
- `documentTitle`: string

**Response:** Created document object with Vercel Blob URL

**Authentication:** Required (Admin/Convener)

**Side Effects:** Sends notifications to meeting participants

**Storage:** Vercel Blob Storage

---

#### GET /api/documents/[id]
Get document details by ID.

**Response:** Document object with meeting and uploader details

**Authentication:** Required

---

#### DELETE /api/documents/[id]
Delete a document permanently.

**Authentication:** Required (Admin/Convener/Uploader)

**Side Effects:** Deletes file from Vercel Blob

---

#### POST /api/documents/bulk-delete
Delete multiple documents at once.

**Request Body:**
```json
{
  "documentIds": [1, 2, 3]
}
```

**Authentication:** Required (Admin only)

---

#### GET /api/documents/meetings
Get documents grouped by meetings.

**Query Parameters:**
- `limit`: number (meetings limit)

**Authentication:** Required

---

### Staff Endpoints

#### GET /api/staff
Get all staff members with filtering.

**Query Parameters:**
- `page`: number
- `limit`: number
- `search`: string (name, email, designation)
- `departmentId`: number
- `isActive`: boolean

**Response:** Paginated staff list with department details

**Authentication:** Required

---

#### POST /api/staff
Create a new staff member.

**Request Body:**
```json
{
  "userId": 1,
  "staffName": "string",
  "designation": "string",
  "mobileNo": "string",
  "emailAddress": "string",
  "departmentId": 1,
  "profilePicture": "string"
}
```

**Authentication:** Required (Admin only)

---

#### GET /api/staff/[id]
Get staff member details by ID.

**Response:** Staff object with user, department, meeting statistics

**Authentication:** Required

---

#### PATCH /api/staff/[id]
Update staff member details.

**Request Body:** Partial staff object

**Authentication:** Required (Admin/Self)

---

#### DELETE /api/staff/[id]
Delete/deactivate staff member.

**Query Parameters:**
- `hardDelete`: boolean (true = permanent delete, false = deactivate)

**Authentication:** Required (Admin only)

---

#### GET /api/staff/attendance
Get attendance records for staff members.

**Query Parameters:**
- `staffId`: number
- `startDate`: ISO date
- `endDate`: ISO date

**Authentication:** Required

---

### Department Endpoints

#### GET /api/departments
Get all departments with filtering.

**Query Parameters:**
- `search`: string
- `isActive`: boolean

**Response:** List of departments with staff count

**Authentication:** Required

---

#### POST /api/departments
Create a new department.

**Request Body:**
```json
{
  "departmentName": "string"
}
```

**Authentication:** Required (Admin only)

---

#### GET /api/departments/[id]
Get department details by ID.

**Response:** Department object with staff list

**Authentication:** Required

---

#### PATCH /api/departments/[id]
Update department details.

**Request Body:**
```json
{
  "departmentName": "string",
  "isActive": boolean
}
```

**Authentication:** Required (Admin only)

---

#### DELETE /api/departments/[id]
Delete/deactivate department.

**Query Parameters:**
- `hardDelete`: boolean

**Authentication:** Required (Admin only)

---

### Venue Endpoints

#### GET /api/venues
Get all venues with filtering.

**Query Parameters:**
- `search`: string
- `venueType`: "PHYSICAL|VIRTUAL"
- `isActive`: boolean

**Response:** List of venues with meeting count

**Authentication:** Required

---

#### POST /api/venues
Create a new venue.

**Request Body:**
```json
{
  "venueName": "string",
  "venueType": "PHYSICAL|VIRTUAL",
  "location": "string"
}
```

**Authentication:** Required (Admin only)

---

#### GET /api/venues/[id]
Get venue details by ID.

**Response:** Venue object with upcoming meetings

**Authentication:** Required

---

#### PATCH /api/venues/[id]
Update venue details.

**Request Body:** Partial venue object

**Authentication:** Required (Admin only)

---

#### DELETE /api/venues/[id]
Delete/deactivate venue.

**Query Parameters:**
- `hardDelete`: boolean (only works for inactive venues)

**Authentication:** Required (Admin only)

---

### Meeting Type Endpoints

#### GET /api/meeting-types
Get all meeting types with filtering.

**Query Parameters:**
- `search`: string
- `isActive`: boolean

**Response:** List of meeting types with usage count

**Authentication:** Required

---

#### POST /api/meeting-types
Create a new meeting type.

**Request Body:**
```json
{
  "meetingTypeName": "string"
}
```

**Authentication:** Required (Admin only)

---

#### GET /api/meeting-types/[id]
Get meeting type details by ID.

**Authentication:** Required

---

#### PATCH /api/meeting-types/[id]
Update meeting type details.

**Request Body:** Partial meeting type object

**Authentication:** Required (Admin only)

---

#### DELETE /api/meeting-types/[id]
Delete/deactivate meeting type.

**Query Parameters:**
- `hardDelete`: boolean (only works for inactive types)

**Authentication:** Required (Admin only)

---

### User Endpoints

#### GET /api/users
Get all users with filtering.

**Query Parameters:**
- `role`: "ADMIN|CONVENER|STAFF"
- `isActive`: boolean
- `search`: string

**Authentication:** Required (Admin only)

---

#### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "ADMIN|CONVENER|STAFF"
}
```

**Authentication:** Required (Admin only)

---

#### GET /api/users/[id]
Get user details by ID.

**Authentication:** Required (Admin/Self)

---

#### PATCH /api/users/[id]
Update user details.

**Request Body:** Partial user object

**Authentication:** Required (Admin/Self)

---

#### DELETE /api/users/[id]
Delete/deactivate user.

**Authentication:** Required (Admin only)

---

### Notification Endpoints

#### GET /api/notifications
Get notifications for authenticated user.

**Query Parameters:**
- `limit`: number (default: 20)
- `unreadOnly`: boolean

**Response:**
```json
{
  "notifications": [ /* Notification array */ ],
  "unreadCount": 5
}
```

**Authentication:** Required

---

#### PATCH /api/notifications/[id]/read
Mark a notification as read.

**Authentication:** Required

---

#### PATCH /api/notifications/mark-all-read
Mark all notifications as read for authenticated user.

**Authentication:** Required

---

### Report Endpoints

#### GET /api/reports
Get all reports with filtering.

**Query Parameters:**
- `reportType`: "MEETING_SUMMARY|ATTENDANCE|DEPARTMENT"
- `meetingId`: number
- `startDate`: ISO date
- `endDate`: ISO date

**Authentication:** Required

---

#### POST /api/reports/generate
Generate a new report.

**Request Body:**
```json
{
  "reportType": "MEETING_SUMMARY|ATTENDANCE|DEPARTMENT",
  "reportName": "string",
  "meetingId": 1,
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "filters": { /* Optional filters */ }
}
```

**Authentication:** Required (Admin/Convener)

---

#### GET /api/reports/[id]
Get report details and download link.

**Authentication:** Required

---

#### DELETE /api/reports/[id]
Delete a report.

**Authentication:** Required (Admin/Generator)

---

### Dashboard Endpoints

#### GET /api/dashboard
Get dashboard statistics for authenticated user.

**Response:**
```json
{
  "totalMeetings": 50,
  "upcomingMeetings": 5,
  "totalStaff": 25,
  "totalDepartments": 8,
  "recentMeetings": [ /* Array */ ],
  "attendanceRate": 92.5,
  "documentCount": 120
}
```

**Role-specific data returned based on user role**

**Authentication:** Required

---

### Search Endpoint

#### GET /api/search
Global search across meetings, documents, and staff.

**Query Parameters:**
- `q`: string (search query, required)
- `limit`: number (default: 10 per category)

**Response:**
```json
{
  "meetings": [ /* Matching meetings */ ],
  "documents": [ /* Matching documents */ ],
  "staff": [ /* Matching staff */ ]
}
```

**Search Fields:**
- Meetings: title, description
- Documents: title, filename
- Staff: name, email, designation

**Authentication:** Required

---

### Settings Endpoint

#### GET /api/settings
Get system settings.

**Authentication:** Required (Admin only)

---

#### PATCH /api/settings
Update system settings.

**Request Body:**
```json
{
  "settingKey": "value"
}
```

**Authentication:** Required (Admin only)

---

### Support Ticket Endpoints

#### GET /api/support-tickets
Get all support tickets.

**Query Parameters:**
- `status`: "OPEN|IN_PROGRESS|RESOLVED|CLOSED"
- `category`: "TECHNICAL|FEATURE|BUG|GENERAL"
- `userId`: number

**Authentication:** Required

---

#### POST /api/support-tickets
Create a new support ticket.

**Request Body:**
```json
{
  "category": "TECHNICAL|FEATURE|BUG|GENERAL",
  "subject": "string",
  "message": "string"
}
```

**Authentication:** Required

---

## Service Layer

The application uses a service layer to separate business logic from API routes. All services are located in `/services` directory.

### AuthService (auth.service.ts)
Handles user authentication and authorization logic.

**Methods:**
- `register(userData)`: Register new user
- `login(credentials)`: Authenticate user
- `validateToken(token)`: Validate JWT token
- `resetPassword(email)`: Generate password reset token
- `changePassword(userId, passwords)`: Update user password

---

### MeetingService (meeting.service.ts)
Manages meeting operations and business logic.

**Methods:**
- `create(meetingData)`: Create new meeting with validations
- `update(id, meetingData)`: Update meeting details
- `delete(id)`: Delete meeting
- `getById(id)`: Fetch meeting with relations
- `findMany(filters)`: Get meetings with filtering and pagination
- `cancelMeeting(id, reason)`: Cancel meeting and notify members
- `getUpcoming(userId, days)`: Get upcoming meetings for user
- `getCalendarView(month, year)`: Get meetings for calendar display

---

### MeetingMemberService (meeting-member.service.ts)
Handles meeting member management and attendance.

**Methods:**
- `addMember(meetingId, staffId)`: Add member to meeting
- `removeMember(meetingId, staffId)`: Remove member from meeting
- `markAttendance(meetingId, attendanceData)`: Mark attendance for members
- `getAttendance(meetingId)`: Get attendance records
- `getMemberMeetings(staffId)`: Get all meetings for a staff member

---

### DocumentService (document.service.ts)
Manages document uploads and storage.

**Methods:**
- `upload(file, meetingId, metadata)`: Upload document to Vercel Blob
- `getById(id)`: Fetch document with relations
- `findMany(filters)`: Get documents with filtering
- `delete(id)`: Delete document and remove from blob storage
- `bulkDelete(documentIds)`: Delete multiple documents
- `getByMeeting(meetingId)`: Get all documents for a meeting

---

### StaffService (staff.service.ts)
Handles staff member operations.

**Methods:**
- `create(staffData)`: Create new staff member
- `update(id, staffData)`: Update staff details
- `delete(id, hardDelete)`: Delete or deactivate staff
- `getById(id)`: Fetch staff with relations
- `findMany(filters)`: Get staff with filtering and pagination
- `getAttendance(staffId, dateRange)`: Get attendance history
- `getByDepartment(departmentId)`: Get all staff in department

---

### DepartmentService (department.service.ts)
Manages department operations.

**Methods:**
- `create(departmentData)`: Create new department
- `update(id, departmentData)`: Update department
- `delete(id, hardDelete)`: Delete or deactivate department
- `getById(id)`: Fetch department with staff
- `findMany(filters)`: Get departments with filtering
- `getStaffCount(id)`: Get staff count for department

---

### VenueService (venue.service.ts)
Handles venue management.

**Methods:**
- `create(venueData)`: Create new venue
- `update(id, venueData)`: Update venue details
- `delete(id, hardDelete)`: Delete or deactivate venue
- `getById(id)`: Fetch venue with meetings
- `findMany(filters)`: Get venues with filtering
- `checkAvailability(venueId, dateTime)`: Check venue availability

---

### MeetingTypeService (meeting-type.service.ts)
Manages meeting types.

**Methods:**
- `create(typeData)`: Create new meeting type
- `update(id, typeData)`: Update meeting type
- `delete(id, hardDelete)`: Delete or deactivate meeting type
- `getById(id)`: Fetch meeting type
- `findMany(filters)`: Get meeting types with filtering
- `getUsageCount(id)`: Get meeting count for type
- `existsByName(name)`: Check if meeting type exists

---

### NotificationService (notification.service.ts)
Handles notification creation and management.

**Methods:**
- `create(notificationData)`: Create single notification
- `createMany(notifications)`: Bulk create notifications
- `getByUserId(userId, limit, unreadOnly)`: Get user notifications
- `getUnreadCount(userId)`: Count unread notifications
- `markAsRead(notificationId, userId)`: Mark notification as read
- `markAllAsRead(userId)`: Mark all notifications as read
- `deleteOld(days)`: Delete old notifications

**Helper Methods:**
- `notifyMeetingCreated(meetingId, meetingTitle, userIds)`: Send meeting creation notifications
- `notifyDocumentUploaded(documentTitle, meetingTitle, userIds)`: Send document upload notifications
- `notifyAttendanceMarked(meetingTitle, userIds)`: Send attendance notifications
- `notifyReportGenerated(reportName, userId)`: Send report generation notification

---

### ReportService (report.service.ts)
Manages report generation.

**Methods:**
- `generate(reportData)`: Generate report based on type
- `getById(id)`: Fetch report with relations
- `findMany(filters)`: Get reports with filtering
- `delete(id)`: Delete report file
- `generateMeetingSummary(meetingId)`: Generate meeting summary report
- `generateAttendanceReport(filters)`: Generate attendance report
- `generateDepartmentReport(filters)`: Generate department-wise report

---

### UserService (user.service.ts)
Handles user management operations.

**Methods:**
- `create(userData)`: Create new user
- `update(id, userData)`: Update user details
- `delete(id)`: Delete or deactivate user
- `getById(id)`: Fetch user with relations
- `findMany(filters)`: Get users with filtering
- `updateProfilePicture(userId, pictureUrl)`: Update profile picture

---

### DashboardService (dashboard.service.ts)
Provides dashboard statistics and analytics.

**Methods:**
- `getAdminDashboard()`: Get admin dashboard statistics
- `getConvenerDashboard(userId)`: Get convener dashboard data
- `getStaffDashboard(userId)`: Get staff dashboard data
- `getMeetingStats(dateRange)`: Get meeting statistics
- `getAttendanceStats(dateRange)`: Get attendance statistics
- `getDepartmentStats()`: Get department-wise statistics

---

## Authentication & Authorization

### JWT Authentication

The application uses JSON Web Tokens (JWT) for stateless authentication.

**Token Structure:**
```json
{
  "userId": 1,
  "username": "string",
  "role": "ADMIN",
  "staffId": 1,
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Token Storage:**
- Cookie: `token` (httpOnly, secure in production)
- Header: `Authorization: Bearer <token>`

**Token Expiration:** 7 days (configurable)

---

### Role-Based Access Control (RBAC)

#### ADMIN Role
- Full system access
- User management (create, update, delete users)
- Department management
- Staff management
- Venue management
- Meeting type management
- System settings
- All meeting operations
- Report generation
- Support ticket management

#### CONVENER Role
- Create and manage own meetings
- Upload documents
- Mark attendance
- Generate reports for own meetings
- View staff and departments
- View venues and meeting types
- Update own profile

#### STAFF Role
- View assigned meetings
- View meeting documents
- View own attendance
- Update own profile
- Create support tickets
- View notifications

---

### Protected Routes

**Public Routes:**
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password`

**Authenticated Routes:**
- `/admin/*` - Admin only
- `/convener/*` - Convener and Admin
- `/staff/*` - Staff, Convener, and Admin
- `/api/*` - Most API routes require authentication

---

### Authentication Utilities (lib/auth.ts)

**Functions:**
- `hashPassword(password)`: Hash password with bcrypt
- `comparePassword(password, hash)`: Verify password
- `generateToken(payload)`: Create JWT token
- `verifyToken(token)`: Validate and decode JWT
- `getUserFromRequest(request)`: Extract user from request
- `hasRole(user, roles)`: Check if user has required role

---

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn
- Git

### Clone Repository

```bash
git clone https://github.com/mr-baraiya/MOMS-Minutes-_of_Meeting_System.git
cd MOMS-Minutes-_of_Meeting_System/momm-system
```

### Install Dependencies

```bash
npm install
```

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE moms_db;
```

2. Run Prisma migrations:
```bash
npx prisma migrate dev
```

3. Seed database (optional):
```bash
npm run db:seed
```

4. Open Prisma Studio (optional):
```bash
npm run db:studio
```

---

## Environment Configuration

Create a `.env.local` file in the `momm-system` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/moms_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_token_here"

# Email Configuration (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="MOMS System <noreply@moms.com>"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# EmailJS (Optional - for contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID="your_service_id"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="your_template_id"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your_public_key"
```

### Environment Variables Explained

**DATABASE_URL**: PostgreSQL connection string
- Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
- Required for Prisma to connect to database

**JWT_SECRET**: Secret key for signing JWT tokens
- Should be a long random string
- Keep this secure and never commit to version control

**BLOB_READ_WRITE_TOKEN**: Vercel Blob storage token
- Get from Vercel dashboard
- Required for document uploads

**Email Configuration**: SMTP settings for sending emails
- Used for password resets and notifications
- Gmail requires App Password (not regular password)

---

## Running the Application

### Development Mode

```bash
npm run dev
```

Application will be available at `http://localhost:3000`

**Features in Dev Mode:**
- Hot reload
- Detailed error messages
- Turbopack bundler
- Source maps

---

### Production Build

```bash
npm run build
npm start
```

**Build Process:**
1. Generates Prisma Client
2. Compiles TypeScript
3. Optimizes assets
4. Creates production bundle

---

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Seed database with sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

---

## Project Structure

```
momm-system/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── admin/                    # Admin dashboard pages
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── departments/
│   │   ├── staff/
│   │   ├── venues/
│   │   ├── meeting-types/
│   │   ├── meetings/
│   │   ├── documents/
│   │   ├── reports/
│   │   └── settings/
│   ├── convener/                 # Convener dashboard pages
│   │   ├── dashboard/
│   │   ├── meetings/
│   │   ├── documents/
│   │   └── reports/
│   ├── staff/                    # Staff dashboard pages
│   │   ├── dashboard/
│   │   ├── meetings/
│   │   └── documents/
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── meetings/             # Meeting CRUD & operations
│   │   ├── documents/            # Document management
│   │   ├── staff/                # Staff management
│   │   ├── departments/          # Department management
│   │   ├── venues/               # Venue management
│   │   ├── meeting-types/        # Meeting type management
│   │   ├── users/                # User management
│   │   ├── reports/              # Report generation
│   │   ├── notifications/        # Notification system
│   │   ├── dashboard/            # Dashboard statistics
│   │   ├── search/               # Global search
│   │   ├── settings/             # System settings
│   │   └── support-tickets/      # Support tickets
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── layouts/                  # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── meetings/                 # Meeting components
│   │   ├── MeetingModal.tsx
│   │   ├── MeetingCard.tsx
│   │   ├── MeetingListTable.tsx
│   │   └── AttendanceForm.tsx
│   ├── documents/                # Document components
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentCard.tsx
│   │   └── DocumentListTable.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── StatsCard.tsx
│   │   ├── RecentMeetings.tsx
│   │   └── Chart.tsx
│   ├── venues/                   # Venue components
│   │   ├── VenueModal.tsx
│   │   └── VenueListTable.tsx
│   ├── meeting-types/            # Meeting type components
│   │   ├── MeetingTypeModal.tsx
│   │   └── MeetingTypeListTable.tsx
│   └── common/                   # Shared components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Table.tsx
│       └── Loading.tsx
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Authentication context
├── hooks/                        # Custom React hooks
│   └── useAuthGuard.ts           # Auth guard hook
├── lib/                          # Utility libraries
│   ├── prisma.ts                 # Prisma client instance
│   ├── auth.ts                   # Auth utilities
│   ├── api-utils.ts              # API response utilities
│   ├── validations.ts            # Input validations
│   ├── constants.ts              # Application constants
│   ├── email.ts                  # Email utilities
│   └── role-utils.ts             # Role-based utilities
├── services/                     # Business logic layer
│   ├── auth.service.ts
│   ├── meeting.service.ts
│   ├── meeting-member.service.ts
│   ├── document.service.ts
│   ├── staff.service.ts
│   ├── department.service.ts
│   ├── venue.service.ts
│   ├── meeting-type.service.ts
│   ├── user.service.ts
│   ├── notification.service.ts
│   ├── report.service.ts
│   ├── dashboard.service.ts
│   └── index.ts
├── types/                        # TypeScript type definitions
│   ├── models.ts                 # Database model types
│   ├── api.ts                    # API request/response types
│   └── index.ts
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Database seeding
│   └── migrations/               # Database migrations
├── public/                       # Static assets
│   └── uploads/                  # Local file uploads
├── docs/                         # Documentation
│   ├── API_TESTING_GUIDE.md
│   ├── AUTHENTICATION_GUIDE.md
│   ├── BLOB_INTEGRATION_SUMMARY.md
│   ├── DASHBOARD_ARCHITECTURE.md
│   ├── DOCUMENTS_FEATURE.md
│   └── ...
├── .env.local                    # Environment variables
├── .gitignore
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## Key Features Implementation

### File Upload System
- Uses Vercel Blob for cloud storage
- Supports multiple file formats (PDF, DOCX, XLSX, etc.)
- Automatic file validation and size limits
- Secure access with authentication
- Automatic cleanup on deletion

### Notification System
- Event-driven architecture
- Real-time notifications via polling
- Push notifications for meeting changes
- Email notifications for important events
- Notification preferences per user
- Mark as read/unread functionality

### Search System
- Full-text search across multiple entities
- Debounced search for performance
- Category-based result grouping
- Real-time search suggestions
- Relevance-based sorting

### Dashboard Analytics
- Role-specific dashboard views
- Real-time statistics
- Interactive charts (Recharts)
- Date range filtering
- Export capabilities
- Cached data for performance

### Calendar Integration
- Month/Week/Day views
- Meeting scheduling with time slots
- Conflict detection
- Drag-and-drop rescheduling (planned)
- iCal export (planned)

---

## Security Features

### Authentication Security
- JWT token-based authentication
- Secure password hashing (bcrypt)
- Token expiration and refresh
- Password reset with time-limited tokens
- Email verification (planned)

### Authorization Security
- Role-based access control (RBAC)
- Route-level protection
- API endpoint authorization
- Resource-level permissions
- Ownership validation

### Data Security
- SQL injection prevention (Prisma ORM)
- XSS protection (React escaping)
- CSRF protection
- Secure HTTP headers
- Input validation (Zod)
- File upload validation

### Infrastructure Security
- Environment variable protection
- Secure cookie settings
- HTTPS enforcement (production)
- Rate limiting (planned)
- Audit logging (planned)

---

## Performance Optimizations

- Server-side rendering (SSR)
- Static generation where applicable
- Image optimization (Next.js Image)
- Code splitting and lazy loading
- Database query optimization (Prisma)
- Response caching
- Debounced search
- Pagination for large datasets
- Connection pooling

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is private and proprietary. All rights reserved.

---

## Support

For support, email support@moms-system.com or create a support ticket in the application.

---

## Changelog

### Version 0.1.0 (Current)
- Initial release
- Complete authentication system
- Meeting management
- Document management
- Staff and department management
- Venue and meeting type management
- Notification system
- Global search
- Dashboard analytics
- Report generation
- Support ticket system

---

## Roadmap

### Planned Features
- Real-time collaboration on minutes
- AI-powered meeting summaries
- Calendar integration (Google Calendar, Outlook)
- Mobile application (React Native)
- Video conferencing integration
- Advanced analytics dashboard
- Custom report builder
- Email notifications
- SMS notifications
- Two-factor authentication
- API rate limiting
- Webhook support
- Public API documentation
- Multi-language support
- Dark mode
- Accessibility improvements (WCAG 2.1)

---

## Technical Debt & Known Issues

- Email service needs production SMTP configuration
- File upload size limits need tuning
- Search performance needs optimization for large datasets
- Calendar view needs conflict detection improvements
- Mobile responsiveness needs enhancement
- Unit tests need to be added
- Integration tests need to be added
- CI/CD pipeline needs to be set up

---

## Credits

Developed by the MOMS Development Team

**Technologies:**
- Next.js by Vercel
- React by Meta
- Prisma by Prisma
- PostgreSQL by PostgreSQL Global Development Group
- Tailwind CSS by Tailwind Labs

---

**Last Updated:** February 13, 2026
**Version:** 0.1.0
**Status:** Active Development

#### 4.7.3 Meeting Attendance
- Check-in/check-out system
- Real-time attendance tracking
- Attendance status:
  - Present
  - Absent
  - Late
  - Excused
- Generate attendance reports

#### 4.7.4 Meeting Members
- Add/remove participants
- Assign roles (Chair, Secretary, Member)
- Send invitations
- Track RSVP status

### 4.8 Minutes Recording

#### 4.8.1 Record Minutes
- Real-time minute recording during meetings
- Rich text editor for formatting
- Capture:
  - Discussions
  - Decisions
  - Action items
  - Next steps
- Auto-save functionality

#### 4.8.2 Action Items
- Create action items with:
  - Description
  - Assigned to
  - Due date
  - Priority level
  - Status tracking
- Link to parent meeting
- Send notifications

#### 4.8.3 Minutes Approval
- Submit minutes for review
- Approval workflow
- Version control
- Finalize and lock minutes

### 4.9 Document Management

#### 4.9.1 Upload Documents
- Attach documents to meetings:
  - Agendas
  - Presentations
  - Supporting documents
  - Minutes (PDF export)
- Supported formats: PDF, DOCX, XLSX, PPTX

#### 4.9.2 Document Access
- Role-based document access
- Download documents
- View document history
- Share documents with members

### 4.10 Calendar Integration

#### 4.10.1 Meeting Calendar
- Monthly/Weekly/Daily calendar views
- Display upcoming meetings
- Filter by:
  - Meeting type
  - Department
  - Venue
- Export to external calendars (iCal)

#### 4.10.2 Personal Schedule
- Individual meeting schedule
- Meeting reminders
- Conflict detection
- Time zone support

### 4.11 Reporting & Analytics

#### 4.11.1 Meeting Reports
- Generate reports:
  - Meeting attendance summary
  - Department-wise meetings
  - Meeting frequency analysis
  - Action item completion rates
- Export formats: PDF, Excel, CSV

#### 4.11.2 Analytics Dashboard
- Visual charts and graphs
- Meeting trends
- Attendance patterns
- Performance metrics

## 5. API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Dashboard
- `GET /api/dashboard` - Dashboard statistics

### Departments
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create department
- `GET /api/departments/[id]` - Get department details
- `PUT /api/departments/[id]` - Update department
- `DELETE /api/departments/[id]` - Delete department

### Staff
- `GET /api/staff` - List all staff
- `POST /api/staff` - Create staff
- `GET /api/staff/[id]` - Get staff details
- `PUT /api/staff/[id]` - Update staff
- `DELETE /api/staff/[id]` - Delete staff

### Meeting Types
- `GET /api/meeting-types` - List all meeting types
- `POST /api/meeting-types` - Create meeting type
- `GET /api/meeting-types/[id]` - Get meeting type
- `PUT /api/meeting-types/[id]` - Update meeting type
- `DELETE /api/meeting-types/[id]` - Delete meeting type

### Venues
- `GET /api/venues` - List all venues
- `POST /api/venues` - Create venue
- `GET /api/venues/[id]` - Get venue details
- `PUT /api/venues/[id]` - Update venue
- `DELETE /api/venues/[id]` - Delete venue

### Meetings
- `GET /api/meetings` - List all meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/[id]` - Get meeting details
- `PUT /api/meetings/[id]` - Update meeting
- `DELETE /api/meetings/[id]` - Delete meeting
- `GET /api/meetings/calendar` - Calendar view
- `GET /api/meetings/upcoming` - Upcoming meetings
- `POST /api/meetings/[id]/attendance` - Mark attendance
- `POST /api/meetings/[id]/members` - Add members
- `POST /api/meetings/[id]/documents` - Upload documents
- `POST /api/meetings/[id]/cancel` - Cancel meeting

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## 6. Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Environment Variables
Create a `.env` file in the `momm-system` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/moms_db"
JWT_SECRET="your-secret-key"
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_USER="your-email@example.com"
EMAIL_PASSWORD="your-email-password"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/mr-baraiya/MOMS-Minutes-_of_Meeting_System.git
   cd MOMS-Minutes_of_Meeting_System/momm-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   ```
   http://localhost:3000
   ```

### Database Schema
The system uses Prisma ORM with the following main models:
- User
- Department
- Staff
- MeetingType
- Venue
- Meeting
- MeetingMember
- Attendance
- Document
- ActionItem

See `prisma/schema.prisma` for complete schema definition.

## 7. Usage Guide

### For Admins
1. Login with admin credentials
2. Configure system settings (departments, meeting types, venues)
3. Register staff members
4. Oversee all meetings and reports
5. Generate analytics and reports

### For Staff
1. Login with staff credentials
2. View assigned meetings
3. Record meeting minutes
4. Manage action items
5. Upload meeting documents

### For Members
1. Login with member credentials
2. View invited meetings
3. Access meeting documents
4. View personal meeting history

## 8. Project Structure

```
momm-system/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
├── services/              # Business logic services
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── docs/                  # Documentation

```

## 9. Testing

### API Testing
Refer to `momm-system/docs/API_TESTING_GUIDE.md` for detailed API testing instructions.

### Testing Tools
- Postman collection available
- Thunder Client (VS Code extension)
- Unit tests with Jest (planned)

## 10. Future Enhancements

- [ ] Real-time notifications (WebSocket/Push notifications)
- [ ] Email notifications for meeting invitations and reminders
- [ ] Advanced analytics dashboard with charts
- [ ] Mobile application (React Native)
- [ ] Integration with Microsoft Teams/Zoom
- [ ] AI-powered minute summarization
- [ ] Voice-to-text for minute recording
- [ ] Multi-language support
- [ ] Automated meeting minutes generation
- [ ] Digital signature for minutes approval
- [ ] Advanced search and filtering
- [ ] Workflow automation
- [ ] Custom report builder

## 11. Documentation

For detailed documentation, refer to:
- [API Testing Guide](momm-system/docs/API_TESTING_GUIDE.md)
- [API Base URL Guide](momm-system/docs/API_BASE_URL_GUIDE.md)
- [Environment Setup](momm-system/docs/ENVIRONMENT_SETUP.md)

## 12. Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 13. License

This project is licensed under the MIT License - see the LICENSE file for details.

## 14. Contact & Support

For questions or support:
- Email: support@moms-system.com
- Documentation: See `/docs` folder
- Issues: GitHub Issues page

---

**MOMS - Minutes of Meeting System** | Making meeting management effortless and efficient.
