# MOMS System - Backend Architecture & API Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Service Layer](#backend-service-layer)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Authentication & Authorization](#authentication--authorization)
5. [Database Schema](#database-schema)
6. [Environment Configuration](#environment-configuration)
7. [Best Practices](#best-practices)

---

## Architecture Overview

### System Architecture

The MOMS (Minutes of Meeting System) follows a three-tier architecture pattern:

```
┌──────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                    │
│  - React Components (Next.js 16.1.6)                        │
│  - UI State Management (React Hooks, Context API)           │
│  - Client-side Routing                                       │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS (REST API)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js Server)                │
│  - API Routes (app/api/**/route.ts)                         │
│  - Request Validation (Zod schemas)                          │
│  - JWT Authentication Middleware                             │
│  - Error Handling & Response Formatting                      │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ Function Calls
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  SERVICE LAYER (Business Logic)              │
│  - 12 Service Classes (services/*.service.ts)                │
│  - Business Rules & Validation                               │
│  - Data Transformation                                       │
│  - Transaction Management                                    │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ Prisma ORM
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  DATA LAYER (PostgreSQL)                     │
│  - 15+ Database Tables                                       │
│  - Relations & Constraints                                   │
│  - Indexes for Performance                                   │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend Framework:**
- Next.js 16.1.6 (App Router with TypeScript)
- Node.js Runtime

**Database:**
- PostgreSQL (Neon Cloud)
- Prisma ORM 7.2.0 (Type-safe database access)

**Authentication:**
- JWT (JSON Web Tokens)
- bcryptjs for password hashing

**File Storage:**
- Vercel Blob Storage (for documents)

**Email Service:**
- Nodemailer (SMTP)

---

## Backend Service Layer

### Service Architecture Pattern

All services follow a consistent static class pattern with standardized methods:

```typescript
export class ServiceName {
  // CRUD Operations
  static async create(data: CreateDTO): Promise<Model>
  static async getAll(filters?: FilterDTO): Promise<Model[]>
  static async getById(id: number): Promise<Model | null>
  static async update(id: number, data: UpdateDTO): Promise<Model>
  static async delete(id: number): Promise<void>
  
  // Business-specific operations
  static async customOperation(params): Promise<Result>
}
```

### 1. Authentication Service

**File:** `services/auth.service.ts`

**Purpose:** Handle user authentication, password management, and session validation

**Key Methods:**

```typescript
class AuthService {
  // User registration with password hashing
  static async register(data: RegisterDTO): Promise<User>
  
  // User login with credential validation
  static async login(username: string, password: string): Promise<{ user: User, token: string }>
  
  // Password change for authenticated users
  static async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void>
  
  // Password reset token generation
  static async generateResetToken(email: string): Promise<string>
  
  // Password reset with token validation
  static async resetPassword(token: string, newPassword: string): Promise<void>
}
```

**Business Logic:**
- Validates username/email uniqueness
- Hashes passwords using bcryptjs (10 salt rounds)
- Generates JWT tokens with 7-day expiration
- Creates password reset tokens (1-hour validity)
- Enforces password strength requirements

---

### 2. User Service

**File:** `services/user.service.ts`

**Purpose:** Manage user accounts and profiles

**Key Methods:**

```typescript
class UserService {
  // Get all users with pagination and filters
  static async getAll(page?: number, limit?: number, role?: string): Promise<{
    items: User[],
    total: number,
    page: number,
    limit: number
  }>
  
  // Get user by ID with staff relation
  static async getById(id: number): Promise<User | null>
  
  // Create new user account
  static async create(data: CreateUserDTO): Promise<User>
  
  // Update user profile
  static async update(id: number, data: UpdateUserDTO): Promise<User>
  
  // Soft delete user (deactivate)
  static async delete(id: number): Promise<void>
  
  // Check if email exists
  static async existsByEmail(email: string): Promise<boolean>
  
  // Check if username exists
  static async existsByUsername(username: string): Promise<boolean>
  
  // Get user by email
  static async getByEmail(email: string): Promise<User | null>
}
```

**Business Logic:**
- Enforces unique email and username constraints
- Validates role assignments (admin, convener, staff)
- Soft deletes by setting isActive = false
- Includes staff profile data when applicable
- Supports pagination with default 10 items per page

---

### 3. Staff Service

**File:** `services/staff.service.ts`

**Purpose:** Manage staff profiles and department assignments

**Key Methods:**

```typescript
class StaffService {
  // Get all staff with department and user details
  static async getAll(departmentId?: number, isActive?: boolean): Promise<Staff[]>
  
  // Get staff by ID with full relations
  static async getById(id: number): Promise<Staff | null>
  
  // Get staff by user ID
  static async getByUserId(userId: number): Promise<Staff | null>
  
  // Create staff profile
  static async create(data: CreateStaffDTO): Promise<Staff>
  
  // Update staff profile
  static async update(id: number, data: UpdateStaffDTO): Promise<Staff>
  
  // Soft delete staff
  static async delete(id: number): Promise<void>
  
  // Get staff attendance history
  static async getAttendance(staffId: number): Promise<Attendance[]>
}
```

**Business Logic:**
- Links staff to user accounts (userId foreign key)
- Associates staff with departments
- Tracks job titles and contact information
- Maintains attendance records
- Filters by department and active status

---

### 4. Department Service

**File:** `services/department.service.ts`

**Purpose:** Manage organizational departments

**Key Methods:**

```typescript
class DepartmentService {
  // Get all departments with staff count
  static async getAll(includeInactive?: boolean): Promise<Department[]>
  
  // Get department by ID with staff list
  static async getById(id: number): Promise<Department | null>
  
  // Create department
  static async create(data: CreateDepartmentDTO): Promise<Department>
  
  // Update department
  static async update(id: number, data: UpdateDepartmentDTO): Promise<Department>
  
  // Delete department (checks dependencies)
  static async delete(id: number): Promise<void>
  
  // Check if department name exists
  static async existsByName(name: string): Promise<boolean>
}
```

**Business Logic:**
- Validates unique department names
- Prevents deletion if staff are assigned
- Tracks department descriptions and metadata
- Supports soft delete with isActive flag

---

### 5. Meeting Service

**File:** `services/meeting.service.ts`

**Purpose:** Core meeting management with complex business rules

**Key Methods:**

```typescript
class MeetingService {
  // Get all meetings with filters
  static async getAll(filters: {
    status?: string,
    typeId?: number,
    venueId?: number,
    startDate?: Date,
    endDate?: Date,
    organizerId?: number
  }): Promise<Meeting[]>
  
  // Get meeting by ID with all relations
  static async getById(id: number): Promise<Meeting | null>
  
  // Create meeting with members
  static async create(data: CreateMeetingDTO): Promise<Meeting>
  
  // Update meeting details
  static async update(id: number, data: UpdateMeetingDTO): Promise<Meeting>
  
  // Cancel meeting
  static async cancel(id: number): Promise<Meeting>
  
  // Get upcoming meetings
  static async getUpcoming(userId?: number): Promise<Meeting[]>
  
  // Get calendar view meetings
  static async getCalendar(startDate: Date, endDate: Date): Promise<Meeting[]>
  
  // Get meeting documents
  static async getDocuments(meetingId: number): Promise<Document[]>
  
  // Get meeting members with attendance
  static async getMembers(meetingId: number): Promise<MeetingMember[]>
}
```

**Business Logic:**
- Validates meeting date/time conflicts
- Checks venue availability
- Creates meeting members from provided staff IDs
- Sends notifications to all participants
- Supports meeting status workflow (scheduled, completed, cancelled)
- Enforces organizer permissions

---

### 6. Meeting Member Service

**File:** `services/meeting-member.service.ts`

**Purpose:** Manage meeting participants and attendance

**Key Methods:**

```typescript
class MeetingMemberService {
  // Add member to meeting
  static async addMember(meetingId: number, staffId: number, isRequired?: boolean): Promise<MeetingMember>
  
  // Add multiple members
  static async addMembers(meetingId: number, staffIds: number[]): Promise<MeetingMember[]>
  
  // Remove member from meeting
  static async removeMember(meetingId: number, staffId: number): Promise<void>
  
  // Update member status
  static async updateMember(id: number, data: UpdateMemberDTO): Promise<MeetingMember>
  
  // Mark attendance
  static async markAttendance(id: number, status: 'PRESENT' | 'ABSENT' | 'LATE'): Promise<MeetingMember>
  
  // Get member by ID
  static async getById(id: number): Promise<MeetingMember | null>
  
  // Get all members for meeting
  static async getByMeetingId(meetingId: number): Promise<MeetingMember[]>
}
```

**Business Logic:**
- Prevents duplicate member assignments
- Tracks required vs optional attendance
- Records attendance status per meeting
- Maintains member join timestamps

---

### 7. Meeting Type Service

**File:** `services/meeting-type.service.ts`

**Purpose:** Manage meeting type classifications

**Key Methods:**

```typescript
class MeetingTypeService {
  // Get all meeting types with usage stats
  static async getAll(includeInactive?: boolean): Promise<MeetingType[]>
  
  // Get type by ID
  static async getById(id: number): Promise<MeetingType | null>
  
  // Create meeting type
  static async create(data: CreateMeetingTypeDTO): Promise<MeetingType>
  
  // Update meeting type
  static async update(id: number, data: UpdateMeetingTypeDTO): Promise<MeetingType>
  
  // Soft delete meeting type
  static async delete(id: number): Promise<void>
  
  // Hard delete (permanently remove)
  static async hardDelete(id: number): Promise<void>
  
  // Check if name exists
  static async existsByName(name: string): Promise<boolean>
}
```

**Business Logic:**
- Enforces unique type names
- Supports two-stage deletion (soft then hard)
- Tracks usage count per type
- Prevents deletion of types in use

---

### 8. Venue Service

**File:** `services/venue.service.ts`

**Purpose:** Manage meeting venues and rooms

**Key Methods:**

```typescript
class VenueService {
  // Get all venues with filters
  static async getAll(type?: string, isActive?: boolean): Promise<Venue[]>
  
  // Get venue by ID
  static async getById(id: number): Promise<Venue | null>
  
  // Create venue
  static async create(data: CreateVenueDTO): Promise<Venue>
  
  // Update venue
  static async update(id: number, data: UpdateVenueDTO): Promise<Venue>
  
  // Soft delete venue
  static async delete(id: number): Promise<void>
  
  // Hard delete venue
  static async hardDelete(id: number): Promise<void>
  
  // Check availability for time slot
  static async checkAvailability(
    venueId: number,
    startTime: Date,
    endTime: Date,
    excludeMeetingId?: number
  ): Promise<boolean>
}
```

**Business Logic:**
- Validates capacity constraints
- Checks venue availability for scheduling conflicts
- Supports venue types (conference_room, auditorium, virtual)
- Tracks location, capacity, and amenities
- Two-stage deletion process

---

### 9. Document Service

**File:** `services/document.service.ts`

**Purpose:** Manage meeting documents and file storage

**Key Methods:**

```typescript
class DocumentService {
  // Get all documents with filters
  static async getAll(meetingId?: number, uploadedBy?: number): Promise<Document[]>
  
  // Get document by ID
  static async getById(id: number): Promise<Document | null>
  
  // Create document record (after file upload)
  static async create(data: CreateDocumentDTO): Promise<Document>
  
  // Update document metadata
  static async update(id: number, data: UpdateDocumentDTO): Promise<Document>
  
  // Delete document (also deletes file from storage)
  static async delete(id: number): Promise<void>
  
  // Bulk delete documents
  static async bulkDelete(ids: number[]): Promise<void>
  
  // Get documents by meeting
  static async getByMeetingId(meetingId: number): Promise<Document[]>
}
```

**Business Logic:**
- Integrates with Vercel Blob storage
- Tracks document metadata (title, type, size, URL)
- Associates documents with meetings
- Records uploader and timestamp
- Supports bulk operations
- Sends notifications on upload

---

### 10. Report Service

**File:** `services/report.service.ts`

**Purpose:** Generate and manage meeting reports

**Key Methods:**

```typescript
class ReportService {
  // Get all reports with filters
  static async getAll(filters: {
    type?: string,
    startDate?: Date,
    endDate?: Date,
    generatedBy?: number
  }): Promise<Report[]>
  
  // Get report by ID
  static async getById(id: number): Promise<Report | null>
  
  // Generate new report
  static async generate(data: GenerateReportDTO): Promise<Report>
  
  // Delete report
  static async delete(id: number): Promise<void>
  
  // Get meetings for report period
  static async getMeetingsForReport(
    startDate: Date,
    endDate: Date,
    filters?: object
  ): Promise<Meeting[]>
}
```

**Business Logic:**
- Generates statistical reports for date ranges
- Aggregates meeting data
- Calculates attendance metrics
- Exports data in multiple formats
- Tracks report generation metadata

---

### 11. Notification Service

**File:** `services/notification.service.ts`

**Purpose:** Handle system notifications and alerts

**Key Methods:**

```typescript
class NotificationService {
  // Create single notification
  static async create(data: CreateNotificationDTO): Promise<Notification>
  
  // Create multiple notifications
  static async createMany(data: CreateNotificationDTO[]): Promise<void>
  
  // Get notifications for user
  static async getByUserId(
    userId: number,
    limit?: number,
    unreadOnly?: boolean
  ): Promise<Notification[]>
  
  // Get unread count
  static async getUnreadCount(userId: number): Promise<number>
  
  // Mark as read
  static async markAsRead(id: number, userId: number): Promise<void>
  
  // Mark all as read
  static async markAllAsRead(userId: number): Promise<void>
  
  // Delete old notifications
  static async deleteOld(olderThan: Date): Promise<void>
  
  // Helper: Notify meeting created
  static async notifyMeetingCreated(
    meetingId: number,
    meetingTitle: string,
    userIds: number[]
  ): Promise<void>
  
  // Helper: Notify document uploaded
  static async notifyDocumentUploaded(
    meetingId: number,
    documentTitle: string,
    userIds: number[]
  ): Promise<void>
  
  // Helper: Notify attendance marked
  static async notifyAttendanceMarked(
    meetingId: number,
    userId: number
  ): Promise<void>
  
  // Helper: Notify report generated
  static async notifyReportGenerated(
    reportId: number,
    reportTitle: string,
    userIds: number[]
  ): Promise<void>
}
```

**Business Logic:**
- Database-driven notification system
- Supports 8 notification types
- Real-time notification delivery
- Read/unread tracking
- Auto-cleanup of old notifications
- Event-triggered helpers

---

### 12. Dashboard Service

**File:** `services/dashboard.service.ts`

**Purpose:** Provide aggregated statistics and analytics

**Key Methods:**

```typescript
class DashboardService {
  // Get admin dashboard stats
  static async getAdminStats(): Promise<{
    totalUsers: number,
    totalMeetings: number,
    upcomingMeetings: number,
    totalDepartments: number,
    totalStaff: number,
    recentActivity: Activity[]
  }>
  
  // Get convener dashboard stats
  static async getConvenerStats(userId: number): Promise<{
    myMeetings: number,
    upcomingMeetings: Meeting[],
    pendingDocuments: number,
    recentActivity: Activity[]
  }>
  
  // Get staff dashboard stats
  static async getStaffStats(userId: number): Promise<{
    assignedMeetings: number,
    upcomingMeetings: Meeting[],
    attendanceRate: number,
    documents: Document[]
  }>
}
```

**Business Logic:**
- Role-specific dashboard data
- Calculates key metrics
- Aggregates recent activity
- Optimized queries with proper indexes

---

## API Endpoints Reference

### API Response Format

All API endpoints follow a consistent response structure:

**Success Response:**
```typescript
{
  success: true,
  data: any,           // Response payload
  message?: string     // Optional success message
}
```

**Error Response:**
```typescript
{
  success: false,
  error: string,       // Error message
  details?: any        // Optional error details
}
```

### Authentication Endpoints

**Base Path:** `/api/auth`

#### POST /api/auth/register
Register a new user account

**Request Body:**
```typescript
{
  username: string,        // Required, unique
  email: string,          // Required, unique, valid email
  password: string,       // Required, min 6 characters
  fullName: string,       // Required
  role: 'admin' | 'convener' | 'staff',  // Required
  departmentId?: number   // Required if role is 'staff'
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    user: User,
    token: string        // JWT token
  }
}
```

**Business Rules:**
- Username must be unique
- Email must be unique and valid
- Password minimum 6 characters
- Staff users must be assigned to department
- Automatically creates staff profile for staff role

---

#### POST /api/auth/login
Authenticate user and get JWT token

**Request Body:**
```typescript
{
  username: string,      // Can be username or email
  password: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    user: {
      id: number,
      username: string,
      email: string,
      role: string,
      fullName: string,
      staffId?: number
    },
    token: string        // JWT token (7 days validity)
  }
}
```

**Business Rules:**
- Accepts either username or email
- Verifies password hash
- Returns JWT token with user payload
- Token expires in 7 days

---

#### POST /api/auth/logout
Logout user (client-side token removal)

**Response:**
```typescript
{
  success: true,
  message: "Logged out successfully"
}
```

---

#### GET /api/auth/me
Get current authenticated user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  success: true,
  data: {
    user: User,
    staff?: Staff        // If user is staff member
  }
}
```

---

#### PATCH /api/auth/me
Update current user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  fullName?: string,
  email?: string,
  phoneNumber?: string,
  profilePhoto?: string
}
```

---

#### POST /api/auth/change-password
Change password for authenticated user

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  oldPassword: string,
  newPassword: string
}
```

