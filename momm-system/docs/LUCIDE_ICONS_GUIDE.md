# Lucide Icons Implementation Guide

## Overview

The MOMM system now uses [Lucide React](https://lucide.dev/) for all icons, replacing emoji characters for a professional, consistent UI.

## Installation

Already installed:
```bash
npm install lucide-react
```

## Benefits

✅ **Professional Appearance** - Consistent, scalable vector icons
✅ **Accessibility** - Better screen reader support
✅ **Customization** - Easy to style with Tailwind classes
✅ **Performance** - Tree-shakeable, only imports what you use
✅ **Consistency** - Unified design language across the app

## Completed Migrations

### ✅ Authentication Pages
- [app/auth/login/page.tsx](../app/auth/login/page.tsx)
  - LogIn, Eye, EyeOff, Lock, User, AlertCircle
- [app/auth/register/page.tsx](../app/auth/register/page.tsx)
  - UserPlus, Eye, EyeOff, Lock, User, Mail, AlertCircle, Building2, Users

### ✅ Layout Components
- [components/layouts/Sidebar.tsx](../components/layouts/Sidebar.tsx)
  - LayoutDashboard, Calendar, CalendarDays, FileText, TrendingUp, Users, UserCog, Building2, MapPin, Tags, CheckSquare, Settings, LogOut, ChevronLeft, ChevronRight
- [components/layouts/Header.tsx](../components/layouts/Header.tsx)
  - Search, Bell, User, Settings, HelpCircle, LogOut, ChevronDown

## Pending Migrations

### 📋 Dashboard Pages
Need to update Quick Actions sections:

#### Admin Dashboard
File: `app/dashboard/admin/page.tsx`
- ➕ → `Plus`
- 📤 → `Upload`
- ✅ → `CheckSquare`
- 📊 → `BarChart`

#### Convener Dashboard
File: `app/dashboard/convener/page.tsx`
- ➕ → `Plus`
- ✅ → `CheckCircle`
- 👥 → `Users`
- 📊 → `TrendingUp`

#### Staff Dashboard
File: `app/dashboard/staff/page.tsx`
- 📅 → `Calendar`
- ✅ → `CheckSquare`
- 📄 → `FileText`

### 📋 Dashboard Components

#### StatCard Component
File: `components/dashboard/StatCard.tsx`
Current:
```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string; // ❌ Emoji string
  trend?: {
    value: string;
    isPositive: boolean;
  };
}
```

Needs:
```tsx
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon; // ✅ Lucide component
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

// Usage
const Icon = icon;
<Icon className="h-6 w-6 text-blue-600" />
```

#### RecentMeetings Component
File: `components/dashboard/RecentMeetings.tsx`
Add status icons:
- Scheduled → `Calendar`
- Completed → `CheckCircle`
- Cancelled → `XCircle`
- In Progress → `Clock`

#### UpcomingMeetings Component
File: `components/dashboard/UpcomingMeetings.tsx`
Add meeting type icons:
- Regular → `Calendar`
- Emergency → `AlertTriangle`
- Board → `Briefcase`

#### AttendanceHistory Component
File: `components/dashboard/AttendanceHistory.tsx`
Add attendance status icons:
- Present → `UserCheck`
- Absent → `UserX`
- Late → `Clock`

## Icon Mapping Reference

### Common Replacements

| Emoji | Lucide Icon | Usage |
|-------|-------------|-------|
| 📊 | `BarChart`, `TrendingUp` | Statistics, reports |
| 📅 | `Calendar` | Meetings, schedules |
| 👥 | `Users` | Staff, members, groups |
| ⚙️ | `Settings` | Configuration |
| 🏢 | `Building2` | Departments, organization |
| 📍 | `MapPin` | Venues, locations |
| 🏷️ | `Tags` | Meeting types, categories |
| ✅ | `CheckCircle`, `CheckSquare` | Completion, confirmation |
| ➕ | `Plus` | Add, create |
| ✏️ | `Edit`, `Pencil` | Edit actions |
| 🗑️ | `Trash2` | Delete actions |
| 📤 | `Upload` | File uploads |
| 📥 | `Download` | File downloads |
| 📄 | `FileText` | Documents, files |
| 🔍 | `Search` | Search functionality |
| 🔔 | `Bell` | Notifications |
| 👤 | `User` | User profile |
| 🚪 | `LogOut` | Logout |
| ❌ | `XCircle`, `X` | Cancel, close, error |
| 🔓 | `Lock`, `Unlock` | Security |
| 👁️ | `Eye`, `EyeOff` | Visibility toggle |
| ⚠️ | `AlertCircle`, `AlertTriangle` | Warnings, alerts |

## Usage Patterns

### Basic Icon

```tsx
import { Calendar } from 'lucide-react';

<Calendar className="h-5 w-5 text-gray-500" />
```

### Icon with Label

```tsx
<div className="flex items-center gap-2">
  <Calendar className="h-4 w-4" />
  <span>Schedule Meeting</span>
</div>
```

### Icon Button

```tsx
<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
  <Plus className="h-5 w-5 text-blue-600" />
</button>
```

### Icon with Background

```tsx
<div className="p-3 bg-blue-100 rounded-lg">
  <BarChart className="h-6 w-6 text-blue-600" />
</div>
```

### Conditional Icon

```tsx
{isVisible ? (
  <Eye className="h-4 w-4" />
) : (
  <EyeOff className="h-4 w-4" />
)}
```

### Dynamic Icon Component

```tsx
interface CardProps {
  icon: LucideIcon;
  title: string;
}

const Card = ({ icon: Icon, title }: CardProps) => {
  return (
    <div>
      <Icon className="h-6 w-6" />
      <h3>{title}</h3>
    </div>
  );
};

// Usage
<Card icon={Calendar} title="Meetings" />
```

## Size Guidelines

| Size Class | Pixels | Usage |
|------------|--------|-------|
| `h-3 w-3` | 12px | Inline with small text |
| `h-4 w-4` | 16px | Inline with normal text, small buttons |
| `h-5 w-5` | 20px | Standard buttons, menu items |
| `h-6 w-6` | 24px | Larger buttons, cards, stat cards |
| `h-8 w-8` | 32px | Feature icons, hero sections |
| `h-12 w-12` | 48px | Large feature displays |

## Color Guidelines

### Semantic Colors
- **Primary Actions**: `text-blue-600`
- **Success**: `text-green-600`
- **Warning**: `text-yellow-600`
- **Danger**: `text-red-600`
- **Neutral**: `text-gray-500`, `text-gray-600`

### State Colors
- **Active/Selected**: `text-blue-600`
- **Inactive**: `text-gray-400`
- **Hover**: Slightly darker shade
- **Disabled**: `text-gray-300`

## Accessibility

### Always Provide Context

```tsx
// ❌ Bad - No context for screen readers
<button>
  <Plus className="h-5 w-5" />
</button>

// ✅ Good - Proper aria-label
<button aria-label="Add new meeting">
  <Plus className="h-5 w-5" />
</button>

// ✅ Better - Visible label
<button>
  <Plus className="h-5 w-5" />
  <span>Add Meeting</span>
</button>
```

### Decorative Icons

```tsx
// If icon is purely decorative (text already provides context)
<div>
  <Calendar className="h-4 w-4" aria-hidden="true" />
  <span>Schedule Meeting</span>
</div>
```

## Performance Tips

### Import Only What You Need

```tsx
// ✅ Good - Tree-shakeable
import { Calendar, User, Settings } from 'lucide-react';

// ❌ Bad - Imports everything
import * as Icons from 'lucide-react';
```

### Reusable Icon Components

```tsx
// Create a wrapper for consistent styling
const IconButton = ({ icon: Icon, ...props }: { icon: LucideIcon } & ButtonProps) => {
  return (
    <button className="p-2 hover:bg-gray-100 rounded-lg" {...props}>
      <Icon className="h-5 w-5" />
    </button>
  );
};
```

## Migration Checklist

When migrating a component:

1. ✅ Import required Lucide icons at the top
2. ✅ Replace emoji strings with icon components
3. ✅ Add appropriate sizing classes (h-* w-*)
4. ✅ Add color classes (text-*)
5. ✅ Add aria-labels for accessibility
6. ✅ Test icon rendering and alignment
7. ✅ Verify responsive behavior
8. ✅ Check dark mode compatibility (if applicable)

## Common Issues

### Icon Not Showing
```tsx
// ❌ Wrong - lowercase
<calendar />

// ✅ Correct - PascalCase
<Calendar />
```

### Icon Too Small/Large
```tsx
// ❌ Wrong - No size specified
<Calendar />

// ✅ Correct - Always specify size
<Calendar className="h-5 w-5" />
```

### Type Errors with Dynamic Icons
```tsx
// ✅ Correct - Use LucideIcon type
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
}

const Component = ({ icon: Icon }: Props) => {
  return <Icon className="h-5 w-5" />;
};
```

## Resources

- [Lucide Icons Gallery](https://lucide.dev/icons/)
- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Next Steps

1. Update dashboard pages with Lucide icons
2. Migrate StatCard to use LucideIcon type
3. Add contextual icons to dashboard components
4. Create icon variants for different states (active, hover, disabled)
5. Document custom icon patterns in style guide

---

For questions or suggestions about icon usage, please refer to the Lucide documentation or check existing implementations in Sidebar.tsx and Header.tsx.
