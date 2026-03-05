# MOMS - Minutes of Meeting Management System

A full-stack web application for managing organizational meetings, attendance tracking, document management, and reporting with role-based access control.

## Features

- JWT-based authentication with role-based access (Admin, Convener, Staff)
- Meeting scheduling and management
- Digital attendance tracking
- Document management with file uploads
- Automated notification system
- Interactive dashboards and reporting
- Global search functionality

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with bcrypt
- **File Storage**: Vercel Blob
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mr-baraiya/MOMS-Minutes-_of_Meeting_System.git
cd MOMS-Minutes-_of_Meeting_System/momm-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT
JWT_SECRET="your-secret-key-min-32-characters"

# Vercel Blob (for file uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token"

# Email (optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

4. **Set up database**
```bash
npx prisma migrate dev
npx prisma generate
npm run db:seed
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Demo Credentials

After seeding, you can login with:
- **Admin**: admin@example.com / password123
- **Convener**: convener@example.com / password123  
- **Staff**: staff@example.com / password123

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database (caution)

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## Project Structure

```
momm-system/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── convener/          # Convener dashboard
│   └── staff/             # Staff dashboard
├── components/            # React Components
├── services/              # Business Logic
├── types/                 # TypeScript Types
├── prisma/               # Database schema
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

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
