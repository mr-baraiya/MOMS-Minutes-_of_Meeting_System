# 🚀 Quick Start Guide - MOMM System

This guide will get you up and running with the MOMM system in 5 minutes.

## Prerequisites

- **Node.js** 18 or higher
- **PostgreSQL** database (we use Supabase)
- **npm** or **yarn** package manager

## Step 1: Clone and Install

```bash
# Navigate to project folder
cd momm-system

# Install dependencies
npm install
```

## Step 2: Environment Setup

Create a `.env` file in the `momm-system/` folder:

```env
# Authentication (REQUIRED)
JWT_SECRET=your-super-secret-key-change-this-in-production-min-32-characters

# Database URLs from Supabase
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Replace `[PROJECT]` and `[PASSWORD]` with your Supabase credentials.

## Step 3: Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed demo data (creates test users, meetings, etc.)
npx prisma db seed
```

**What gets seeded:**
- 3 test users (admin, convener, staff)
- 5 departments
- 3 meeting types
- 5 venues
- 10 staff members
- 10 meetings with attendance

## Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Step 5: Login

Navigate to: **http://localhost:3000/auth/login**

### Test Credentials

**Admin Account:**
- Username: `admin`
- Password: `password123`
- Access: Full system management

**Convener Account:**
- Username: `rajesh.kumar`
- Password: `password123`
- Access: Department meeting management

**Staff Account:**
- Username: `amit.patel`
- Password: `password123`
- Access: Personal meetings and attendance

## What Happens After Login?

You'll be automatically redirected to your role-specific dashboard:

### Admin Dashboard (`/admin/dashboard`)
- System-wide statistics
- All meetings overview
- Recent activity log
- Quick actions for system management

### Convener Dashboard (`/convener/dashboard`)
- Personal meeting statistics
- Meetings you're convening
- Upcoming meetings
- Participant management

### Staff Dashboard (`/staff/dashboard`)
- Your assigned meetings
- Attendance history
- Upcoming meetings
- Document access

## Folder Navigation

Use the sidebar to navigate between sections:

### Common Routes
- **Dashboard** - Your home page
- **Meetings** - View and manage meetings
- **Calendar** - Visual meeting schedule
- **Reports** - Generate attendance and meeting reports

### Admin-Only Routes
- **Staff Management** - CRUD operations for staff
- **Departments** - Manage departments
- **Venues** - Manage meeting venues
- **Meeting Types** - Configure meeting categories

## Key Features to Try

### 1. View Upcoming Meetings
- Go to Meetings → Upcoming
- See all scheduled meetings
- Click on a meeting to view details

### 2. Mark Attendance (Staff)
- As a staff member, go to Dashboard
- See "My Meetings" section
- Click "Mark Attendance" on an upcoming meeting

### 3. Create a Meeting (Admin/Convener)
- Click "Schedule Meeting" from Dashboard
- Fill in meeting details
- Add participants
- Set venue and time

### 4. Generate Report (Admin)
- Go to Reports section
- Select report type (Meeting-wise or Summary)
- Choose date range
- Export to Excel/PDF

### 5. Update Profile
- Click user icon in header
- Select "Profile"
- Update your information

## API Testing

If you want to test API endpoints directly:

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Get Current User (use token from login response)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using PowerShell

```powershell
# Login
$body = @{
    username = "admin"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## Troubleshooting

### "Database connection error"
- Check your DATABASE_URL in `.env`
- Verify Supabase credentials are correct
- Ensure database is accessible

### "JWT_SECRET not found"
- Add JWT_SECRET to your `.env` file
- Must be at least 32 characters long
- Restart the dev server after adding

### "User not found" on login
- Run `npx prisma db seed` to create test users
- Check database has been seeded properly
- Verify Prisma connection

### "Cannot find module '@prisma/client'"
- Run `npx prisma generate`
- Restart the dev server
- Check `node_modules/@prisma/client` exists

### Port 3000 already in use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

## Next Steps

1. **Explore Documentation**
   - [Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md) - Complete feature overview
   - [Authentication Guide](./docs/AUTHENTICATION_GUIDE.md) - Auth system details
   - [Dashboard Guide](./docs/DASHBOARD_GUIDE.md) - Dashboard features

2. **Customize the System**
   - Add more departments
   - Create new meeting types
   - Add more staff members
   - Configure venues

3. **Development**
   - Check [FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) for code organization
   - See [LUCIDE_ICONS_GUIDE.md](./docs/LUCIDE_ICONS_GUIDE.md) for UI components
   - Review [API_TESTING_GUIDE.md](./docs/API_TESTING_GUIDE.md) for API reference

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio        # Open Prisma Studio (DB GUI)
npx prisma db push       # Push schema changes
npx prisma db seed       # Seed demo data
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create migration

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types (if configured)
```

## Development Tips

### Hot Reload
- Changes to code automatically reload the page
- Changes to `.env` require server restart
- Changes to `prisma/schema.prisma` require `npx prisma generate`

### Debugging
- Use browser DevTools for frontend debugging
- Check terminal for server-side errors
- Use `console.log()` for quick debugging
- Use VS Code debugger for advanced debugging

### Database Changes
```bash
# After modifying schema.prisma:
1. npx prisma generate    # Update Prisma Client
2. npx prisma db push     # Apply changes to DB
3. Restart dev server
```

## Getting Help

- **Documentation**: Check `docs/` folder for detailed guides
- **Implementation Summary**: [docs/IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)
- **API Reference**: [docs/API_TESTING_GUIDE.md](./docs/API_TESTING_GUIDE.md)
- **Issues**: Check error messages in terminal and browser console

## Security Notes

⚠️ **Important for Production:**

1. Change `JWT_SECRET` to a strong random value
2. Never commit `.env` file to version control
3. Use HTTPS in production
4. Rotate JWT secrets regularly
5. Enable CORS properly
6. Use strong passwords for database
7. Enable rate limiting on authentication endpoints

---

**You're ready to go!** 🎉

Login with the test credentials and explore the system. Check the [Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md) for complete feature details.
