# Testing Checklist for Role-Based Dashboards

Use this checklist to verify that all dashboard features are working correctly.

## 🚀 Pre-Testing Setup

- [ ] Development server is running (`npm run dev`)
- [ ] Database is seeded with demo data (`npm run db:seed`)
- [ ] Browser DevTools is open (F12) for debugging
- [ ] Network tab is active to monitor API calls

## 📊 Admin Dashboard Testing

### Access
- [ ] Navigate to `/dashboard/admin`
- [ ] Page loads without errors
- [ ] No console errors in DevTools

### Layout
- [ ] Sidebar is visible with blue theme
- [ ] Role badge shows "Administrator"
- [ ] Header displays correctly
- [ ] Search bar is present
- [ ] Notification bell is visible
- [ ] Profile dropdown is accessible

### Navigation Menu
- [ ] All menu items visible:
  - [ ] Dashboard
  - [ ] Meetings
  - [ ] Calendar
  - [ ] Documents
  - [ ] Reports
  - [ ] Users
  - [ ] Staff
  - [ ] Departments
  - [ ] Venues
  - [ ] Meeting Types
  - [ ] Settings
- [ ] Dashboard item is highlighted (active)
- [ ] Logout button is visible

### Statistics
- [ ] Total Users card displays
- [ ] Total Meetings card displays
- [ ] Departments card displays
- [ ] Venues card displays
- [ ] Active Meetings card displays
- [ ] Completed Meetings card displays
- [ ] Cancelled Meetings card displays
- [ ] All stat values are numbers (not NaN or undefined)

### Content Sections
- [ ] Recent Meetings section displays
- [ ] System Activity section displays
- [ ] Meetings show correct status badges
- [ ] Meeting dates are formatted correctly
- [ ] Activity log shows timestamps

### Quick Actions
- [ ] Add User button present
- [ ] Add Department button present
- [ ] Add Venue button present
- [ ] View Reports button present

### API
- [ ] Network tab shows: `GET /api/dashboard?role=admin`
- [ ] Response status is 200
- [ ] Response contains `success: true`
- [ ] Response data structure is correct

### Responsive
- [ ] Resize to mobile view - sidebar collapses
- [ ] Resize to tablet view - 2-column grid
- [ ] Resize to desktop - 4-column grid

## 👤 Convener Dashboard Testing

### Access
- [ ] Navigate to `/dashboard/convener`
- [ ] Page loads without errors
- [ ] No console errors in DevTools

### Layout
- [ ] Sidebar visible with green theme
- [ ] Role badge shows "Meeting Convener"
- [ ] Header displays correctly
- [ ] Quick action button shows "+ New Meeting"

### Navigation Menu
- [ ] Menu items visible:
  - [ ] Dashboard
  - [ ] Meetings
  - [ ] Calendar
  - [ ] Documents
  - [ ] Reports
  - [ ] Settings
- [ ] Dashboard item is highlighted
- [ ] Admin-only items are NOT visible
- [ ] Logout button is visible

### Statistics
- [ ] My Meetings card displays
- [ ] Upcoming Meetings card displays
- [ ] Completed Meetings card displays
- [ ] Pending Documents card displays
- [ ] Total Participants card displays
- [ ] This Week's Meetings card displays

### Alerts
- [ ] If pending documents > 0, warning alert shows
- [ ] Alert displays correct count
- [ ] Alert styling is yellow/warning theme

### Content Sections
- [ ] Upcoming Meetings section displays
- [ ] Recent Meetings section displays
- [ ] Pending Tasks section displays
- [ ] Days-until countdown shows correctly
- [ ] Meeting participant counts display

### Quick Actions
- [ ] Create Meeting button present
- [ ] Upload MOM button present
- [ ] Mark Attendance button present
- [ ] View Reports button present

### API
- [ ] Network tab shows: `GET /api/dashboard?role=convener&userId={id}`
- [ ] Response status is 200
- [ ] Response contains convener-specific data

### Responsive
- [ ] Mobile view works correctly
- [ ] Tablet view shows 2-column grid
- [ ] Desktop shows proper layout

## 👥 Staff Dashboard Testing

### Access
- [ ] Navigate to `/dashboard/staff`
- [ ] Page loads without errors
- [ ] No console errors in DevTools

