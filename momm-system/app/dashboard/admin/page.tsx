'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import RecentMeetings from '@/components/dashboard/RecentMeetings';
import SystemActivity from '@/components/dashboard/SystemActivity';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Users, Calendar, Building2, MapPin, CheckCircle, XCircle, UserPlus, FileText, TrendingUp } from 'lucide-react';

interface AdminDashboardData {
  stats: {
    totalUsers: number;
    totalMeetings: number;
    totalDepartments: number;
    totalVenues: number;
    activeMeetings: number;
    completedMeetings: number;
    cancelledMeetings: number;
    totalStaff: number;
  };
  recentMeetings: any[];
  recentActivity: any[];
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard?role=admin');
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
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of system-wide statistics and activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={data?.stats.totalUsers || 0}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            color="blue"
          />
          <StatCard
            title="Total Meetings"
            value={data?.stats.totalMeetings || 0}
            icon={Calendar}
            trend={{ value: 8, isPositive: true }}
            color="green"
          />
          <StatCard
            title="Departments"
            value={data?.stats.totalDepartments || 0}
            icon={Building2}
            color="purple"
          />
          <StatCard
            title="Venues"
            value={data?.stats.totalVenues || 0}
            icon={MapPin}
            color="orange"
          />
        </div>

        {/* Meeting Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Active Meetings"
            value={data?.stats.activeMeetings || 0}
            icon={Calendar}
            color="green"
          />
          <StatCard
            title="Completed"
            value={data?.stats.completedMeetings || 0}
            icon={CheckCircle}
            color="blue"
          />
          <StatCard
            title="Cancelled"
            value={data?.stats.cancelledMeetings || 0}
            icon={XCircle}
            color="red"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Meetings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Meetings</h2>
            <RecentMeetings meetings={data?.recentMeetings || []} role="admin" />
          </div>

          {/* System Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">System Activity</h2>
            <SystemActivity activities={data?.recentActivity || []} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center">
              <UserPlus className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">Add User</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center">
              <Building2 className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">Add Department</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center">
              <MapPin className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">Add Venue</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center">
              <TrendingUp className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">View Reports</div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
