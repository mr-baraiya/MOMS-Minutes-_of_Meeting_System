'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Bell, CheckCheck, Loader2, RefreshCw } from 'lucide-react';

type Role = 'admin' | 'convener' | 'staff';
type Filter = 'all' | 'unread' | 'read';

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsPageProps {
  role: Role;
  allowedRoles: Role[];
}

export default function NotificationsPage({ role, allowedRoles }: NotificationsPageProps) {
  const { user, loading: authLoading } = useAuthGuard({ allowedRoles });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const unreadOnly = filter === 'unread' ? '&unreadOnly=true' : '';
      const response = await fetch(`/api/notifications?limit=100${unreadOnly}`);
      const data = await response.json();
      if (data.success) {
        const all: Notification[] = data.data.notifications;
        setUnreadCount(data.data.unreadCount);
        if (filter === 'read') {
          setNotifications(all.filter((n) => n.isRead));
        } else {
          setNotifications(all);
        }
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!authLoading && user) fetchNotifications();
  }, [authLoading, user, fetchNotifications]);

  const markAsRead = async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchNotifications();
    } finally {
      setMarkingAll(false);
    }
  };

  const formatRelativeTime = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { key: 'read', label: 'Read' },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Bell className="text-blue-600" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500">Stay updated on meetings and activities</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={markingAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {markingAll ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCheck size={14} />
                )}
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-600">
                {filter === 'unread' ? 'All caught up!' : 'No notifications here'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {filter === 'unread'
                  ? 'No new notifications to show.'
                  : filter === 'read'
                  ? 'No read notifications yet.'
                  : 'You have no notifications yet.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex gap-4 p-4 transition-colors ${
                    !n.isRead ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Dot indicator */}
                  <div className="flex-shrink-0 mt-1.5">
                    <span
                      className={`block w-2 h-2 rounded-full ${
                        n.isRead ? 'bg-transparent' : 'bg-blue-500'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-blue-700">{n.title}</p>
                      <span className="flex-shrink-0 text-xs text-gray-400">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">{n.message}</p>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="flex-shrink-0 self-center text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
