# MOMS - Minutes of Meeting System

A comprehensive web-based system for managing organizational meetings, attendance tracking, document management, and automated reporting with role-based access control.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

The Minutes of Meeting System (MOMS) is a full-stack enterprise application designed to digitize and streamline organizational meeting management. Built with Next.js and modern web technologies, it provides a comprehensive suite of tools for meeting lifecycle management, from planning to documentation.

### Key Benefits

- **Streamlined Meeting Management**: End-to-end meeting lifecycle from creation to reporting
- **Enhanced Collaboration**: Real-time attendance tracking and document sharing
- **Comprehensive Reporting**: Automated generation of meeting summaries and analytics
- **Role-Based Security**: Granular access control for different user types
- **Cloud Integration**: Secure document storage with Vercel Blob
- **Modern Architecture**: Built with latest web technologies for scalability

## Features

### Core Functionality

#### Authentication & User Management
- **Secure Authentication**: JWT-based login system with encrypted password storage
- **Multi-Role Access**: Admin, Convener, and Staff roles with different permissions
- **Profile Management**: User profile customization with photo upload
- **Password Recovery**: Email-based password reset with secure tokens
- **Session Management**: Automatic token refresh and secure logout

#### Meeting Management
- **Meeting Creation**: Create meetings with detailed information (title, description, agenda)
- **Scheduling System**: Date, time, and duration management with timezone support
- **Venue Management**: Support for both physical locations and virtual meeting platforms
- **Meeting Types**: Categorization system for different types of meetings
- **Participant Management**: Add/remove participants with role assignments
- **Meeting Lifecycle**: Complete workflow from creation to completion
- **Cancellation System**: Meeting cancellation with reason tracking

#### Attendance Tracking
- **Real-Time Marking**: Mark attendance during meetings with timestamps
- **Attendance Status**: Present, Absent, Late, and Excused status options
- **Remarks System**: Add detailed notes for each participant's attendance
- **Historical Tracking**: Complete attendance history for all participants
- **Automated Reports**: Generate attendance summaries and analytics

#### Document Management
- **File Upload**: Support for multiple file formats (PDF, DOCX, XLSX, PPTX)
- **Secure Storage**: Integration with Vercel Blob for reliable cloud storage
- **Version Control**: Track document versions and modification history
- **Access Control**: Role-based access to sensitive documents
- **Metadata Management**: Automatic file information extraction and tagging
- **Bulk Operations**: Upload, download, and delete multiple files

#### Notification System
- **Event-Driven Notifications**: Automatic notifications for key meeting events
- **Multiple Notification Types**:
  - Meeting Created/Updated/Cancelled
  - Attendance Marked
  - Document Uploaded
  - Report Generated
  - Support Ticket Updates
- **Real-Time Delivery**: Instant notification delivery to relevant users
- **Status Tracking**: Mark notifications as read/unread with counters

#### Reporting & Analytics
- **Meeting Summaries**: Comprehensive meeting reports with all details
- **Attendance Reports**: Detailed attendance analytics with trends
- **Department Analytics**: Department-wise meeting and attendance statistics
- **Custom Date Ranges**: Generate reports for specific time periods
- **Export Functionality**: Export reports in PDF and Excel formats
- **Visual Analytics**: Charts and graphs for data visualization

#### Administrative Features
- **Department Management**: Create and manage organizational departments
- **Staff Management**: Complete employee information and department assignment
- **Venue Administration**: Manage physical and virtual meeting spaces
- **Meeting Type Configuration**: Define and manage meeting categories
- **User Administration**: Create, modify, and deactivate user accounts
- **System Settings**: Global configuration and customization options
- **Support System**: Built-in support ticket management

#### Search & Discovery
- **Global Search**: Search across meetings, documents, and staff
- **Advanced Filters**: Filter by date, department, meeting type, status
- **Quick Search**: Real-time search suggestions and autocomplete
- **Result Categorization**: Organized search results by content type

## Technology Stack

