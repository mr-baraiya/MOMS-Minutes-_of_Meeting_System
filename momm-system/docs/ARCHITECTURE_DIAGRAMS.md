# System Architecture Diagram

## Role-Based Dashboard Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACCESS                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    /dashboard (Router)
                              │
                              │ (Auto-redirect based on role)
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    ADMIN     │    │   CONVENER   │    │    STAFF     │
│  Dashboard   │    │  Dashboard   │    │  Dashboard   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ DashboardLayout │
                    │   (Wrapper)     │
                    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │   Sidebar    │    │    Header    │
            │  (Nav Menu)  │    │ (Search/User)│
            └──────────────┘    └──────────────┘
```

## Component Hierarchy

```
DashboardLayout (role: admin | convener | staff)
├── Sidebar (role-based navigation)
│   ├── Logo & Collapse Button
│   ├── Role Badge
│   ├── Navigation Menu (filtered by role)
│   └── Logout Button
│
├── Header
│   ├── Search Bar
│   ├── Quick Action Button (role-dependent)
│   ├── Notifications Dropdown
│   └── Profile Dropdown
│
└── Main Content (children)
    ├── Dashboard Stats (StatCard × N)
    ├── Content Sections
    │   ├── RecentMeetings
    │   ├── UpcomingMeetings
    │   ├── SystemActivity (admin only)
    │   └── AttendanceHistory (staff only)
    └── Quick Actions Grid
```

## Data Flow Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Next.js)                 │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Dashboard Page (admin/convener/staff)                     │
│         │                                                   │
│         │ useEffect() → fetchDashboardData()              │
│         │                                                   │
│         └────────────────┐                                 │
│                          ▼                                  │
│              fetch('/api/dashboard?role=...')              │
│                          │                                  │
└──────────────────────────┼─────────────────────────────────┘
                           │
┌──────────────────────────┼─────────────────────────────────┐
│                    API LAYER                                │
├────────────────────────────────────────────────────────────┤
│                          │                                  │
│         /api/dashboard/route.ts                            │
│                          │                                  │
│         ┌────────────────┴────────────────┐               │
│         │                                  │               │
│    role=admin?    role=convener?    role=staff?           │
│         │                │                │                │
│         └────────────────┴────────────────┘                │
│                          ▼                                  │
└──────────────────────────┼─────────────────────────────────┘
                           │
┌──────────────────────────┼─────────────────────────────────┐
│                  SERVICE LAYER                              │
├────────────────────────────────────────────────────────────┤
│                          │                                  │
│         DashboardService                                    │
│                          │                                  │
│    ┌────────────────────┼────────────────────┐            │
│    │                    │                    │             │
│    ▼                    ▼                    ▼             │
│ getAdminStats()  getConvenerStats()  getStaffDashboard()  │
│                                                             │
│    │                    │                    │             │
│    └────────────────────┴────────────────────┘             │
│                          │                                  │
└──────────────────────────┼─────────────────────────────────┘
                           │
┌──────────────────────────┼─────────────────────────────────┐
│                    DATABASE LAYER                           │
├────────────────────────────────────────────────────────────┤
│                          │                                  │
│                    Prisma ORM                               │
│                          │                                  │
│    ┌────────────────────┼────────────────────┐            │
│    │         │         │         │           │            │
│    ▼         ▼         ▼         ▼           ▼            │
│  users   meetings   staff   documents   departments       │
│  venues  meetingMembers  meetingTypes  reports            │
│                                                             │
└──────────────────────────┼─────────────────────────────────┘
                           │
                           ▼
                   PostgreSQL (Supabase)
```

## Navigation Menu by Role

```
┌─────────────────────────────────────────────────────────────┐
│                      ADMIN NAVIGATION                        │
├─────────────────────────────────────────────────────────────┤
│  📊 Dashboard                                               │
│  📅 Meetings                                                │
│  📆 Calendar                                                │
│  📄 Documents                                               │
│  📈 Reports                                                 │
│  ──────────────────────── (divider)                        │
│  👥 Users                                                   │
│  👤 Staff                                                   │
│  🏢 Departments                                             │
│  📍 Venues                                                  │
│  🏷️ Meeting Types                                          │
│  ──────────────────────── (divider)                        │
│  ⚙️ Settings                                                │
│  🚪 Logout                                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CONVENER NAVIGATION                       │
├─────────────────────────────────────────────────────────────┤
│  📊 Dashboard                                               │
│  📅 Meetings                                                │
│  📆 Calendar                                                │
│  📄 Documents                                               │
│  📈 Reports                                                 │
│  ──────────────────────── (divider)                        │
│  ⚙️ Settings                                                │
│  🚪 Logout                                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      STAFF NAVIGATION                        │
├─────────────────────────────────────────────────────────────┤
│  📊 Dashboard                                               │
│  📅 Meetings                                                │
│  📆 Calendar                                                │
│  📄 Documents                                               │
│  ✅ My Attendance                                           │
│  ──────────────────────── (divider)                        │
│  ⚙️ Settings                                                │
│  🚪 Logout                                                  │
└─────────────────────────────────────────────────────────────┘
```

