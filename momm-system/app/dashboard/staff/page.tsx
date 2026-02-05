'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import AttendanceHistory from '@/components/dashboard/AttendanceHistory';
import { useAuthGuard } from '@/hooks/useAuthGuard';

// Using emoji icons instead of Lucide icons

interface StaffDashboardData {
  stats: {
    assignedMeetings: number;
    upcomingMeetings: number;
    attendedMeetings: number;
    missedMeetings: number;
    pendingMeetings: number;
    documentsAvailable: number;
  };
  upcomingMeetings: any[];
  recentMeetings: any[];
  attendanceHistory: any[];
}

export default function StaffDashboard() {
  const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['staff'] });
  const [data, setData] = useState<StaffDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard?role=staff');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout role="staff">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600 mt-2">View your assigned meetings and attendance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <StatCard
            title="Assigned"
            value={data?.stats.assignedMeetings || 0}
            icon="⌊⌋"
            iconType="css"
            color="blue"
          />
          <StatCard
            title="Upcoming"
            value={data?.stats.upcomingMeetings || 0}
            icon="○"
            iconType="css"
            color="green"
          />
          <StatCard
            title="Attended"
            value={data?.stats.attendedMeetings || 0}
            icon="✓"
            color="purple"
          />
          <StatCard
            title="Missed"
            value={data?.stats.missedMeetings || 0}
            icon="✗"
            color="red"
          />
          <StatCard
            title="Pending"
            value={data?.stats.pendingMeetings || 0}
            icon="◒"
            color="orange"
          />
          <StatCard
            title="Documents"
            value={data?.stats.documentsAvailable || 0}
            icon="▢"
            iconType="css"
            color="indigo"
          />
        </div>

        {/* Alerts */}
        {data?.stats.upcomingMeetings && data.stats.upcomingMeetings > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl text-blue-600">◉</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You have <strong>{data.stats.upcomingMeetings}</strong> upcoming meeting(s) scheduled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Meetings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </button>
            </div>
            <UpcomingMeetings meetings={data?.upcomingMeetings || []} />
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Attendance History</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </button>
            </div>
            <AttendanceHistory history={data?.attendanceHistory || []} />
          </div>
        </div>

        {/* Recent Meeting Documents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Meeting Documents</h2>
          <div className="space-y-3">
            {data?.recentMeetings && data.recentMeetings.length > 0 ? (
              data.recentMeetings.map((meeting: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="font-medium">{meeting.title}</p>
                      <p className="text-sm text-gray-500">{meeting.date} • {meeting.type}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Download
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No documents available</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center">
              <Calendar className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">View Calendar</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center">
              <TrendingUp className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">My Attendance</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center">
              <Download className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">Download MOMs</div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
