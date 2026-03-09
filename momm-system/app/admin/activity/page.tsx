'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import {
  Calendar,
  FileText,
  CheckCircle,
  Users,
  RefreshCw,
  Search,
  Loader2,
  Activity,
} from 'lucide-react';

interface ActivityItem {
  id: number;
  action: string;
  user: string;
  timestamp: string;
  type: 'meeting' | 'document' | 'attendance' | string;
}

type Filter = 'all' | 'meeting' | 'document' | 'attendance';

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  meeting:    { icon: Calendar,     color: 'text-blue-600',   bg: 'bg-blue-50',    label: 'Meeting' },
  document:   { icon: FileText,     color: 'text-purple-600', bg: 'bg-purple-50',  label: 'Document' },
  attendance: { icon: Users,        color: 'text-green-600',  bg: 'bg-green-50',   label: 'Attendance' },
  default:    { icon: CheckCircle,  color: 'text-gray-500',   bg: 'bg-gray-100',   label: 'Other' },
};

function getConfig(type: string) {
  return typeConfig[type] ?? typeConfig.default;
}

export default function AdminActivityPage() {
  const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const fetchActivity = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/activity?limit=500');
      const data = await res.json();
      if (data.success) {
        setActivities(data.data.activities);
      }
    } catch (e) {
      console.error('Failed to fetch activity', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) fetchActivity();
  }, [authLoading, user, fetchActivity]);

  const visible = activities.filter((a) => {
    const matchesFilter = filter === 'all' || a.type === filter;
    const matchesSearch =
      !search ||
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.user.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: activities.length,
    meeting: activities.filter((a) => a.type === 'meeting').length,
    document: activities.filter((a) => a.type === 'document').length,
    attendance: activities.filter((a) => a.type === 'attendance').length,
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'all',        label: `All (${counts.all})` },
    { key: 'meeting',    label: `Meetings (${counts.meeting})` },
    { key: 'document',   label: `Documents (${counts.document})` },
    { key: 'attendance', label: `Attendance (${counts.attendance})` },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Activity</h1>
              <p className="text-sm text-gray-500">Complete system activity log</p>
            </div>
          </div>
          <button
            onClick={fetchActivity}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search activity…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Type filter tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity list */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Activity className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">No activity found</p>
              {search && <p className="text-xs text-gray-400 mt-1">Try clearing your search</p>}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visible.map((activity, idx) => {
                const { icon: Icon, color, bg, label } = getConfig(activity.type);
                return (
                  <li
                    key={`${activity.type}-${activity.id}-${idx}`}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`flex-shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                        <span className="font-medium text-gray-500">{activity.user}</span>
                        <span>•</span>
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                    <span className={`flex-shrink-0 self-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${bg} ${color}`}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer count */}
        {!loading && visible.length > 0 && (
          <p className="text-xs text-gray-400 text-right">
            Showing {visible.length} of {activities.length} events
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
