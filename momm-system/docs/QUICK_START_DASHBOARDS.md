# Quick Start Guide - Role-Based Dashboards

This guide will help you quickly understand and use the role-based dashboard system.

## 🚀 Accessing Dashboards

### Direct Routes:
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`
- **Convener Dashboard**: `http://localhost:3000/convener/dashboard`
- **Staff Dashboard**: `http://localhost:3000/staff/dashboard`

### Auto-Redirect:
Navigate to `http://localhost:3000/dashboard` and the system will automatically redirect you based on your role.

## 🎨 Dashboard Features by Role

### 👨‍💼 Admin Dashboard
**Key Features:**
- System-wide statistics overview
- Monitor all meetings across the organization
- View system activity log
- Manage master data (users, departments, venues)

**Quick Actions:**
- Add User
- Add Department
- Add Venue
- View Reports

**Navigation Menu:**
- Dashboard, Meetings, Calendar, Documents, Reports
- Users, Staff, Departments, Venues, Meeting Types
- Settings

---

### 👤 Convener Dashboard
**Key Features:**
- Manage your own meetings
- Track pending document uploads
- View participant statistics
- Monitor this week's schedule

**Quick Actions:**
- Create Meeting
- Upload MOM
- Mark Attendance
- View Reports

**Navigation Menu:**
- Dashboard, Meetings, Calendar, Documents
- Reports, Settings

**Alerts:**
- Pending document uploads notification
- Upcoming meetings reminder

---

### 👥 Staff Dashboard
**Key Features:**
- View assigned meetings
- Track attendance history
- Access meeting documents
- Monitor attendance status

**Quick Actions:**
- View Calendar
- My Attendance
- Download MOMs

**Navigation Menu:**
- Dashboard, Meetings, Calendar, Documents
- My Attendance, Settings

**Alerts:**
- Upcoming meetings notification
- Pending attendance items

## 🔧 Testing the Dashboards

### Step 1: Start the Development Server
```bash
cd momm-system
npm run dev
```

### Step 2: Test Each Dashboard

#### Option A: Direct URL Access
```bash
# Admin Dashboard
http://localhost:3000/admin/dashboard

# Convener Dashboard  
http://localhost:3000/convener/dashboard

# Staff Dashboard
http://localhost:3000/staff/dashboard
```

#### Option B: Using Demo Credentials
```
Admin:
- Username: admin
- Password: password123

Convener:
- Username: rajesh.kumar
- Password: password123

Staff:
- Username: amit.patel
- Password: password123
```

### Step 3: Verify API Calls

Open browser DevTools (F12) → Network tab and verify:

```bash
# Admin API call
GET /api/dashboard?role=admin

# Convener API call
GET /api/dashboard?role=convener&userId=2

# Staff API call
GET /api/dashboard?role=staff&staffId=3
```

## 📊 Understanding the Stats

### Admin Stats
- **Total Users**: All registered users
- **Total Meetings**: All meetings in system
- **Total Departments**: Number of departments
- **Total Venues**: Available meeting venues
- **Active Meetings**: Upcoming/scheduled meetings
- **Completed Meetings**: Past meetings
- **Cancelled Meetings**: Cancelled meetings

### Convener Stats
- **My Meetings**: Total meetings organized
- **Upcoming Meetings**: Future meetings
- **Completed Meetings**: Past meetings
- **Pending Documents**: Meetings without MOMs
- **Total Participants**: All participants across meetings
- **This Week**: Meetings scheduled this week

### Staff Stats
- **Assigned Meetings**: Total meetings you're invited to
- **Upcoming Meetings**: Future meetings
- **Attended Meetings**: Meetings marked present
- **Missed Meetings**: Meetings marked absent
- **Pending Meetings**: Attendance not marked
- **Documents**: Available MOM documents

## 🎯 Common Tasks

### As Admin:
1. View system statistics
2. Monitor recent activity
3. Add new users/departments
4. Access all system reports

### As Convener:
1. Create a new meeting
2. Add participants to meeting
3. Mark attendance
4. Upload MOM document
5. View meeting reports

### As Staff:
1. Check upcoming meetings
2. View attendance history
3. Download MOM documents
4. Check attendance status

## 🔐 Role-Based Access Control

Each role has specific permissions defined in `lib/role-utils.ts`:

```typescript
// Check if user can perform action
import { hasPermission } from '@/lib/role-utils';

if (hasPermission(userRole, 'canCreateMeeting')) {
  // Show create meeting button
}
```

## 🎨 Customizing Colors

Dashboard colors are role-specific:

- **Admin**: Blue theme (`#2563eb`)
- **Convener**: Green theme (`#16a34a`)
- **Staff**: Purple theme (`#9333ea`)

To change colors, update:
- `components/layouts/Sidebar.tsx`
- `lib/role-utils.ts`

## 📱 Responsive Behavior

Dashboards are fully responsive:

- **Mobile** (< 768px): Single column, collapsed sidebar
- **Tablet** (768px - 1024px): 2-column grid
- **Desktop** (> 1024px): 3-4 column grid

Test by resizing browser window or using DevTools device emulation.

## 🐛 Troubleshooting

### Dashboard shows loading spinner indefinitely
**Solution**: Check browser console for API errors. Ensure database is running and seeded.

### Stats show 0 for everything
**Solution**: Run the database seeder:
```bash
npm run db:seed
```

### Navigation menu not showing correct items
**Solution**: Verify the role is being passed correctly to the `Sidebar` component.

### API returns empty data
**Solution**: Check that userId/staffId are being passed correctly to the API endpoint.

## 📚 Related Documentation

- [Dashboard Architecture](./DASHBOARD_ARCHITECTURE.md) - Detailed system design
- [API Testing Guide](./API_TESTING_GUIDE.md) - API endpoint documentation
- [Environment Setup](./ENVIRONMENT_SETUP.md) - Initial setup guide

## 🆘 Need Help?

1. Check the console for error messages
2. Verify database connection in `.env`
3. Ensure all dependencies are installed: `npm install`
4. Try restarting the dev server
5. Check that migrations are up to date: `npx prisma migrate dev`

## ✅ Next Steps

1. ✅ Test all three dashboards
2. ✅ Verify API responses
3. ✅ Check responsive design
4. ⬜ Implement authentication
5. ⬜ Add protected routes
6. ⬜ Connect to real user sessions
7. ⬜ Add more dashboard features

---

**Happy coding! 🚀**