### Frontend Technologies
- **Framework**: Next.js 16 with App Router for modern React development
- **UI Library**: React 19 with TypeScript for type-safe component development
- **Styling**: Tailwind CSS 4 for responsive and modern UI design
- **State Management**: React Context API for global state management
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualization and analytics
- **Notifications**: React Hot Toast and SweetAlert2 for user feedback
- **Animations**: Framer Motion for smooth UI transitions

### Backend Technologies
- **Runtime**: Node.js with Next.js API Routes
- **Database**: PostgreSQL for robust relational data storage
- **ORM**: Prisma 7.2 for type-safe database operations
- **Authentication**: JSON Web Tokens (JWT) for secure session management
- **Password Security**: bcryptjs for secure password hashing
- **File Storage**: Vercel Blob for scalable file storage
- **Email Service**: Nodemailer with EmailJS for notification delivery
- **Data Validation**: Zod for runtime type checking and validation

### Development Tools
- **Package Manager**: npm for dependency management
- **Code Quality**: ESLint 9 for code linting and formatting
- **Build System**: Next.js Turbopack for fast development builds
- **Database Tools**: Prisma Studio for database administration
- **Version Control**: Git with GitHub for source code management

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                   │
├─────────────────────────────────────────────────────────────┤
│                 Next.js Frontend (React)                    │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │   Pages     │ Components  │   Hooks     │  Context    │  │
│  │   (App      │  (Reusable  │ (Custom     │ (Global     │  │
│  │   Router)   │    UI)      │   Logic)    │   State)    │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    API Layer (Next.js)                      │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │   Routes    │ Middleware  │ Validation  │ Response    │  │
│  │ (Endpoints) │  (Auth &    │   (Zod)     │ Utilities   │  │
│  │             │   CORS)     │             │             │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   Service Layer                             │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │  Business   │   User      │  Meeting    │ Document    │  │
│  │   Logic     │  Service    │  Service    │  Service    │  │
│  │             │             │             │             │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   Data Layer                                │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │   Prisma    │ PostgreSQL  │ Vercel Blob │   Email     │  │
│  │    ORM      │  Database   │   Storage   │  Service    │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns

- **Service Layer Pattern**: Separation of business logic from API routes
- **Repository Pattern**: Database abstraction through Prisma ORM
- **Middleware Pattern**: Request/response processing pipeline
- **Factory Pattern**: Consistent API response formatting
- **Observer Pattern**: Event-driven notification system

## Installation

### Prerequisites

Before installing MOMS, ensure you have the following:

- **Node.js**: Version 18.0 or higher
- **PostgreSQL**: Version 14.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/MOMS-Minutes_of_Meeting_System.git
   cd MOMS-Minutes_of_Meeting_System/momm-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `momm-system` directory:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/moms_db"
   
   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="7d"
   
   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN="vercel_blob_token_here"
   
   # Email Configuration
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-email-app-password"
   EMAIL_FROM="MOMS System <your-email@gmail.com>"
   
   # Application Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   
   # Development Configuration
   NODE_ENV="development"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # Seed the database with initial data
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

For production deployment, additional configuration is required:

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | - |
| `JWT_SECRET` | Yes | Secret key for JWT token signing | - |
| `JWT_EXPIRES_IN` | No | JWT token expiration time | "7d" |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob storage token | - |
| `EMAIL_HOST` | Yes | SMTP server hostname | - |
| `EMAIL_PORT` | No | SMTP server port | 587 |
| `EMAIL_USER` | Yes | SMTP authentication username | - |
| `EMAIL_PASSWORD` | Yes | SMTP authentication password | - |
| `NODE_ENV` | No | Application environment | "development" |

### Database Configuration

MOMS uses PostgreSQL as the primary database. Ensure your PostgreSQL instance is configured with:

- **Character Encoding**: UTF-8
- **Timezone**: UTC
- **Connection Limits**: At least 20 concurrent connections
- **Backup Strategy**: Regular automated backups

### Email Configuration

For email notifications to work properly:

