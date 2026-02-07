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
  TrendingUp,
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
    href: '/meetings',
    icon: Calendar,
    roles: ['admin', 'convener', 'staff'],
  },
  {
    label: 'Calendar',
    href: '/calendar',
    icon: CalendarDays,
    roles: ['admin', 'convener', 'staff'],
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
    icon: TrendingUp,
    roles: ['admin', 'convener'],
  },
  {
    label: 'Users',
    href: '/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    label: 'Staff',
    href: '/staff',
    icon: UserCog,
    roles: ['admin'],
  },
  {
    label: 'Departments',
    href: '/departments',
    icon: Building2,
    roles: ['admin'],
  },
  {
    label: 'Venues',
    href: '/venues',
    icon: MapPin,
    roles: ['admin'],
  },
  {
    label: 'Meeting Types',
    href: '/meeting-types',
    icon: Tags,
    roles: ['admin'],
  },
  {
    label: 'My Attendance',
    href: '/attendance',
    icon: CheckSquare,
    roles: ['staff'],
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
  const { logout } = useAuth();
  const pathname = usePathname();

  // Filter menu items based on role
  const filteredMenuItems = menuItems
    .filter((item) => item.roles.includes(role))
    .map((item) =>
      item.label === 'Dashboard'
        ? { ...item, href: `/${role}/dashboard` }
        : item.label === 'Settings'
        ? { ...item, href: `/${role}/settings` }
        : item
    );

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
      {!isCollapsed && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${getRoleColor()}`}>
            {getRoleName()}
          </div>
        </div>
      )}

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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? `${getRoleColor()} text-white`
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} />
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