## Dashboard Statistics Overview

```
┌──────────────────────────────────────────────────────────────┐
│                      ADMIN DASHBOARD                          │
├───────────────┬───────────────┬───────────────┬──────────────┤
│  Total Users  │ Total Meetings│  Departments  │    Venues    │
│      10       │      50       │       5       │      8       │
│    👥 +12%   │    📅 +8%    │      🏢       │     📍      │
├───────────────┴───────────────┴───────────────┴──────────────┤
│   Active      │   Completed   │   Cancelled   │              │
│     12        │      30       │       8       │              │
│    🟢        │      ✅       │      ❌       │              │
└───────────────┴───────────────┴───────────────┴──────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    CONVENER DASHBOARD                         │
├───────────┬───────────┬───────────┬───────────┬──────────────┤
│   My      │  Upcoming │ Completed │  Pending  │  Participants│
│ Meetings  │           │           │   Docs    │              │
│    15     │     5     │    10     │     2     │     45       │
│   📋     │    🔜    │    ✅     │    📄    │     👥      │
├───────────┴───────────┴───────────┴───────────┴──────────────┤
│                    This Week's Meetings: 3                    │
│                           📅                                  │
└───────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      STAFF DASHBOARD                          │
├───────────┬───────────┬───────────┬───────────┬──────────────┤
│ Assigned  │  Upcoming │ Attended  │  Missed   │   Pending    │
│     20    │     3     │    15     │     2     │      3       │
│   📋     │    🔜    │    ✅     │    ❌     │     ⏳      │
├───────────┴───────────┴───────────┴───────────┴──────────────┤
│              Documents Available: 18 📄                       │
└───────────────────────────────────────────────────────────────┘
```

## API Request/Response Flow

```
USER ACTION
    │
    │ Click Dashboard Link
    │
    ▼
┌─────────────────────────┐
│  Browser Navigation     │
│  /dashboard/admin       │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  Dashboard Page Loads   │
│  useEffect() triggers   │
└─────────────────────────┘
    │
    │ fetch()
    │
    ▼
┌─────────────────────────────────────────────┐
│  HTTP GET Request                           │
│  /api/dashboard?role=admin                  │
│  Headers: { ... }                           │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  API Route Handler                          │
│  - Parse query params                       │
│  - Validate role                            │
│  - Call appropriate service method          │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  DashboardService                           │
│  - Execute database queries via Prisma      │
│  - Aggregate data                           │
│  - Format response                          │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  Database Queries                           │
│  - prisma.meeting.count()                   │
│  - prisma.user.count()                      │
│  - prisma.department.count()                │
│  - etc.                                     │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  Response Sent                              │
│  {                                          │
│    success: true,                           │
│    data: { stats, meetings, ... }           │
│  }                                          │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  Dashboard State Updated                    │
│  - setData(result.data)                     │
│  - setLoading(false)                        │
│  - Components re-render                     │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  UI Displayed                               │
│  - Stats cards populated                    │
│  - Meeting lists rendered                   │
│  - Charts/graphs updated                    │
└─────────────────────────────────────────────┘
```

## Security & Access Control

```
┌────────────────────────────────────────────────┐
│              REQUEST FLOW                       │
└────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Authentication      │
        │   Middleware          │
        │   (To be implemented) │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Role Verification   │
        │   Check user.role     │
        └───────────────────────┘
                    │
            ┌───────┴───────┐
            │               │
            ▼               ▼
         ALLOWED        DENIED
            │               │
            ▼               ▼
    ┌──────────────┐  ┌──────────────┐
    │   Proceed    │  │  Redirect to │
    │   to Page    │  │  /forbidden  │
    └──────────────┘  └──────────────┘
```

---

**Legend:**
- 📊 Dashboard
- 📅 Meetings
- 📆 Calendar
- 📄 Documents
- 📈 Reports
- 👥 Users
- 👤 Staff
- 🏢 Departments
- 📍 Venues
- 🏷️ Meeting Types
- ⚙️ Settings
- 🚪 Logout