1. **Gmail Setup** (recommended for development):
   - Enable 2-factor authentication
   - Generate an app-specific password
   - Use the app password in `EMAIL_PASSWORD`

2. **Custom SMTP Setup**:
   - Verify SMTP server supports TLS/SSL
   - Test connection before deployment
   - Configure appropriate port (587 for TLS, 465 for SSL)

## Usage

### Default Login Credentials

After running the database seed, use these test accounts:

- **Administrator Account**
  - Email: `admin@moms.com`
  - Password: `admin123`
  - Role: ADMIN

- **Staff Account**
  - Email: `staff@moms.com`
  - Password: `staff123`
  - Role: STAFF

### User Roles and Permissions

#### Administrator (ADMIN)
- **System Management**: Configure departments, meeting types, and venues
- **User Management**: Create, modify, and deactivate user accounts
- **Global Access**: View and manage all meetings across all departments
- **Advanced Reporting**: Access to comprehensive analytics and reports
- **System Settings**: Configure global application settings

#### Staff (STAFF)
- **Meeting Management**: Create and manage meetings for their department
- **Attendance Tracking**: Mark and track attendance for meetings they organize
- **Document Management**: Upload and manage meeting-related documents
- **Basic Reporting**: Generate reports for their meetings and department
- **Profile Management**: Manage their own profile and settings

### Common Workflows

#### Creating a Meeting
1. **Login** with appropriate credentials
2. **Navigate** to "Meetings" → "Create New Meeting"
3. **Fill in Details**: Title, description, date, time
4. **Select Venue**: Choose physical location or virtual platform
5. **Add Participants**: Search and add meeting participants
6. **Save Meeting**: Confirm details and create the meeting
7. **Send Invitations**: Notifications are automatically sent to participants

#### Managing Attendance
1. **Open Meeting**: Navigate to the specific meeting
2. **Access Attendance**: Click "Manage Attendance" tab
3. **Mark Attendance**: Update status for each participant
4. **Add Remarks**: Include relevant notes or comments
5. **Save Changes**: Confirm attendance updates

#### Generating Reports
1. **Access Reports**: Navigate to "Reports" section
2. **Select Type**: Choose meeting summary or attendance report
3. **Set Parameters**: Define date range and filters
4. **Generate Report**: Process and download the report
5. **Export Options**: Choose PDF or Excel format

## API Documentation

### Base URLs
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

### Authentication

All API requests (except login) require authentication via JWT Bearer token:

```bash
Authorization: Bearer <your-jwt-token>
```

### Core Endpoints

#### Authentication Endpoints
```bash
POST /api/auth/login          # User authentication
POST /api/auth/register       # User registration  
POST /api/auth/logout         # User logout
POST /api/auth/forgot-password # Password reset request
POST /api/auth/reset-password  # Password reset confirmation
GET  /api/auth/me             # Current user profile
```

#### Meeting Endpoints
```bash
GET    /api/meetings          # List all meetings
POST   /api/meetings          # Create new meeting
GET    /api/meetings/:id      # Get specific meeting
PUT    /api/meetings/:id      # Update meeting
DELETE /api/meetings/:id      # Delete meeting
POST   /api/meetings/:id/attendance # Mark attendance
```

#### User Management Endpoints
```bash
GET    /api/users             # List all users
POST   /api/users             # Create new user
GET    /api/users/:id         # Get specific user
PUT    /api/users/:id         # Update user
DELETE /api/users/:id         # Delete user
```

