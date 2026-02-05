# MOMM - Minutes of Meeting Management System

A comprehensive web-based application designed to streamline how meetings are scheduled, recorded, and documented within an organization.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=flat-square&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [User Roles](#-user-roles)
- [Demo Credentials](#-demo-credentials)
- [Scripts](#-scripts)
- [API Routes](#-api-routes)
- [Contributing](#-contributing)

## Features

### Core Features
- **Authentication & Authorization** - JWT-based login/register with role-based access control
- **Role-Based Dashboards** - Personalized dashboards for Admin, Convener, and Staff
- **Meeting Management** - Create, edit, cancel, and view meetings
- **Attendance Tracking** - Add participants and mark attendance digitally
- **Document Management** - Upload, view, and download MOM documents
- **Reports & Analytics** - Generate meeting-wise and summary reports
- **Calendar View** - Visual representation of scheduled meetings

### User Features
- **Secure Authentication** - bcrypt password hashing + JWT tokens with HTTP-only cookies
- **Role-Based Access Control** - Admin, Convener, and Staff roles with different permissions
- **Personalized Dashboard** - Overview of relevant meetings, stats, and quick actions
- **Profile Management** - View and update user details
- **Export Options** - Export reports to Excel/PDF

### Security Features
- **Password Hashing** - bcrypt with 10 salt rounds
- **JWT Tokens** - Secure token-based authentication with 7-day expiration
- **Input Validation** - Zod schemas for all user inputs
- **HTTP-Only Cookies** - XSS protection for authentication tokens
- **Role Verification** - Permission checks on all protected routes

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma 7 |
| **Authentication** | JWT + bcryptjs |
| **Validation** | Zod |

## Project Structure

```
momm-system/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   │   ├── login/       # Login endpoint
│   │   │   ├── register/    # Registration endpoint
│   │   │   ├── logout/      # Logout endpoint
│   │   │   ├── me/          # Get current user
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── dashboard/       # Dashboard endpoints (role-based)
│   │   ├── departments/     # Department CRUD
│   │   ├── meeting-types/   # Meeting type CRUD
│   │   ├── meetings/        # Meeting CRUD + members, attendance, documents
│   │   ├── staff/           # Staff CRUD
│   │   ├── users/           # User CRUD
│   │   └── venues/          # Venue CRUD
│   ├── auth/                # Authentication pages
│   │   ├── login/           # Login page (with Lucide icons)
│   │   ├── register/        # Registration page (with Lucide icons)
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── dashboard/           # Role-based dashboards
│   │   ├── admin/           # Admin dashboard
│   │   ├── convener/        # Convener dashboard
│   │   └── staff/           # Staff dashboard
│   ├── generated/prisma/    # Prisma client (auto-generated)
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with AuthProvider
│   └── page.tsx             # Home page
├── components/
│   ├── layouts/             # Layout components
│   │   ├── DashboardLayout.tsx  # Main dashboard wrapper
│   │   ├── Sidebar.tsx          # Role-based navigation (Lucide icons)
│   │   └── Header.tsx           # Header with search & notifications (Lucide icons)
│   ├── dashboard/           # Dashboard components
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
- **Dashboard**: `/dashboard/admin`

### Convener (Meeting Organizer)
- Create, edit, and cancel meetings
- Add participants and mark attendance
- Upload MOM documents and related files
- View meeting-wise and summary reports
- **Dashboard**: `/dashboard/convener`

### Staff
- View assigned meetings and details
- Check attendance status
- View and download MOM documents
- Limited access based on assigned permissions
- **Dashboard**: `/dashboard/staff`

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
