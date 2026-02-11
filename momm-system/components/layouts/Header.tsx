'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, User, Settings as SettingsIcon, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  role: 'admin' | 'convener' | 'staff';
}

export default function Header({ role }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const displayName = user?.staff?.name || user?.username || 'User';
  const displayEmail = user?.email || 'user@example.com';
  const displayRole = (user?.role || role || 'user').toString();
  const profileHref = `/${displayRole}/profile`;
  const settingsHref = `/${displayRole}/settings`;
  const profileSrc = user?.profilePicture?.trim() || '';

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    const first = parts[0]?.[0] || 'U';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return `${first}${last}`.toUpperCase();
  };

  // Mock data - replace with actual data from context/API
  const notifications = [
    { id: 1, type: 'Meeting created', message: 'Quarterly planning meeting was scheduled.', time: '10 min ago', unread: true },
    { id: 2, type: 'MOM uploaded', message: 'MOM document uploaded for Project Sync.', time: '1 hour ago', unread: true },
    { id: 3, type: 'Attendance marked', message: 'Attendance marked for Sprint Review.', time: '2 hours ago', unread: false },
    { id: 4, type: 'Report generated', message: 'Monthly report is ready to download.', time: 'Yesterday', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNewMeetingClick = () => {
    router.push('/admin/meetings?create=1');
  };

  const handleLogout = async () => {
    setShowProfile(false);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Search meetings, documents, staff..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-6">
          {/* Quick Actions */}
          {role !== 'staff' && (
            <button
              onClick={handleNewMeetingClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + New Meeting
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-blue-600">{notification.type}</p>
                        {notification.unread && (
                          <span className="text-[10px] font-semibold text-blue-600">NEW</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden h-8 w-px bg-gray-200 md:block" />
          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {profileSrc ? (
                <img
                  src={profileSrc}
                  alt={`${displayName} profile`}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(displayName)}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500 capitalize">{displayRole}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">{displayName}</p>
                  <p className="text-sm text-gray-500">{displayEmail}</p>
                </div>
                <div className="py-2">
                  <a href={profileHref} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User size={16} />
                    My Profile
                  </a>
                  <a href={settingsHref} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <SettingsIcon size={16} />
                    Settings
                  </a>
                  <a href="/help" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <HelpCircle size={16} />
                    Help & Support
                  </a>
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
