# Role-Based Dashboard Architecture

This document explains the role-based dashboard system implemented in the MOMM application.

## Folder Structure

```
app/
├── dashboard/
│   ├── page.tsx              # Router that redirects to role-specific dashboard
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── convener/
│   │   └── page.tsx          # Convener dashboard
│   └── staff/
│       └── page.tsx          # Staff dashboard
│
components/
├── layouts/
│   ├── DashboardLayout.tsx   # Main dashboard layout wrapper
│   ├── Sidebar.tsx           # Role-based navigation sidebar
│   └── Header.tsx            # Header with search, notifications, profile
│
└── dashboard/
    ├── StatCard.tsx          # Reusable statistics card
    ├── RecentMeetings.tsx    # Recent meetings list
    ├── UpcomingMeetings.tsx  # Upcoming meetings list
    ├── SystemActivity.tsx    # System activity feed (admin)
    └── AttendanceHistory.tsx # Attendance history (staff)
```

## User Roles

### 1. Admin Dashboard (`/dashboard/admin`)
**Capabilities:**
- View system-wide statistics
- Manage all users, departments, venues, and meeting types
- View all meetings and reports
- Monitor system activity

**Stats Displayed:**
- Total Users
- Total Meetings
- Total Departments
- Total Venues
- Active Meetings
- Completed Meetings
- Cancelled Meetings

**Components:**
- Recent Meetings (all)
- System Activity Log
- Quick Actions (Add User, Department, Venue, View Reports)

### 2. Convener Dashboard (`/dashboard/convener`)
**Capabilities:**
- Create and manage own meetings
- Add participants and mark attendance
- Upload MOM documents
- View meeting-wise reports

**Stats Displayed:**
- My Meetings
- Upcoming Meetings
- Completed Meetings
- Pending Documents
- Total Participants
- This Week's Meetings

**Components:**
- Upcoming Meetings List
- Recent Meetings
- Pending Tasks (documents to upload)
- Quick Actions (Create Meeting, Upload MOM, Mark Attendance, View Reports)

### 3. Staff Dashboard (`/dashboard/staff`)
**Capabilities:**
- View assigned meetings
- Check attendance status
- Download MOM documents
- View meeting calendar

**Stats Displayed:**
- Assigned Meetings
- Upcoming Meetings
- Attended Meetings
- Missed Meetings
- Pending Meetings
- Documents Available

**Components:**
- Upcoming Meetings
- Attendance History
- Recent Meeting Documents
- Quick Actions (View Calendar, My Attendance, Download MOMs)

## API Integration

### Dashboard API Endpoint
```typescript
GET /api/dashboard?role={role}&userId={userId}&staffId={staffId}
```

**Parameters:**
- `role`: 'admin' | 'convener' | 'staff'
- `userId`: User ID (required for convener)
- `staffId`: Staff ID (required for staff)

**Response Structure:**

#### Admin Response:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 10,
      "totalMeetings": 50,
      "totalDepartments": 5,
      "totalVenues": 8,
      "activeMeetings": 12,
      "completedMeetings": 30,
      "cancelledMeetings": 8
    },
    "recentMeetings": [...],
    "recentActivity": [...]
  }
}
```

#### Convener Response:
```json
{
  "success": true,
  "data": {
    "stats": {
      "myMeetings": 15,
      "upcomingMeetings": 5,
      "completedMeetings": 10,
      "pendingDocuments": 2,
      "totalParticipants": 45,
      "thisWeekMeetings": 3
    },
    "upcomingMeetings": [...],
    "recentMeetings": [...],
    "pendingTasks": [...]
  }
}
```

#### Staff Response:
```json
{
  "success": true,
  "data": {
    "stats": {
      "assignedMeetings": 20,
      "upcomingMeetings": 3,
      "attendedMeetings": 15,
      "missedMeetings": 2,
      "pendingMeetings": 3,
      "documentsAvailable": 18
    },
    "upcomingMeetings": [...],
    "recentMeetings": [...],
    "attendanceHistory": [...]
  }
}
```

## Navigation Structure

### Sidebar Menu Items by Role

#### Admin:
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

#### Convener:
- 📊 Dashboard
- 📅 Meetings
- 📆 Calendar
- 📄 Documents
- 📈 Reports
- ⚙️ Settings

#### Staff:
- 📊 Dashboard
- 📅 Meetings
- 📆 Calendar
- 📄 Documents
- ✅ My Attendance
- ⚙️ Settings

## Layout Components

### DashboardLayout
Wraps all dashboard pages with:
- Sidebar (role-based navigation)
- Header (search, notifications, profile)
- Main content area

### Sidebar
Features:
- Collapsible sidebar
- Role-based menu filtering
- Active route highlighting
- Role badge display
- Color-coded by role (blue=admin, green=convener, purple=staff)

### Header
Features:
- Global search bar
- Notification dropdown with unread count
- Profile dropdown with user info
- Quick action buttons (role-dependent)

## Usage Example

```tsx
// In your page component
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      {/* Your dashboard content */}
    </DashboardLayout>
  );
}
```

## Color Scheme

- **Admin**: Blue theme (`bg-blue-600`, `text-blue-600`)
- **Convener**: Green theme (`bg-green-600`, `text-green-600`)
- **Staff**: Purple theme (`bg-purple-600`, `text-purple-600`)

## Authentication Integration

To integrate with your authentication system:

1. Update [app/dashboard/page.tsx](app/dashboard/page.tsx#L15-L20) to get the user's role from your auth context
2. Pass the user ID/staff ID to API calls
3. Implement protected routes with role-based access control
4. Update the Header component to show actual user data

```typescript
// Example with auth context
const { user } = useAuth();
const role = user.role; // 'admin' | 'convener' | 'staff'
const userId = user.id;
const staffId = user.staffId;
```

## Service Layer Methods

All dashboard data is fetched through `DashboardService`:

```typescript
// Admin
DashboardService.getAdminStats()
DashboardService.getSystemActivity(limit)

// Convener
DashboardService.getConvenerStats(userId)
DashboardService.getConvenerUpcomingMeetings(userId, limit)
DashboardService.getConvenerRecentMeetings(userId, limit)
DashboardService.getConvenerPendingTasks(userId)

// Staff
DashboardService.getStaffDashboard(staffId)
```

## Responsive Design

All dashboard components are responsive:
- Mobile: Single column layout
- Tablet: 2-column grid
- Desktop: 3-4 column grid

The sidebar collapses on smaller screens to show only icons.
