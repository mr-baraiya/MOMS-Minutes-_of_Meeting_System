# MOMS - Minutes of Meeting Management System

A comprehensive full-stack web application for managing organizational meetings, attendance tracking, document management, and automated reporting with role-based access control.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Environment Configuration](#environment-configuration)
7. [Database Setup](#database-setup)
8. [Authentication System](#authentication-system)
9. [API Documentation](#api-documentation)
10. [Service Layer](#service-layer)
11. [Component Library](#component-library)
12. [User Roles & Permissions](#user-roles--permissions)
13. [Development Workflow](#development-workflow)
14. [Testing](#testing)
15. [Deployment](#deployment)
16. [Scripts](#scripts)

---

## Overview

The Minutes of Meeting Management System (MOMS) is an enterprise-grade application built with Next.js 16 and React 19, leveraging the latest App Router architecture. The system provides a complete solution for managing organizational meetings with features including:

- JWT-based authentication with role-based access control
- Real-time meeting scheduling and management
- Digital attendance tracking with timestamps
- Document management with Vercel Blob storage
- Automated notification system
- Interactive dashboards with analytics
- Comprehensive reporting capabilities
- Global search functionality
- Support ticket system

### Key Differentiators

- **Layered Architecture**: Service layer separated for mobile app reusability
- **Type Safety**: Full TypeScript implementation with Prisma ORM
- **Modern UI**: Tailwind CSS 4 with Framer Motion animations
- **Security First**: bcrypt password hashing, JWT tokens, input validation
- **Scalable**: PostgreSQL database with connection pooling
- **Developer Experience**: Hot reload, Turbopack, Prisma Studio

---

## Technology Stack

### Core Framework
- **Next.js**: 16.1.6 (App Router with React Server Components)
- **React**: 19.2.3 (with Server Actions support)
- **TypeScript**: 5.x (strict mode enabled)
- **Node.js**: 18+ required

### UI Layer
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React 0.563.0 (600+ icons)
- **Animations**: Framer Motion 12.34.0, GSAP 3.14.2
- **Charts**: Recharts 3.7.0
- **Notifications**: React Hot Toast 2.6.0, SweetAlert2 11.26.18

### Backend Technologies
- **Database**: PostgreSQL 14+ (Neon serverless)
- **ORM**: Prisma 7.2.0 (with client generation)
- **Authentication**: JSON Web Tokens (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs 3.0.3 (10 salt rounds)
- **Validation**: Zod 4.3.6 (runtime type checking)

### File Storage
- **Vercel Blob**: 2.2.0 (cloud file storage)
- **File Uploads**: Multipart form data handling

### Email Services
- **Nodemailer**: 7.0.12 (SMTP email sending)
- **EmailJS**: 4.4.1 (browser-based email)

### Development Tools
- **Linting**: ESLint 9 with Next.js config
- **Build Tool**: Turbopack (Next.js built-in)
- **Package Manager**: npm
- **Database GUI**: Prisma Studio

---

## Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Client Browser                           │
│              (React Components, Next.js Pages)                │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTPS
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                   Next.js Server (Edge)                       │
│  ┌────────────────────────────────────────────────────┐      │
│  │            API Routes Layer (/app/api)             │      │
│  │  - Request validation (Zod)                        │      │
│  │  - JWT authentication                              │      │
│  │  - Role-based authorization                        │      │
│  │  - Response formatting                             │      │
│  └────────────────────┬───────────────────────────────┘      │
│                       │                                        │
│  ┌────────────────────▼───────────────────────────────┐      │
│  │          Services Layer (/services)                │      │
│  │  - Business logic                                  │      │
│  │  - Data validation                                 │      │
│  │  - Transaction management                          │      │
│  │  - External API integration                        │      │
│  │  *** REUSABLE FOR MOBILE APP ***                   │      │
│  └────────────────────┬───────────────────────────────┘      │
│                       │                                        │
│  ┌────────────────────▼───────────────────────────────┐      │
│  │           Prisma ORM Client                        │      │
│  │  - Query building                                  │      │
│  │  - Type generation                                 │      │
│  │  - Connection pooling                              │      │
│  └────────────────────┬───────────────────────────────┘      │
└────────────────────────┼─────────────────────────────────────┘
                         │ TCP/SSL
                         │
┌────────────────────────▼─────────────────────────────────────┐
│              PostgreSQL Database (Neon)                       │
│  - 11 Tables                                                  │
│  - 5 Enums                                                    │
│  - Foreign keys with cascading                                │
│  - Indexes on frequently queried fields                       │
└───────────────────────────────────────────────────────────────┘

External Services:
┌──────────────────┐    ┌──────────────────┐
│  Vercel Blob     │    │   SMTP Server    │
│  (File Storage)  │    │  (Nodemailer)    │
└──────────────────┘    └──────────────────┘
```

### Application Flow

```
User Request → Middleware (Auth) → API Route Handler → Service Layer
                                                              │
                                                              ▼
                                   ┌─────────────────────────────────┐
                                   │  Prisma ORM                     │
                                   │  - Query construction           │
                                   │  - Type safety                  │
                                   └─────────────┬───────────────────┘
                                                 │
                                                 ▼
                                   ┌─────────────────────────────────┐
                                   │  PostgreSQL Database            │
                                   │  - Data persistence             │
                                   └─────────────────────────────────┘
                                                 │
                                                 ▼
Response ← JSON Formatting ← Service Response ← Query Results
```

### Mobile App Reusability

The architecture is designed to support both web and mobile applications:

```typescript
// Services and types can be shared with mobile apps
momm-system/
├── services/          # ✓ Reusable in React Native
├── types/             # ✓ Reusable in React Native
└── lib/
    ├── validations.ts # ✓ Reusable (Zod schemas)
    └── api-utils.ts   # ✗ Web-specific
```

**Mobile Integration Example:**
```typescript
// In React Native app
import { MeetingService } from '@moms/shared/services';
import { Meeting, CreateMeetingRequest } from '@moms/shared/types';

// Use same business logic
const meeting = await MeetingService.create(meetingData);
```

---

## Project Structure

```
momm-system/
├── app/                              # Next.js App Router
│   ├── api/                          # API Routes (RESTful)
│   │   ├── auth/                     # Authentication
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   ├── forgot-password/route.ts
│   │   │   ├── reset-password/route.ts
│   │   │   ├── change-password/route.ts
│   │   │   └── profile-photo/route.ts
│   │   ├── meetings/                 # Meeting Management
│   │   │   ├── route.ts              # GET, POST
│   │   │   ├── [id]/route.ts         # GET, PATCH, DELETE
│   │   │   ├── [id]/cancel/route.ts
│   │   │   ├── [id]/members/route.ts
│   │   │   ├── [id]/members/[memberId]/route.ts
│   │   │   ├── [id]/attendance/route.ts
│   │   │   ├── [id]/documents/route.ts
│   │   │   ├── calendar/route.ts
│   │   │   └── upcoming/route.ts
│   │   ├── documents/                # Document Management
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   ├── upload/route.ts
│   │   │   ├── bulk-delete/route.ts
│   │   │   └── meetings/route.ts
│   │   ├── staff/                    # Staff Management
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── attendance/route.ts
│   │   ├── departments/              # Department Management
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── venues/                   # Venue Management
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── meeting-types/            # Meeting Type Management
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── users/                    # User Management
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── notifications/            # Notification System
│   │   │   ├── route.ts
│   │   │   ├── [id]/read/route.ts
│   │   │   └── mark-all-read/route.ts
│   │   ├── reports/                  # Report Generation
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── generate/route.ts
│   │   ├── dashboard/route.ts        # Dashboard Statistics
│   │   ├── search/route.ts           # Global Search
│   │   ├── settings/route.ts         # System Settings
│   │   └── support-tickets/route.ts  # Support Tickets
│   ├── auth/                         # Auth Pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── admin/                        # Admin Dashboard
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   ├── departments/page.tsx
│   │   ├── staff/page.tsx
│   │   ├── venues/page.tsx
│   │   ├── meeting-types/page.tsx
│   │   ├── meetings/page.tsx
│   │   ├── meetings/[id]/attendance/page.tsx
│   │   ├── documents/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── attendance/page.tsx
│   │   ├── settings/page.tsx
│   │   └── profile/page.tsx
│   ├── convener/                     # Convener Dashboard
│   │   ├── dashboard/page.tsx
│   │   ├── meetings/page.tsx
│   │   ├── meetings/[id]/attendance/page.tsx
│   │   ├── documents/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── settings/page.tsx
│   │   └── profile/page.tsx
│   ├── staff/                        # Staff Dashboard
│   │   ├── dashboard/page.tsx
│   │   ├── meetings/page.tsx
│   │   ├── documents/page.tsx
│   │   ├── attendance/page.tsx
│   │   ├── settings/page.tsx
│   │   └── profile/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── help/
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── globals.css                   # Global Tailwind styles
│   ├── layout.tsx                    # Root layout with providers
│   └── page.tsx                      # Landing page
├── components/                       # React Components
│   ├── layouts/
│   │   ├── DashboardLayout.tsx       # Main dashboard wrapper
│   │   ├── Sidebar.tsx               # Role-based navigation
│   │   ├── Header.tsx                # Search, notifications, profile
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── RecentMeetings.tsx
│   │   ├── UpcomingMeetings.tsx
│   │   ├── SystemActivity.tsx
│   │   └── AttendanceChart.tsx
│   ├── meetings/
│   │   ├── MeetingModal.tsx
│   │   ├── MeetingCard.tsx
│   │   ├── MeetingListTable.tsx
│   │   ├── MeetingCalendar.tsx
│   │   └── AttendanceForm.tsx
│   ├── documents/
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentCard.tsx
│   │   └── DocumentListTable.tsx
│   ├── venues/
│   │   ├── VenueModal.tsx
│   │   └── VenueListTable.tsx
│   ├── meeting-types/
│   │   ├── MeetingTypeModal.tsx
│   │   └── MeetingTypeListTable.tsx
│   ├── calendar/
│   │   └── CalendarView.tsx
│   ├── reports/
│   │   ├── ReportGenerator.tsx
│   │   └── ReportList.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Loading.tsx
│   │   └── Pagination.tsx
│   ├── ContactForm.tsx
│   └── Navbar.tsx
├── contexts/                         # React Contexts
│   └── AuthContext.tsx               # Global auth state
├── hooks/                            # Custom React Hooks
│   └── useAuthGuard.ts               # Route protection
├── lib/                              # Utilities
│   ├── prisma.ts                     # Prisma client singleton
│   ├── auth.ts                       # JWT & bcrypt utilities
│   ├── api-utils.ts                  # API response helpers
│   ├── validations.ts                # Zod schemas
│   ├── email.ts                      # Email utilities
│   ├── constants.ts                  # App constants
│   ├── role-utils.ts                 # Role-based helpers
│   └── index.ts
├── services/                         # Business Logic (REUSABLE)
│   ├── auth.service.ts               # Authentication
│   ├── user.service.ts               # User management
│   ├── staff.service.ts              # Staff management
│   ├── department.service.ts         # Department management
│   ├── meeting.service.ts            # Meeting operations
│   ├── meeting-member.service.ts     # Meeting participants
│   ├── meeting-type.service.ts       # Meeting types
│   ├── venue.service.ts              # Venue management
│   ├── document.service.ts           # Document handling
│   ├── notification.service.ts       # Notifications
│   ├── report.service.ts             # Report generation
│   ├── dashboard.service.ts          # Dashboard data
│   └── index.ts
├── types/                            # TypeScript Types (REUSABLE)
│   ├── models.ts                     # Database models
│   ├── api.ts                        # API types
│   └── index.ts
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Demo data seeder
│   └── migrations/                   # Migration history
├── docs/                             # Documentation
│   ├── API_TESTING_GUIDE.md
│   ├── AUTHENTICATION_GUIDE.md
│   ├── BLOB_INTEGRATION_SUMMARY.md
│   ├── DASHBOARD_ARCHITECTURE.md
│   ├── DOCUMENTS_FEATURE.md
│   ├── ENVIRONMENT_SETUP.md
│   └── README.md
├── public/                           # Static assets
│   └── uploads/
├── .env.local                        # Environment variables
├── .gitignore
├── eslint.config.mjs                 # ESLint configuration
├── next.config.ts                    # Next.js configuration
├── next-env.d.ts                     # Next.js TypeScript types
├── package.json                      # Dependencies
├── postcss.config.mjs                # PostCSS configuration
├── prisma.config.ts                  # Prisma configuration
├── proxy.ts                          # Proxy configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (comes with Node.js)
- **PostgreSQL**: 14.x or higher (or Neon account)
- **Git**: For version control

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/mr-baraiya/MOMS-Minutes-_of_Meeting_System.git
cd MOMS-Minutes-_of_Meeting_System/momm-system
```

#### 2. Install Dependencies

```bash
npm install
```

This will install all packages defined in `package.json`:
- Production dependencies (Next.js, React, Prisma, etc.)
- Development dependencies (ESLint, TypeScript types, etc.)

#### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [Environment Configuration](#environment-configuration))

#### 4. Database Setup

**Option A: Using Neon (Recommended for development)**

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Seed database with demo data
npm run db:seed
```

**Option B: Local PostgreSQL**

```bash
# Create database
createdb moms_db

# Update DATABASE_URL in .env.local
# postgresql://username:password@localhost:5432/moms_db

# Run migrations
npx prisma migrate dev

# Seed database
npm run db:seed
```

#### 5. Verify Database (Optional)

```bash
npm run db:studio
```

This opens Prisma Studio at `http://localhost:5555` for visual database management.

#### 6. Start Development Server

```bash
npm run dev
```

Application will be available at:
- **URL**: http://localhost:3000
- **API**: http://localhost:3000/api

#### 7. Login with Demo Credentials

See [Demo Credentials](#demo-credentials) section below.

---

## Environment Configuration

### Required Environment Variables

Create `.env.local` file with the following variables:

```env
# Database Configuration
# For Neon with connection pooling:
DATABASE_URL="postgresql://user:password@host.neon.tech:5432/database?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@host.neon.tech:5432/database?sslmode=require"

# For local PostgreSQL:
# DATABASE_URL="postgresql://username:password@localhost:5432/moms_db"

# JWT Configuration
JWT_SECRET="your-super-secret-key-min-32-characters-long-change-this"

# Vercel Blob Storage (for document uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_XXXXXXXXXX"

# Email Configuration (Nodemailer - SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-specific-password"
EMAIL_FROM="MOMS System <noreply@moms.com>"

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# EmailJS Configuration (Optional - for contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID="service_xxxxxxx"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="template_xxxxxxx"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="xxxxxxxxxxxxxxx"

# Node Environment
NODE_ENV="development"
```

### Environment Variables Explained

**DATABASE_URL**
- Prisma connection string for queries
- Use pooled connection for Neon (with `pgbouncer=true`)
- Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?options`

**DIRECT_URL**
- Direct database connection for migrations
- Required for Neon (pooled connections don't support migrations)
- Omit `pgbouncer=true` parameter

**JWT_SECRET**
- Secret key for signing JWT tokens
- Must be at least 32 characters
- Use strong random string: `openssl rand -base64 32`
- Never commit to version control

**BLOB_READ_WRITE_TOKEN**
- Vercel Blob storage authentication token
- Get from Vercel dashboard: Settings → Storage → Create Token
- Required for document upload functionality

**Email Configuration**
- Gmail requires App Password (not regular password)
- Enable 2FA first, then generate App Password
- Other SMTP providers: adjust host/port accordingly

---

## Database Setup

### Schema Overview

The application uses 11 tables with relationships:

**Core Tables:**
- `users` - User accounts and authentication
- `staff` - Staff profiles linked to users
- `department` - Organizational departments
- `meetings` - Meeting records
- `meeting_member` - Meeting participants
- `meeting_type` - Meeting categories
- `venue` - Meeting locations
- `documents` - File attachments
- `reports` - Generated reports
- `notifications` - User notifications
- `support_tickets` - Help desk tickets

### Running Migrations

**Development:**
```bash
npx prisma migrate dev --name description_of_changes
```

**Production:**
```bash
npx prisma migrate deploy
```

**Reset Database (caution):**
```bash
npx prisma migrate reset
```

### Seeding Demo Data

The seed script creates:
- 1 Admin user
- 2 Convener users
- 5 Staff users
- 5 Departments
- 3 Meeting Types
- 4 Venues
- 10 Sample meetings with members
- Sample documents and reports

```bash
npm run db:seed
```

### Database Management

**Open Prisma Studio:**
```bash
npm run db:studio
```

Prisma Studio provides:
- Visual data browser
- CRUD operations
- Relationship visualization
- Query testing

---

## Authentication System

### JWT Token Flow

```
1. User Login (POST /api/auth/login)
   ↓
2. Validate credentials (bcrypt.compare)
   ↓
3. Generate JWT token (jwt.sign)
   ↓
4. Set HTTP-only cookie + return token
   ↓
5. Client stores token in cookie
   ↓
6. Subsequent requests include token
   ↓
7. Server validates token (jwt.verify)
   ↓
8. Extract user.userId, user.role, user.staffId
   ↓
9. Authorize based on role
   ↓
10. Process request
```

### Token Structure

```typescript
interface JWTPayload {
  userId: number;
  username: string;
  role: 'ADMIN' | 'CONVENER' | 'STAFF';
  staffId?: number; // Only for CONVENER and STAFF
  iat: number;      // Issued at
  exp: number;      // Expiration
}
```

### Token Storage

**Server-side (Recommended):**
- HTTP-only cookie named `token`
- Secure flag in production
- SameSite: Strict
- 7-day expiration

**Client-side (Alternative):**
- `Authorization: Bearer <token>` header
- localStorage (not recommended for security)

### Password Security

**Hashing:**
```typescript
import bcrypt from 'bcryptjs';

// Registration
const hashedPassword = await bcrypt.hash(password, 10);

// Login verification
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Reset Flow:**
1. User requests reset (email)
2. Generate secure random token
3. Store token with 1-hour expiry
4. Send email with reset link
5. User clicks link, provides new password
6. Validate token and expiry
7. Hash new password and update

---

## API Documentation

### Response Format

All API responses follow a consistent structure:

**Success Response:**
```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description",
  "details": { /* Optional error details */ }
}
```

### Authentication Required

Most endpoints require JWT token in one of:
- Cookie: `token=<jwt_token>`
- Header: `Authorization: Bearer <jwt_token>`

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `POST /api/auth/logout` - Logout (clear token)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password` - Reset with token
- `POST /api/auth/change-password` - Change password

**Meetings:**
- `GET /api/meetings` - List meetings (with filters)
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/[id]` - Get meeting details
- `PATCH /api/meetings/[id]` - Update meeting
- `DELETE /api/meetings/[id]` - Delete meeting
- `POST /api/meetings/[id]/cancel` - Cancel meeting
- `GET /api/meetings/[id]/members` - Get participants
- `POST /api/meetings/[id]/members` - Add participant
- `POST /api/meetings/[id]/attendance` - Mark attendance
- `GET /api/meetings/upcoming` - Upcoming meetings
- `GET /api/meetings/calendar` - Calendar view

**Documents:**
- `GET /api/documents` - List documents
- `POST /api/documents/upload` - Upload file
- `GET /api/documents/[id]` - Get document
- `DELETE /api/documents/[id]` - Delete document
- `POST /api/documents/bulk-delete` - Delete multiple

**Staff:**
- `GET /api/staff` - List staff
- `POST /api/staff` - Create staff
- `GET /api/staff/[id]` - Get staff details
- `PATCH /api/staff/[id]` - Update staff
- `DELETE /api/staff/[id]` - Delete staff

**Notifications:**
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/[id]/read` - Mark as read
- `PATCH /api/notifications/mark-all-read` - Mark all

**Search:**
- `GET /api/search?q=query` - Global search

**Dashboard:**
- `GET /api/dashboard` - Get dashboard stats

See full API documentation in `/docs/API_TESTING_GUIDE.md`

---

## Service Layer

Services contain business logic and are reusable across web and mobile platforms.

### AuthService (auth.service.ts)

```typescript
class AuthService {
  register(userData): Promise<User>
  login(credentials): Promise<{ token: string; user: User }>
  validateToken(token): JWTPayload | null
  resetPassword(email): Promise<void>
  changePassword(userId, passwords): Promise<void>
}
```

### MeetingService (meeting.service.ts)

```typescript
class MeetingService {
  create(data): Promise<Meeting>
  update(id, data): Promise<Meeting>
  delete(id): Promise<void>
  getById(id): Promise<Meeting | null>
  findMany(filters): Promise<Meeting[]>
  cancelMeeting(id, reason): Promise<Meeting>
  getUpcoming(userId, days): Promise<Meeting[]>
  getCalendarView(month, year): Promise<Meeting[]>
}
```

### DocumentService (document.service.ts)

```typescript
class DocumentService {
  upload(file, meetingId, metadata): Promise<Document>
  getById(id): Promise<Document | null>
  findMany(filters): Promise<Document[]>
  delete(id): Promise<void>
  bulkDelete(ids): Promise<number>
}
```

### NotificationService (notification.service.ts)

```typescript
class NotificationService {
  create(data): Promise<Notification>
  createMany(notifications): Promise<number>
  getByUserId(userId, limit, unreadOnly): Promise<Notification[]>
  getUnreadCount(userId): Promise<number>
  markAsRead(notificationId, userId): Promise<void>
  markAllAsRead(userId): Promise<void>
  
  // Helper methods
  notifyMeetingCreated(meetingId, title, userIds): Promise<void>
  notifyDocumentUploaded(docTitle, meetingTitle, userIds): Promise<void>
}
```

All services use Prisma Client for database operations and follow consistent error handling patterns.

---

## Component Library

### Layout Components

**DashboardLayout.tsx**
- Main wrapper for dashboard pages
- Includes Sidebar and Header
- Responsive design (mobile drawer)
- Role-based navigation

**Sidebar.tsx**
- Role-specific navigation menu
- Lucide icons for each item
- Active route highlighting
- Collapsible on mobile

**Header.tsx**
- Global search with live results
- Notification dropdown
- User profile menu
- Debounced search (300ms)

### UI Components

**Common:**
- `Button.tsx` - Reusable button with variants
- `Input.tsx` - Form input with validation
- `Modal.tsx` - Dialog/modal wrapper
- `Table.tsx` - Data table with sorting
- `Loading.tsx` - Loading states
- `Pagination.tsx` - Page navigation

**Meeting Components:**
- `MeetingModal.tsx` - Create/edit meeting form
- `MeetingCard.tsx` - Meeting summary card
- `MeetingListTable.tsx` - Meeting data table
- `AttendanceForm.tsx` - Mark attendance UI

**Document Components:**
- `DocumentUpload.tsx` - File upload interface
- `DocumentCard.tsx` - Document preview card
- `DocumentListTable.tsx` - Document data table

### Styling Conventions

- **Tailwind CSS**: Utility-first styling
- **Responsive**: Mobile-first breakpoints
- **Dark Mode**: Not yet implemented (planned)
- **Animations**: Framer Motion for transitions

---

## User Roles & Permissions

### Role Hierarchy

```
ADMIN (Full Access)
  ├── System Configuration
  ├── User Management
  ├── All CONVENER permissions
  └── All STAFF permissions

CONVENER (Meeting Manager)
  ├── Create/Edit/Cancel Meetings
  ├── Manage Meeting Participants
  ├── Upload Documents
  ├── Mark Attendance
  ├── Generate Reports
  └── All STAFF permissions (for assigned meetings)

STAFF (Basic User)
  ├── View Assigned Meetings
  ├── View Meeting Documents
  ├── View Own Attendance
  └── Update Own Profile
```

### Permission Matrix

| Feature | Admin | Convener | Staff |
|---------|-------|----------|-------|
| Create Meetings | Yes | Yes | No |
| Edit Own Meetings | Yes | Yes | No |
| Edit All Meetings | Yes | No | No |
| Cancel Meetings | Yes | Yes (own) | No |
| Mark Attendance | Yes | Yes (own meetings) | No |
| Upload Documents | Yes | Yes | No |
| View All Meetings | Yes | Yes | No |
| View Assigned Meetings | Yes | Yes | Yes |
| User Management | Yes | No | No |
| Department Management | Yes | No | No |
| Venue Management | Yes | No | No |
| Meeting Type Management | Yes | No | No |
| Generate Reports | Yes | Yes | No |
| System Settings | Yes | No | No |

### Demo Credentials

| Role | Username | Password | Staff ID |
|------|----------|----------|----------|
| Admin | admin | password123 | N/A |
| Convener | rajesh.kumar | password123 | 1 |
| Convener | priya.sharma | password123 | 2 |
| Staff | amit.patel | password123 | 3 |
| Staff | sneha.verma | password123 | 4 |
| Staff | vikram.singh | password123 | 5 |
| Staff | neha.gupta | password123 | 6 |
| Staff | rahul.joshi | password123 | 7 |

---

## Development Workflow

### Starting Development

```bash
# Start dev server
npm run dev

# In separate terminal - watch database changes
npm run db:studio
```

### Making Database Changes

1. Edit `prisma/schema.prisma`
2. Create migration:
```bash
npx prisma migrate dev --name add_new_field
```
3. Prisma Client auto-regenerates

### Adding New Features

1. Create service method in `/services`
2. Add API route in `/app/api`
3. Create UI components in `/components`
4. Add page in `/app/[role]/` directory
5. Update types in `/types`

### Code Style

- **ESLint**: Run `npm run lint` before commit
- **TypeScript**: Strict mode enabled
- **Naming**: camelCase for functions, PascalCase for components
- **File Structure**: Group by feature, not by type

---

## Testing

### Manual Testing

Use the included demo credentials to test different user roles.

### API Testing

Use tools like:
- **Postman**: Import endpoints from `/docs/API_TESTING_GUIDE.md`
- **Thunder Client**: VS Code extension
- **curl**: Command-line testing

Example:
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Use token in subsequent requests
curl http://localhost:3000/api/meetings \
  -H "Authorization: Bearer <token>"
```

### Database Testing

```bash
# Open Prisma Studio
npm run db:studio

# Reset and reseed database
npx prisma migrate reset
npm run db:seed
```

---

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Import to Vercel:**
- Go to vercel.com
- Import repository
- Configure environment variables
- Deploy

3. **Set Environment Variables in Vercel:**
- DATABASE_URL
- JWT_SECRET
- BLOB_READ_WRITE_TOKEN
- Email configuration

4. **Configure Build:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Database Migrations in Production

```bash
# After deploying code
npx prisma migrate deploy
```

---

## Scripts

Available npm scripts:

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:seed          # Seed database with demo data
npm run db:studio        # Open Prisma Studio (http://localhost:5555)

# Code Quality
npm run lint             # Run ESLint
```

### Script Details

**npm run dev**
- Starts Next.js dev server with Turbopack
- Hot reload enabled
- Available at http://localhost:3000
- API routes at http://localhost:3000/api

**npm run build**
- Runs `prisma generate` first
- Compiles TypeScript
- Optimizes for production
- Creates `.next` directory

**npm start**
- Runs production build
- Requires `npm run build` first
- Uses optimized code

**npm run db:seed**
- Runs `prisma/seed.ts`
- Creates demo users, meetings, departments
- Idempotent (safe to run multiple times)

**npm run db:studio**
- Visual database management tool
- Browse data
- Run queries
- Edit records

---

## Documentation

Additional documentation available in `/docs` directory:

- **API_TESTING_GUIDE.md** - API endpoint testing
- **AUTHENTICATION_GUIDE.md** - Auth system details
- **BLOB_INTEGRATION_SUMMARY.md** - File storage setup
- **DASHBOARD_ARCHITECTURE.md** - Dashboard design
- **DOCUMENTS_FEATURE.md** - Document management
- **ENVIRONMENT_SETUP.md** - Environment config
- **IMPLEMENTATION_SUMMARY.md** - Project status

---

## License

This project is proprietary and confidential.

---

## Support

For issues or questions:

- Create a support ticket in the application
- Email: support@moms-system.com
- Check documentation in `/docs` folder

---

**Last Updated:** February 13, 2026  
**Version:** 0.1.0  
**Status:** Active Development
│   │   ├── StatCard.tsx
│   │   ├── RecentMeetings.tsx
│   │   ├── UpcomingMeetings.tsx
│   │   ├── SystemActivity.tsx
│   │   └── AttendanceHistory.tsx
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   └── Navbar.tsx
├── contexts/
│   └── AuthContext.tsx      # Global authentication state
├── lib/
│   ├── api-utils.ts         # API response helpers
│   ├── auth.ts              # JWT & bcrypt utilities
│   ├── validations.ts       # Zod validation schemas
│   ├── index.ts             # Library exports
│   └── prisma.ts            # Prisma client singleton
├── services/                # Business logic layer (reusable for mobile app)
│   ├── auth.service.ts      # Authentication service
│   ├── dashboard.service.ts # Dashboard service (role-based methods)
│   ├── department.service.ts
│   ├── document.service.ts
│   ├── meeting-member.service.ts
│   ├── meeting-type.service.ts
│   ├── meeting.service.ts
│   ├── report.service.ts
│   ├── staff.service.ts
│   ├── user.service.ts
│   ├── venue.service.ts
│   └── index.ts             # Service exports
├── types/                   # TypeScript types (reusable for mobile app)
│   ├── api.ts               # API request/response types
│   ├── models.ts            # Database model types
│   └── index.ts             # Type exports
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Demo data seeder
├── docs/
│   ├── IMPLEMENTATION_SUMMARY.md  # Project status & achievements ⭐
│   ├── AUTHENTICATION_GUIDE.md    # Auth system documentation
│   ├── LUCIDE_ICONS_GUIDE.md      # Icon usage guide
│   ├── DASHBOARD_GUIDE.md
│   ├── DASHBOARD_API.md
│   ├── DASHBOARD_COMPONENTS.md
│   ├── DASHBOARD_SERVICES.md
│   ├── FOLDER_STRUCTURE.md
│   ├── API_BASE_URL_GUIDE.md
│   ├── API_TESTING_GUIDE.md
│   └── ENVIRONMENT_SETUP.md
├── public/                  # Static assets
├── .env                     # Environment variables (JWT_SECRET, DATABASE_URL)
├── .env.example             # Environment template
├── package.json
├── prisma.config.ts         # Prisma configuration
└── tsconfig.json            # TypeScript configuration
```

## Architecture

The project follows a **layered architecture** for code reusability:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│              React Components, Pages, Hooks              │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                    API Routes (/api)                     │
│              Request validation, Auth checks             │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                 Services Layer (/services)               │
│     Business logic - REUSABLE FOR MOBILE APP            │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   Prisma ORM (/lib/prisma)               │
│                  Database operations                     │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   PostgreSQL (Supabase)                  │
└─────────────────────────────────────────────────────────┘
```

### Mobile App Reusability

The `services/` and `types/` folders can be directly reused in a React Native or other mobile app:

```typescript
// In mobile app, just change the import
import { MeetingService } from '@shared/services';
import { Meeting, CreateMeetingRequest } from '@shared/types';
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd momm-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Connect to Supabase via connection pooling (for queries)
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

   # Direct connection to the database (for migrations)
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed demo data**
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │────<│    staff    │>────│ department  │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │
      │                   │
      ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  documents  │>────│  meetings   │────<│meeting_type │
└─────────────┘     └─────────────┘     └─────────────┘
                          │                   
      ┌───────────────────┼───────────────────┐
      │                   │                   │
      ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   reports   │     │meeting_member│     │    venue    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Tables Overview

| Table | Description |
|-------|-------------|
| `users` | Authentication and authorization details |
| `department` | Organization departments |
| `staff` | Staff profiles linked to users |
| `meeting_type` | Categories of meetings |
| `venue` | Physical and virtual meeting locations |
| `meetings` | Core meeting information |
| `meeting_member` | Participants and attendance tracking |
| `documents` | MOM files and attachments |
| `reports` | Generated summary and meeting reports |

## User Roles

### Admin
- System management and maintenance
- Master data management (Meeting Types, Departments, Venues, Staff)
- View all meetings, attendance, and reports
- User access control and system configuration
- **Dashboard**: `/admin/dashboard`

### Convener (Meeting Organizer)
- Create, edit, and cancel meetings
- Add participants and mark attendance
- Upload MOM documents and related files
- View meeting-wise and summary reports
- **Dashboard**: `/convener/dashboard`

### Staff
- View assigned meetings and details
- Check attendance status
- View and download MOM documents
- Limited access based on assigned permissions
- **Dashboard**: `/staff/dashboard`

> **Note**: For detailed dashboard architecture and API integration, see [docs/DASHBOARD_ARCHITECTURE.md](docs/DASHBOARD_ARCHITECTURE.md)

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `password123` |
| Convener | `rajesh.kumar` | `password123` |
| Convener | `priya.sharma` | `password123` |
| Staff | `amit.patel` | `password123` |
| Staff | `sneha.verma` | `password123` |
| Staff | `vikram.singh` | `password123` |
| Staff | `neha.gupta` | `password123` |
| Staff | `rahul.joshi` | `password123` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio |

## API Routes (Planned)

```
Authentication
├── POST   /api/auth/login
├── POST   /api/auth/logout
└── GET    /api/auth/me

Users
├── GET    /api/users
├── GET    /api/users/:id
├── POST   /api/users
├── PUT    /api/users/:id
└── DELETE /api/users/:id

Meetings
├── GET    /api/meetings
├── GET    /api/meetings/:id
├── POST   /api/meetings
├── PUT    /api/meetings/:id
├── DELETE /api/meetings/:id
└── POST   /api/meetings/:id/cancel

Attendance
├── GET    /api/meetings/:id/members
├── POST   /api/meetings/:id/members
├── PUT    /api/meetings/:id/attendance
└── DELETE /api/meetings/:id/members/:memberId

Documents
├── GET    /api/meetings/:id/documents
├── POST   /api/meetings/:id/documents
└── DELETE /api/documents/:id

Master Data
├── GET    /api/departments
├── GET    /api/meeting-types
├── GET    /api/venues
└── GET    /api/staff

Reports
├── GET    /api/reports/summary
└── GET    /api/reports/meeting/:id
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ for efficient meeting management
</p>
