# API Testing Guide - MOMS System

Base URL: `http://localhost:3000/api`

## Table of Contents
1. [Dashboard](#dashboard)
2. [Users](#users)
3. [Departments](#departments)
4. [Staff](#staff)
5. [Meeting Types](#meeting-types)
6. [Venues](#venues)
7. [Meetings](#meetings)
8. [Meeting Members](#meeting-members)
9. [Meeting Attendance](#meeting-attendance)
10. [Meeting Documents](#meeting-documents)

---

## Dashboard

### Get Dashboard Statistics
```http
GET /api/dashboard
```

**Query Parameters:**
- `staffId` (optional): Get staff-specific dashboard

**Examples:**
```bash
# General dashboard
curl http://localhost:3000/api/dashboard

# Staff-specific dashboard
curl http://localhost:3000/api/dashboard?staffId=1
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalMeetings": 10,
      "upcomingMeetings": 5,
      "totalStaff": 20
    },
    "recentMeetings": [],
    "upcomingMeetings": [],
    "todaysMeetings": []
  }
}
```

---

## Users

### Get All Users
```http
GET /api/users
```

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page

**Example:**
```bash
curl "http://localhost:3000/api/users?page=1&limit=10"
```

### Create User
```http
POST /api/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john.doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "role": "STAFF"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "role": "STAFF"
  }'
```

### Get User by ID
```http
GET /api/users/:id
```

**Example:**
```bash
curl http://localhost:3000/api/users/1
```

### Update User
```http
PUT /api/users/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john.doe.updated",
  "email": "john.updated@example.com",
  "role": "ADMIN"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe.updated",
    "email": "john.updated@example.com"
  }'
```

### Delete User
```http
DELETE /api/users/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

---

## Departments

### Get All Departments
```http
GET /api/departments
```

**Query Parameters:**
- `includeInactive` (optional): Include inactive departments

**Example:**
```bash
curl "http://localhost:3000/api/departments?includeInactive=true"
```

### Create Department
```http
POST /api/departments
Content-Type: application/json
```

**Request Body:**
```json
{
  "departmentName": "Information Technology"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -d '{
    "departmentName": "Information Technology"
  }'
```

### Get Department by ID
```http
GET /api/departments/:id
```

**Example:**
```bash
curl http://localhost:3000/api/departments/1
```

### Update Department
```http
PUT /api/departments/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "departmentName": "IT Department",
  "isActive": true
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/departments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "departmentName": "IT Department"
  }'
```

### Delete Department
```http
DELETE /api/departments/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/departments/1
```

---

## 👥 Staff

### Get All Staff
```http
GET /api/staff
```

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `departmentId` (optional): Filter by department
- `all` (optional): Get all active staff without pagination

**Examples:**
```bash
# Paginated list
curl "http://localhost:3000/api/staff?page=1&limit=10"

# Filter by department
curl "http://localhost:3000/api/staff?departmentId=1"

# Get all active staff
curl "http://localhost:3000/api/staff?all=true"
```

### Create Staff
```http
POST /api/staff
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": 1,
  "staffName": "John Doe",
  "emailAddress": "john.doe@company.com",
  "departmentId": 1,
  "designation": "Senior Developer"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/staff \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "staffName": "John Doe",
    "emailAddress": "john.doe@company.com",
    "departmentId": 1,
    "designation": "Senior Developer"
  }'
```

### Get Staff by ID
```http
GET /api/staff/:id
```

**Example:**
```bash
curl http://localhost:3000/api/staff/1
```

### Update Staff
```http
PUT /api/staff/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "staffName": "John Doe Updated",
  "designation": "Lead Developer",
  "departmentId": 2
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/staff/1 \
  -H "Content-Type: application/json" \
  -d '{
    "staffName": "John Doe Updated",
    "designation": "Lead Developer"
  }'
```

### Delete Staff
```http
DELETE /api/staff/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/staff/1
```

---

## 📝 Meeting Types

### Get All Meeting Types
```http
GET /api/meeting-types
```

**Query Parameters:**
- `includeInactive` (optional): Include inactive meeting types

**Example:**
```bash
curl "http://localhost:3000/api/meeting-types?includeInactive=true"
```

### Create Meeting Type
```http
POST /api/meeting-types
Content-Type: application/json
```

**Request Body:**
```json
{
  "meetingTypeName": "Sprint Planning"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/meeting-types \
  -H "Content-Type: application/json" \
  -d '{
    "meetingTypeName": "Sprint Planning"
  }'
```

### Get Meeting Type by ID
```http
GET /api/meeting-types/:id
```

**Example:**
```bash
curl http://localhost:3000/api/meeting-types/1
```

### Update Meeting Type
```http
PUT /api/meeting-types/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "meetingTypeName": "Sprint Planning Meeting",
  "isActive": true
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/meeting-types/1 \
  -H "Content-Type: application/json" \
  -d '{
    "meetingTypeName": "Sprint Planning Meeting"
  }'
```

### Delete Meeting Type
```http
DELETE /api/meeting-types/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/meeting-types/1
```

---

## 🏢 Venues

### Get All Venues
```http
GET /api/venues
```

**Query Parameters:**
- `includeInactive` (optional): Include inactive venues
- `type` (optional): Filter by venue type (PHYSICAL, VIRTUAL)

**Examples:**
```bash
# All active venues
curl http://localhost:3000/api/venues

# Include inactive
curl "http://localhost:3000/api/venues?includeInactive=true"

# Filter by type
curl "http://localhost:3000/api/venues?type=PHYSICAL"
```

### Create Venue
```http
POST /api/venues
Content-Type: application/json
```

**Request Body:**
```json
{
  "venueName": "Conference Room A",
  "venueType": "PHYSICAL",
  "location": "3rd Floor, Main Building"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/venues \
  -H "Content-Type: application/json" \
  -d '{
    "venueName": "Conference Room A",
    "venueType": "PHYSICAL",
    "location": "3rd Floor, Main Building"
  }'
```

### Get Venue by ID
```http
GET /api/venues/:id
```

**Example:**
```bash
curl http://localhost:3000/api/venues/1
```

### Update Venue
```http
PUT /api/venues/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "venueName": "Conference Room A - Updated",
  "location": "4th Floor, Main Building",
  "isActive": true
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/venues/1 \
  -H "Content-Type: application/json" \
  -d '{
    "venueName": "Conference Room A - Updated",
    "location": "4th Floor, Main Building"
  }'
```

### Delete Venue
```http
DELETE /api/venues/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/venues/1
```

---

## 📅 Meetings

### Get All Meetings
```http
GET /api/meetings
```

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 10): Items per page
- `startDate` (optional): Filter by start date (YYYY-MM-DD)
- `endDate` (optional): Filter by end date (YYYY-MM-DD)
- `meetingTypeId` (optional): Filter by meeting type
- `organizerStaffId` (optional): Filter by organizer
- `venueId` (optional): Filter by venue
- `isCancelled` (optional): Filter cancelled meetings
- `search` (optional): Search in meeting title

**Examples:**
```bash
# Basic pagination
curl "http://localhost:3000/api/meetings?page=1&limit=10"

# Filter by date range
curl "http://localhost:3000/api/meetings?startDate=2026-01-01&endDate=2026-01-31"

# Filter by meeting type
curl "http://localhost:3000/api/meetings?meetingTypeId=1"

# Search meetings
curl "http://localhost:3000/api/meetings?search=sprint"

# Multiple filters
curl "http://localhost:3000/api/meetings?startDate=2026-01-01&meetingTypeId=1&isCancelled=false"
```

### Get Upcoming Meetings
```http
GET /api/meetings/upcoming
```

**Query Parameters:**
- `limit` (default: 5): Number of meetings to return

**Example:**
```bash
curl "http://localhost:3000/api/meetings/upcoming?limit=10"
```

### Get Calendar View Meetings
```http
GET /api/meetings/calendar
```

**Query Parameters (Required):**
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

**Example:**
```bash
curl "http://localhost:3000/api/meetings/calendar?startDate=2026-01-01&endDate=2026-01-31"
```

### Create Meeting
```http
POST /api/meetings
Content-Type: application/json
```

**Request Body:**
```json
{
  "meetingTitle": "Sprint Planning Meeting",
  "meetingDate": "2026-01-15",
  "meetingStartTime": "2026-01-15T09:00:00Z",
  "meetingEndTime": "2026-01-15T11:00:00Z",
  "meetingTypeId": 1,
  "venueId": 1,
  "organizerStaffId": 1,
  "agenda": "Plan the next sprint",
  "objectives": "Define sprint goals and tasks"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/meetings \
  -H "Content-Type: application/json" \
  -d '{
    "meetingTitle": "Sprint Planning Meeting",
    "meetingDate": "2026-01-15",
    "meetingStartTime": "2026-01-15T09:00:00Z",
    "meetingEndTime": "2026-01-15T11:00:00Z",
    "meetingTypeId": 1,
    "venueId": 1,
    "organizerStaffId": 1,
    "agenda": "Plan the next sprint"
  }'
```

### Get Meeting by ID
```http
GET /api/meetings/:id
```

**Example:**
```bash
curl http://localhost:3000/api/meetings/1
```

### Update Meeting
```http
PUT /api/meetings/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "meetingTitle": "Sprint Planning Meeting - Updated",
  "meetingDate": "2026-01-16",
  "meetingStartTime": "2026-01-16T10:00:00Z",
  "meetingEndTime": "2026-01-16T12:00:00Z",
  "agenda": "Updated agenda"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/meetings/1 \
  -H "Content-Type: application/json" \
  -d '{
    "meetingTitle": "Sprint Planning Meeting - Updated",
    "agenda": "Updated agenda"
  }'
```

### Cancel Meeting
```http
POST /api/meetings/:id/cancel
Content-Type: application/json
```

**Request Body:**
```json
{
  "cancellationReason": "Organizer unavailable"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/meetings/1/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "cancellationReason": "Organizer unavailable"
  }'
```

### Delete Meeting
```http
DELETE /api/meetings/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/meetings/1
```

---

## 👥 Meeting Members

### Get Meeting Members
```http
GET /api/meetings/:id/members
```

**Query Parameters:**
- `summary` (optional): Get attendance summary instead of member list

**Examples:**
```bash
# Get all members
curl http://localhost:3000/api/meetings/1/members

# Get attendance summary
curl "http://localhost:3000/api/meetings/1/members?summary=true"
```

### Add Member(s) to Meeting
```http
POST /api/meetings/:id/members
Content-Type: application/json
```

**Request Body (Single Member):**
```json
{
  "staffId": 5,
  "role": "PARTICIPANT"
}
```

**Request Body (Multiple Members):**
```json
{
  "members": [
    { "staffId": 5, "role": "PARTICIPANT" },
    { "staffId": 6, "role": "SECRETARY" },
    { "staffId": 7, "role": "PARTICIPANT" }
  ]
}
```

**Examples:**
```bash
# Add single member
curl -X POST http://localhost:3000/api/meetings/1/members \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": 5,
    "role": "PARTICIPANT"
  }'

# Add multiple members
curl -X POST http://localhost:3000/api/meetings/1/members \
  -H "Content-Type: application/json" \
  -d '{
    "members": [
      { "staffId": 5, "role": "PARTICIPANT" },
      { "staffId": 6, "role": "SECRETARY" }
    ]
  }'
```

### Remove Member from Meeting
```http
DELETE /api/meetings/:id/members/:memberId
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/meetings/1/members/5
```

---

## ✅ Meeting Attendance

### Mark Attendance
```http
PUT /api/meetings/:id/attendance
Content-Type: application/json
```

**Request Body (Single Attendance):**
```json
{
  "memberId": 1,
  "isPresent": true,
  "remarks": "Attended on time"
}
```

**Request Body (Bulk Attendance):**
```json
{
  "attendance": [
    { "memberId": 1, "isPresent": true, "remarks": "On time" },
    { "memberId": 2, "isPresent": false, "remarks": "Absent" },
    { "memberId": 3, "isPresent": true, "remarks": "Late arrival" }
  ]
}
```

**Examples:**
```bash
# Single attendance
curl -X PUT http://localhost:3000/api/meetings/1/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "isPresent": true,
    "remarks": "Attended on time"
  }'

# Bulk attendance
curl -X PUT http://localhost:3000/api/meetings/1/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "attendance": [
      { "memberId": 1, "isPresent": true },
      { "memberId": 2, "isPresent": false }
    ]
  }'
