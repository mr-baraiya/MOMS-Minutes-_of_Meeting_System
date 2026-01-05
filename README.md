# MOMS - Minutes of Meeting System
Every meeting, perfectly documented.

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements of a Minutes of Meeting System (MOMS). The system aims to digitize and streamline meeting management operations such as meeting scheduling, attendance tracking, minutes recording, action item management, document handling, and report generation for organizations.

### 1.2 Scope
The MOMS will provide:
- Secure authentication (Sign Up / Sign In)
- Role-based access (Admin, Staff, Member)
- Meeting scheduling and management
- Real-time attendance tracking
- Minutes recording and document management
- Action item tracking and notifications
- Meeting type and venue management
- Department and staff management
- Calendar integration
- Comprehensive reporting and analytics

### 1.3 Definitions & Abbreviations
- **Admin**: User with full system management privileges
- **Staff**: Organization staff members who can be assigned to meetings
- **Member**: Meeting participant with limited access
- **MOM**: Minutes of Meeting
- **Action Item**: Task or decision point from a meeting
- **Venue**: Physical or virtual location for meetings

## 2. Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React 18+)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design

### Backend
- **API**: Next.js API Routes (REST)
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT-based authentication
- **Email Service**: Email integration for notifications

### Development Tools
- **Linting**: ESLint
- **Package Manager**: npm/yarn
- **Version Control**: Git

## 3. User Classes and Characteristics

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
- Overview statistics:
  - Total meetings
  - Upcoming meetings
  - Active departments
  - Registered staff
- Quick access to:
  - Meeting management
  - User management
  - Department management
  - Reports and analytics

#### 4.2.2 Staff Dashboard
- Personal meeting schedule
- Assigned meetings
- Pending action items
- Recent meeting minutes
- Quick meeting creation

#### 4.2.3 Member Dashboard
- Invited meetings
- Meeting attendance history
- Accessible meeting documents
- Personal notifications

### 4.3 Department Management

#### 4.3.1 Create Department
- Admin can create departments with:
  - Department name
  - Description
  - Head of department
  - Contact information

#### 4.3.2 Manage Departments
- View all departments
- Edit department details
- Deactivate departments
- Assign staff to departments

### 4.4 Staff Management

#### 4.4.1 Staff Registration
- Admin can add staff members:
  - Personal details
  - Department assignment
  - Contact information
  - Employee ID
  - Position/Title

#### 4.4.2 Staff Profile
- View staff details
- Update staff information
- View meeting history
- Track attendance records

### 4.5 Meeting Type Management

#### 4.5.1 Create Meeting Types
- Admin defines meeting categories:
  - Board meetings
  - Committee meetings
  - Department meetings
  - Project meetings
  - Emergency meetings
- Custom meeting type creation

#### 4.5.2 Meeting Type Configuration
- Set default duration
- Define required fields
- Configure approval workflows
- Set notification preferences

### 4.6 Venue Management

#### 4.6.1 Add Venues
- Admin can register venues:
  - Venue name
  - Location/Address
  - Capacity
  - Available facilities
  - Virtual meeting link (for online venues)

#### 4.6.2 Venue Booking
- Check venue availability
- Reserve venues for meetings
- View venue schedule
- Conflict detection

### 4.7 Meeting Management

#### 4.7.1 Create Meeting
- Schedule new meetings with:
  - Meeting title
  - Meeting type
  - Date and time
  - Duration
  - Venue selection
  - Agenda
  - Invited members
  - Required documents

#### 4.7.2 Meeting Details
- View complete meeting information
- Update meeting details (before start)
- Cancel meetings with notifications
- Reschedule meetings

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
   git clone https://github.com/yourusername/MOMS-Minutes_of_Meeting_System.git
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
