'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import ReportGenerator from '@/components/reports/ReportGenerator';
import ReportHistoryTable from '@/components/reports/ReportHistoryTable';
import ReportPreviewDrawer from '@/components/reports/ReportPreviewDrawer';

interface Report {
  id: number;
  reportName: string;
  reportType: string;
  fileUrl: string;
  createdAt: Date;
  generatedBy?: {
    username: string;
    staff?: {
      staffName: string;
    };
  };
  meeting?: {
    meetingTitle: string;
    meetingDate: Date;
  };
  department?: {
    departmentName: string;
  };
}

interface Meeting {
  id: number;
  meetingTitle: string;
  meetingDate: Date;
}

interface Department {
  id: number;
  departmentName: string;
}

export default function AdminReportsPage() {
  const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
  const [reports, setReports] = useState<Report[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchReports(), fetchMeetings(), fetchDepartments()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        toast.error('Failed to load reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/meetings?limit=500');
      if (response.ok) {
        const data = await response.json();
        setMeetings(data.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handlePreview = (report: Report) => {
    setSelectedReport(report);
    setIsPreviewOpen(true);
  };

  const handleReportGenerated = () => {
    fetchReports();
  };

  if (authLoading || !user) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-screen">
          <div
            style={{ animation: 'spin 1s linear infinite' }}
            className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileBarChart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-600 mt-1">
                  System-wide meeting and attendance reports
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileBarChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileBarChart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    reports.filter(
                      (r) =>
                        new Date(r.createdAt).getMonth() === new Date().getMonth() &&
                        new Date(r.createdAt).getFullYear() === new Date().getFullYear()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileBarChart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Meetings</p>
                <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div
              style={{ animation: 'spin 1s linear infinite' }}
              className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
            />
          </div>
        ) : (
          <>
            {/* Report Generator */}
            <ReportGenerator
              role="admin"
              meetings={meetings}
              departments={departments}
              onReportGenerated={handleReportGenerated}
            />

            {/* Report History */}
            <ReportHistoryTable
              reports={reports}
              role="admin"
              onPreview={handlePreview}
              onRefresh={fetchReports}
            />
          </>
        )}

        {/* Preview Drawer */}
        <ReportPreviewDrawer
          report={selectedReport}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
