'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import RecentMeetings from '@/components/dashboard/RecentMeetings';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import { Plus, Upload, CheckCircle, TrendingUp, AlertTriangle, ClipboardList, Clock, Users, FileText, Calendar } from 'lucide-react';

interface ConvenerDashboardData {
  stats: {
    myMeetings: number;
    upcomingMeetings: number;
    completedMeetings: number;
    pendingDocuments: number;
    totalParticipants: number;
    thisWeekMeetings: number;
  };
  upcomingMeetings: any[];
  recentMeetings: any[];
  pendingTasks: any[];
}

export default function ConvenerDashboard() {
  const [data, setData] = useState<ConvenerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard?role=convener');
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

  if (loading) {
    return (
      <DashboardLayout role="convener">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="convener">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Convener Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your meetings and participants</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <StatCard
            title="My Meetings"
            value={data?.stats.myMeetings || 0}
            icon={ClipboardList}
            color="blue"
          />
          <StatCard
            title="Upcoming"
            value={data?.stats.upcomingMeetings || 0}
            icon={Clock}
            color="green"
          />
          <StatCard
            title="Completed"
            value={data?.stats.completedMeetings || 0}
            icon={CheckCircle}
            color="purple"
          />
          <StatCard
            title="Pending Docs"
            value={data?.stats.pendingDocuments || 0}
            icon={FileText}
            color="orange"
          />
          <StatCard
            title="Participants"
            value={data?.stats.totalParticipants || 0}
            icon={Users}
            color="indigo"
          />
          <StatCard
            title="This Week"
            value={data?.stats.thisWeekMeetings || 0}
            icon={Calendar}
            color="pink"
          />
        </div>

        {/* Alerts */}
        {data?.stats.pendingDocuments && data.stats.pendingDocuments > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You have <strong>{data.stats.pendingDocuments}</strong> meeting(s) with pending document uploads.
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

          {/* Recent Meetings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Meetings</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </button>
            </div>
            <RecentMeetings meetings={data?.recentMeetings || []} role="convener" />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
          <div className="space-y-3">
            {data?.pendingTasks && data.pendingTasks.length > 0 ? (
              data.pendingTasks.map((task: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.meetingTitle}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{task.dueDate}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pending tasks</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors flex flex-col items-center">
              <Plus className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">Create Meeting</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">Upload MOM</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors flex flex-col items-center">
              <CheckCircle className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">Mark Attendance</div>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors flex flex-col items-center">
              <TrendingUp className="h-8 w-8 text-gray-600 mb-2" />
              <div className="font-medium">View Reports</div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