```

---

## 📄 Meeting Documents

### Get Meeting Documents
```http
GET /api/meetings/:id/documents
```

**Example:**
```bash
curl http://localhost:3000/api/meetings/1/documents
```

### Upload Meeting Document
```http
POST /api/meetings/:id/documents
Content-Type: application/json
```

**Request Body:**
```json
{
  "documentTitle": "Meeting Minutes",
  "fileName": "minutes_2026-01-15.pdf",
  "filePath": "/uploads/documents/minutes_2026-01-15.pdf",
  "uploadedBy": 1,
  "documentType": "MINUTES"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/meetings/1/documents \
  -H "Content-Type: application/json" \
  -d '{
    "documentTitle": "Meeting Minutes",
    "fileName": "minutes_2026-01-15.pdf",
    "filePath": "/uploads/documents/minutes_2026-01-15.pdf",
    "uploadedBy": 1,
    "documentType": "MINUTES"
  }'
```

---

## 🧪 Testing Tools

### Recommended Tools:
1. **Postman** - GUI-based API testing
2. **Thunder Client** - VS Code extension
3. **REST Client** - VS Code extension
4. **cURL** - Command line tool
5. **Insomnia** - API client

### PowerShell Testing Examples:

```powershell
# GET Request
Invoke-WebRequest -Uri "http://localhost:3000/api/departments" -Method GET

