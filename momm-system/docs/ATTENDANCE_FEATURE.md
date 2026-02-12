# Attendance Management Feature

## Overview
The Attendance Management system allows for tracking meeting participation with role-based access control.

## Role Permissions

### 1. Admin
- **Access**: Full access to all meetings.
- **Capabilities**:
  - View attendance for any meeting.
  - Mark members as Present/Absent/Late/Excused.
  - Add remarks.
  - Access via: `Meetings -> View Meeting -> Attendance` button or direct URL.

### 2. Convener
- **Access**: Restricted to meetings they organized.
- **Capabilities**:
  - View attendance for their own meetings.
  - Mark attendance and adds remarks.
  - Access via: `My Meetings -> Attendance` button on the meeting card.

### 3. Staff
- **Access**: Read-only for their own history.
- **Capabilities**:
  - View their personal attendance history commands across all meetings.
  - View aggregate statistics (Present/Absent counts).
  - Access via: `Sidebar -> My Attendance`.

## Technical Implementation

### Database
- Uses existing `MeetingMember` table.
- Fields: `attendanceStatus` (ENUM), `remarks` (String).

### API Security
- Endpoint: `PUT /api/meetings/[id]/attendance`
- **Security Check**:
  - `Admin`: Allowed universally.
  - `Convener`: Allowed only if `meeting.convenerId === user.staffId`.
  - `Staff`: Forbidden (403).

### Frontend
- **Components**:
  - `AttendanceManager`: Interactive table for Admin/Convener.
  - `AttendanceHistory`: Read-only list for Staff.
- **Routes**:
  - Admin: `/admin/meetings/[id]/attendance`
  - Convener: `/convener/meetings/[id]/attendance`
  - Staff: `/staff/attendance`

## Usage Guide
1. **Conveners**: Go to "My Meetings", click the "Attendance" button on any scheduled meeting card. Toggle status switches and add remarks.
2. **Staff**: Click "My Attendance" in the sidebar to see your record.
