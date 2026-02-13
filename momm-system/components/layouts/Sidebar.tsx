'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  FileText,
  FileBarChart,
  Users,
  UserCog,
  Building2,
  MapPin,
  Tags,
  CheckSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'convener' | 'staff';
}

interface MenuItem {
  label: string;
  href: string;
  icon: any;
  roles: ('admin' | 'convener' | 'staff')[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'convener', 'staff'],
  },
  {
    label: 'Meetings',
    href: '/admin/meetings',
    icon: Calendar,
    roles: ['admin', 'convener', 'staff'],
  },
  {
    label: 'Calendar',
    href: '/admin/calendar',
    icon: CalendarDays,
    roles: ['admin'],
  },
  {
    label: 'Documents',
    href: '/documents',
    icon: FileText,
    roles: ['admin', 'convener', 'staff'],
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: FileBarChart,
    roles: ['admin', 'convener'],
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    label: 'Staff',
    href: '/admin/staff',
    icon: UserCog,
    roles: ['admin'],
  },
  {
    label: 'Departments',
    href: '/admin/departments',
    icon: Building2,
    roles: ['admin'],
  },
  {
    label: 'Venues',
    href: '/admin/venues',
    icon: MapPin,
    roles: ['admin'],
  },
  {
    label: 'Meeting Types',
    href: '/admin/meeting-types',
    icon: Tags,
    roles: ['admin'],
  },
  {
    label: 'Manage Attendance',
    href: '/admin/attendance',
    icon: CheckSquare,
    roles: ['admin'],
  },
  {
    label: 'My Attendance',
    href: '/staff/attendance',
    icon: CheckSquare,
    roles: ['convener', 'staff'],
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['admin', 'convener', 'staff'],
  },
];

export default function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const displayName = user?.staff?.name || user?.username || 'User';
  const profileSrc = user?.profilePicture?.trim() || '';
  const profileHref = `/${role}/profile`;

  // Filter menu items based on role
  const filteredMenuItems = menuItems
    .filter((item) => item.roles.includes(role))
    .map((item) => {
      if (item.label === 'Dashboard') {
        return { ...item, href: `/${role}/dashboard` };
      } else if (item.label === 'Settings') {
        return { ...item, href: `/${role}/settings` };
      } else if (item.label === 'Documents') {
        return { ...item, href: `/${role}/documents` };
      } else if (item.label === 'Reports') {
        return { ...item, href: `/${role}/reports` };
      } else if (item.label === 'Meetings') {
        // Update both label and href for staff and convener
        if (role === 'staff') {
          return { ...item, label: 'My Meetings', href: '/staff/meetings' };
        } else if (role === 'convener') {
          return { ...item, label: 'My Meetings', href: '/convener/meetings' };
        }
        return item; // admin keeps /admin/meetings
      }
      return item;
    });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'admin':
        return 'bg-blue-600';
      case 'convener':
        return 'bg-green-600';
      case 'staff':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getRoleName = () => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'convener':
        return 'Convener';
      case 'staff':
        return 'Staff Member';
      default:
        return 'User';
    }
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* Logo/Header */}
      <div className={`p-6 border-b border-gray-200 ${getRoleColor()}`}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="text-white">
              <h1 className="text-xl font-bold">MOMM</h1>
              <p className="text-xs opacity-90">Meeting System</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10 p-2 rounded-lg"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            {profileSrc ? (
              <img
                src={profileSrc}
                alt={`${displayName} profile`}
                className="h-10 w-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 text-gray-700 font-semibold flex items-center justify-center">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">{displayName}</p>
              <a href={profileHref} className="text-xs text-gray-500 hover:text-gray-700">
                View profile
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {profileSrc ? (
              <img
                src={profileSrc}
                alt={`${displayName} profile`}
                className="h-10 w-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 text-gray-700 font-semibold flex items-center justify-center">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-blue-600" />
                  )}
                  <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