#### Document Endpoints
```bash
GET    /api/documents         # List documents
POST   /api/documents         # Upload document
GET    /api/documents/:id     # Download document
DELETE /api/documents/:id     # Delete document
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Project Structure

```
momm-system/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes group
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   └── forgot-password/     # Password recovery
│   ├── admin/                   # Admin dashboard routes
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── users/              # User management
│   │   ├── departments/        # Department management
│   │   ├── meetings/           # Meeting management
│   │   └── settings/           # System settings
│   ├── staff/                  # Staff dashboard routes
│   │   ├── dashboard/          # Staff dashboard
│   │   ├── meetings/           # Meeting management
│   │   └── profile/            # Profile management
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── meetings/          # Meeting endpoints
│   │   ├── users/             # User endpoints
│   │   ├── documents/         # Document endpoints
│   │   └── reports/           # Report endpoints
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Home page
├── components/                 # Reusable React components
│   ├── ui/                    # Base UI components
│   ├── forms/                 # Form components
│   ├── layouts/               # Layout components
│   ├── modals/                # Modal components
│   └── charts/                # Chart components
├── lib/                       # Utility libraries
│   ├── auth.ts               # Authentication utilities
│   ├── database.ts           # Database connection
│   ├── validation.ts         # Input validation schemas
│   └── utils.ts              # General utilities
├── services/                  # Business logic services
│   ├── auth.service.ts       # Authentication service
│   ├── meeting.service.ts    # Meeting service
│   ├── user.service.ts       # User service
│   └── document.service.ts   # Document service
├── types/                     # TypeScript type definitions
│   ├── auth.ts              # Authentication types
│   ├── meeting.ts           # Meeting types
│   └── user.ts              # User types
├── prisma/                   # Database configuration
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Database seeding
│   └── migrations/          # Database migrations
├── public/                   # Static assets
│   ├── images/              # Image files
│   └── icons/               # Icon files
├── docs/                     # Documentation
│   ├── api.md               # API documentation
│   ├── deployment.md        # Deployment guide
│   └── contributing.md      # Contributing guidelines
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── next.config.js           # Next.js configuration
```

## Database Schema

### Core Models Overview

The database schema consists of interconnected models representing the complete meeting management system:

#### User Management
- **User**: Core user authentication and profile information
- **Staff**: Extended user information with department association
- **Department**: Organizational departments for user grouping

#### Meeting Management  
- **Meeting**: Core meeting information and scheduling
- **MeetingType**: Categorization of different meeting types
- **Venue**: Physical and virtual meeting locations
- **MeetingMember**: Participant associations for meetings

#### Attendance & Documents
- **Attendance**: Meeting attendance tracking with status and remarks
- **Document**: File attachments associated with meetings
- **Report**: Generated reports for meetings and attendance

#### System Features
- **Notification**: User notification system for events
- **SupportTicket**: User support and feedback system

### Key Relationships

```
User ←→ Staff ←→ Department
User ←→ MeetingMember ←→ Meeting
Meeting ←→ MeetingType
Meeting ←→ Venue  
Meeting ←→ Document
Meeting ←→ Attendance
User ←→ Notification
User ←→ SupportTicket
```

## Contributing

### Development Workflow

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/MOMS-Minutes_of_Meeting_System.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

5. **Commit Changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- **TypeScript**: All new code must be written in TypeScript
- **ESLint**: Follow the established linting rules
- **Prettier**: Use consistent code formatting
- **Testing**: Add unit tests for new features
- **Documentation**: Update relevant documentation

### Commit Message Format

Follow conventional commit format:
```
type(scope): description

- feat: New features
- fix: Bug fixes  
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test additions/modifications
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
Error: Can't reach database server
```
**Solution**: Check PostgreSQL service and connection string

#### Authentication Issues
```bash
Error: Invalid JWT token
```
**Solution**: Verify JWT_SECRET environment variable

#### File Upload Issues
```bash
Error: Blob storage not configured
```
**Solution**: Check BLOB_READ_WRITE_TOKEN configuration

#### Email Notification Issues
```bash
Error: Failed to send email
```
**Solution**: Verify SMTP configuration and credentials

### Development Tips

1. **Database Reset**: Use `npx prisma migrate reset` to reset database
2. **Clear Cache**: Delete `.next` folder if experiencing build issues
3. **Environment Variables**: Restart development server after changing `.env`
4. **Prisma Studio**: Use `npx prisma studio` for database visualization

### Support

For additional help:
- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact support@moms-system.com

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

**MOMS** - Making meeting management effortless and efficient.