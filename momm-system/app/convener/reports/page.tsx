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
}

interface Meeting {
  id: number;
  meetingTitle: string;
  meetingDate: Date;
}

export default function ConvenerReportsPage() {
  const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['convener'] });
  const [reports, setReports] = useState<Report[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
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
      await Promise.all([fetchReports(), fetchMeetings()]);
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
      // Fetch only convener's own meetings
      const response = await fetch('/api/meetings?limit=500');
      if (response.ok) {
        const data = await response.json();
        setMeetings(data.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
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
      <DashboardLayout role="convener">
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
    <DashboardLayout role="convener">
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 border-2 border-gray-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center border-2 border-blue-800">
                <FileBarChart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">My Reports</h1>
                <p className="text-gray-600 mt-1">
                  Reports from meetings you organized
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
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileBarChart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">My Reports</p>
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
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileBarChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">My Meetings</p>
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
            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileBarChart className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    Generate Reports for Your Meetings
                  </h3>
                  <p className="text-sm text-blue-700">
                    You can generate meeting-wise and attendance summary reports for meetings you've organized.
                    Select a meeting from the dropdown to get started.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Report Generator */}
            <ReportGenerator
              role="convener"
              meetings={meetings}
              onReportGenerated={handleReportGenerated}
            />

            {/* Report History */}
            <ReportHistoryTable
              reports={reports}
              role="convener"
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