### Layout
- [ ] Sidebar visible with purple theme
- [ ] Role badge shows "Staff Member"
- [ ] Header displays correctly
- [ ] Quick action button NOT present (staff can't create meetings)

### Navigation Menu
- [ ] Menu items visible:
  - [ ] Dashboard
  - [ ] Meetings
  - [ ] Calendar
  - [ ] Documents
  - [ ] My Attendance
  - [ ] Settings
- [ ] Dashboard item is highlighted
- [ ] Admin/Convener items are NOT visible
- [ ] Logout button is visible

### Statistics
- [ ] Assigned Meetings card displays
- [ ] Upcoming Meetings card displays
- [ ] Attended Meetings card displays
- [ ] Missed Meetings card displays
- [ ] Pending Meetings card displays
- [ ] Documents Available card displays

### Alerts
- [ ] If upcoming meetings > 0, info alert shows
- [ ] Alert displays correct count
- [ ] Alert styling is blue/info theme

### Content Sections
- [ ] Upcoming Meetings section displays
- [ ] Attendance History section displays
- [ ] Recent Meeting Documents section displays
- [ ] Attendance status icons show correctly (✅ ❌ ⏳)
- [ ] Download buttons are present

### Quick Actions
- [ ] View Calendar button present
- [ ] My Attendance button present
- [ ] Download MOMs button present
- [ ] NO create/edit buttons (correct for staff role)

### API
- [ ] Network tab shows: `GET /api/dashboard?role=staff&staffId={id}`
- [ ] Response status is 200
- [ ] Response contains staff-specific data

### Responsive
- [ ] Mobile view works correctly
- [ ] Tablet view shows 2-column grid
- [ ] Desktop shows proper layout

## 🔄 Dashboard Router Testing

### Access
- [ ] Navigate to `/dashboard` (without role)
- [ ] Loading spinner displays
- [ ] Automatically redirects to role-specific dashboard
- [ ] Redirect happens within 1-2 seconds

## 🎨 UI/UX Testing

### Colors
- [ ] Admin pages use blue theme (#2563eb)
- [ ] Convener pages use green theme (#16a34a)
- [ ] Staff pages use purple theme (#9333ea)
- [ ] Hover states work on all buttons
- [ ] Active states work on navigation items

### Typography
- [ ] Headers are clear and readable
- [ ] Body text has good contrast
- [ ] Font sizes are appropriate
- [ ] No text overflow issues

### Icons
- [ ] All emoji icons display correctly
- [ ] Icons align properly with text
- [ ] No broken icon references

### Spacing
- [ ] Consistent padding throughout
- [ ] Cards have proper spacing
- [ ] No elements touching borders
- [ ] Grid gaps are uniform

## 🔔 Interactive Elements Testing

### Sidebar
- [ ] Collapse button works
- [ ] Sidebar width animates smoothly
- [ ] Icons remain centered when collapsed
- [ ] Tooltip shows on hover when collapsed
- [ ] Menu items are clickable

### Header
- [ ] Search bar is functional
- [ ] Clicking notification bell opens dropdown
- [ ] Clicking profile opens dropdown
- [ ] Clicking outside closes dropdowns
- [ ] Dropdown animations work smoothly

### Notifications
- [ ] Unread count badge displays
- [ ] Badge shows correct number
- [ ] Notification items are readable
- [ ] Timestamps display correctly
- [ ] "View all" link is present

### Profile Dropdown
- [ ] User name displays
- [ ] User email displays
- [ ] Role displays correctly
- [ ] All menu items clickable
- [ ] Logout link present

## 🐛 Error Handling Testing

### Network Errors
- [ ] Stop dev server
- [ ] Dashboard shows loading state
- [ ] Check console for error message
- [ ] Restart server - dashboard recovers

### Empty Data
- [ ] Clear database
- [ ] Dashboard shows "No data" messages gracefully
- [ ] No JavaScript errors
- [ ] Re-seed database - data appears

### Invalid Route
- [ ] Navigate to `/dashboard/invalid-role`
- [ ] Appropriate error or redirect occurs

## 📱 Cross-Browser Testing

### Chrome
- [ ] Dashboard loads correctly
- [ ] All features work
- [ ] No console errors

### Firefox
- [ ] Dashboard loads correctly
- [ ] All features work
- [ ] No console errors

### Edge
- [ ] Dashboard loads correctly
- [ ] All features work
- [ ] No console errors

### Safari (if available)
- [ ] Dashboard loads correctly
- [ ] All features work
- [ ] No console errors

## ⚡ Performance Testing

### Load Time
- [ ] Dashboard loads in < 2 seconds
- [ ] API response time < 500ms
- [ ] No significant layout shift

### Interactions
- [ ] Sidebar collapse is smooth (no lag)
- [ ] Dropdown animations are smooth
- [ ] Route changes are instant

### Memory
- [ ] No memory leaks after 5+ route changes
- [ ] Console shows no memory warnings

## ♿ Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter key works on buttons
- [ ] Escape closes dropdowns

### Screen Reader (if available)
- [ ] Page structure makes sense
- [ ] Buttons have proper labels
- [ ] Stats have descriptive text

### Color Contrast
- [ ] Text on backgrounds meets WCAG AA
- [ ] Links are distinguishable
- [ ] Disabled states are clear

## 📋 Final Verification

- [ ] All three dashboards tested
- [ ] All API calls successful
- [ ] No console errors across all pages
- [ ] Responsive design works on all breakpoints
- [ ] Colors are consistent with roles
- [ ] Navigation is intuitive
- [ ] Data displays correctly
- [ ] Loading states work
- [ ] Empty states work
- [ ] Error states work

## 🎉 Sign-Off

**Tested By**: ___________________________

**Date**: ___________________________

**Status**: ⬜ Passed | ⬜ Failed | ⬜ Needs Review

**Notes**:
```
[Add any notes about issues found or suggestions for improvement]
```

---

## 🔧 Common Issues & Solutions

### Issue: Stats show 0 for everything
**Solution**: Run `npm run db:seed` to populate demo data

### Issue: API returns 500 error
**Solution**: Check database connection in `.env` file

### Issue: Dashboard stuck on loading
**Solution**: Check browser console for errors, verify API endpoint

### Issue: Sidebar doesn't collapse
**Solution**: Check if state is updating, verify onClick handler

### Issue: Role-specific items showing for wrong role
**Solution**: Verify role filtering in Sidebar component

---

**Save this file and check off items as you test!** ✅