---

#### POST /api/auth/forgot-password
Request password reset token

**Request Body:**
```typescript
{
  email: string
}
```

**Response:**
```typescript
{
  success: true,
  message: "Password reset email sent"
}
```

**Business Rules:**
- Generates reset token (1-hour validity)
- Sends email with reset link
- Token stored in database

---

#### POST /api/auth/reset-password
Reset password using token

**Request Body:**
```typescript
{
  token: string,
  newPassword: string
}
```

---

### User Management Endpoints

**Base Path:** `/api/users`

#### GET /api/users
Get all users (Admin only)

**Query Parameters:**
```typescript
{
  page?: number,         // Default: 1
  limit?: number,        // Default: 10
  role?: string,         // Filter by role
  search?: string        // Search username/email/fullName
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    items: User[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}
```

---

#### GET /api/users/[id]
Get user by ID (Admin only)

**Response:**
```typescript
{
  success: true,
  data: {
    user: User,
    staff?: Staff        // If user has staff<parameter>
</invoke>
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map((user: any) => (
        <div key={user.id}>{user.username}</div>
      ))}
    </div>
  );
}
```

### **3. Direct Fetch Example (Without API Client)**

```typescript
'use client';

import { useState } from 'react';

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('User created successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 🎯 **Quick Reference**

| Context | Location | URL Pattern | Example |
|---------|----------|-------------|---------|
| **Server Services** | `services/*.service.ts` | ❌ No URL (Direct DB) | `prisma.user.findMany()` |
| **API Routes** | `app/api/*/route.ts` | Internal (uses services) | `UserService.getAll()` |
| **Client Components** | React Components | ✅ `/api/*` | `fetch('/api/users')` |
| **External (Testing)** | Postman, cURL | ✅ Full URL | `http://localhost:3000/api/users` |

---

## 📝 **Summary**

### **For Services (Current Context):**
- **Purpose:** Server-side business logic
- **Database Access:** Direct via Prisma
- **No API URLs needed:** Services don't make HTTP calls
- **Usage:** Called by API routes in `app/api/` folder

### **For Client-Side Fetching:**
- **Base URL (Dev):** `http://localhost:3000/api`
- **Base URL (Prod):** `/api` (relative) or your domain
- **Use:** `fetch()`, `axios`, or custom API client

### **Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## ✅ **Best Practices**

1. ✅ **Use services for server-side logic** (direct Prisma access)
2. ✅ **Use API routes as endpoints** (call services)
3. ✅ **Use fetch/axios in client components** (call API routes)
4. ✅ **Use environment variables for base URLs**
5. ✅ **Create an API client wrapper for consistency**
6. ✅ **Handle errors properly in all layers**

---

**Last Updated:** January 2, 2026