# POST Request
$body = @{
    departmentName = "IT Department"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/departments" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# PUT Request
$body = @{
    departmentName = "IT Updated"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/departments/1" `
    -Method PUT `
    -Body $body `
    -ContentType "application/json"

# DELETE Request
Invoke-WebRequest -Uri "http://localhost:3000/api/departments/1" -Method DELETE
```

---

## 📊 Response Format

All API responses follow this structure:

### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message here",
  "message": "Error message here"
}
```

### Paginated Response:
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## 🔍 Testing Checklist

### For Each Endpoint:
- [ ] Test with valid data
- [ ] Test with missing required fields
- [ ] Test with invalid data types
- [ ] Test with non-existent IDs
- [ ] Test pagination limits
- [ ] Test filter combinations
- [ ] Test empty responses
- [ ] Test duplicate entries (where applicable)

### HTTP Status Codes to Check:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 🚀 Quick Start Testing

1. **Start the development server:**
   ```bash
   cd momm-system
   npm run dev
   ```

2. **Verify the server is running:**
   ```bash
   curl http://localhost:3000/api/dashboard
   ```

3. **Test a complete flow:**
   ```bash
   # 1. Create a department
   curl -X POST http://localhost:3000/api/departments \
     -H "Content-Type: application/json" \
     -d '{"departmentName": "Test Dept"}'
   
   # 2. Get all departments
   curl http://localhost:3000/api/departments
   
   # 3. Update the department
   curl -X PUT http://localhost:3000/api/departments/1 \
     -H "Content-Type: application/json" \
     -d '{"departmentName": "Updated Dept"}'
   
   # 4. Delete the department
   curl -X DELETE http://localhost:3000/api/departments/1
   ```

---

## 📝 Notes

- All timestamps should be in ISO 8601 format
- All dates should be in YYYY-MM-DD format
- Ensure the database is seeded before testing (run `npm run prisma:seed`)
- Replace `localhost:3000` with your actual server URL if different
- Some endpoints require authentication (add authentication headers as needed)

---

**Last Updated:** January 2, 2026
