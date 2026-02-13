'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, User, Settings as SettingsIcon, HelpCircle, LogOut, ChevronDown, Calendar, FileText, Users, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  role: 'admin' | 'convener' | 'staff';
}

interface SearchResults {
  meetings: any[];
  documents: any[];
  staff: any[];
  query: string;
}

export default function Header({ role }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchRef = useRef<HTMLDivElement>(null);

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
    // Route to correct meetings page based on role
    if (role === 'convener') {
      router.push('/convener/meetings?create=1');
    } else {
      router.push('/admin/meetings?create=1');
    }
  };

  const handleLogout = async () => {
    setShowProfile(false);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Search handler with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length < 2) {
      setSearchResults(null);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=5`);
        const data = await response.json();
        
        if (data.success) {
          setSearchResults(data.data);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigate to result
  const handleResultClick = (type: 'meeting' | 'document' | 'staff', id: number) => {
    setShowSearchResults(false);
    setSearchQuery('');
    
    if (type === 'meeting') {
      router.push(`/${role}/meetings/${id}`);
    } else if (type === 'document') {
      router.push(`/${role}/documents`);
    } else if (type === 'staff') {
      router.push(`/admin/staff/${id}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search meetings, documents, staff..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchResults && setShowSearchResults(true)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-2.5 text-gray-400 animate-spin" size={20} />
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {/* Meetings */}
                {searchResults.meetings.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                      <Calendar size={14} />
                      Meetings
                    </div>
                    {searchResults.meetings.map((meeting) => (
                      <button
                        key={meeting.id}
                        onClick={() => handleResultClick('meeting', meeting.id)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-900">{meeting.meetingTitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {new Date(meeting.meetingDate).toLocaleDateString()}
                          </span>
                          {meeting.meetingType && (
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                              {meeting.meetingType.meetingTypeName}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Documents */}
                {searchResults.documents.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                      <FileText size={14} />
                      Documents
                    </div>
                    {searchResults.documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => handleResultClick('document', doc.id)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-900">{doc.documentTitle}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.meeting?.meetingTitle} • {doc.fileName}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Staff */}
                {searchResults.staff.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                      <Users size={14} />
                      Staff
                    </div>
                    {searchResults.staff.map((staff) => (
                      <button
                        key={staff.id}
                        onClick={() => handleResultClick('staff', staff.id)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-900">{staff.staffName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {staff.designation && (
                            <span className="text-xs text-gray-500">{staff.designation}</span>
                          )}
                          {staff.department && (
                            <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded">
                              {staff.department.departmentName}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {searchResults.meetings.length === 0 && 
                 searchResults.documents.length === 0 && 
                 searchResults.staff.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-sm text-gray-500">No results found for "{searchResults.query}"</p>
                  </div>
                )}
              </div>
            )}
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
