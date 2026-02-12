'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Building2, Download, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReportGeneratorProps {
  role: 'admin' | 'convener';
  meetings: Array<{ id: number; meetingTitle: string; meetingDate: Date }>;
  departments?: Array<{ id: number; departmentName: string }>;
  onReportGenerated: () => void;
}

type ReportType = 'meeting-wise' | 'attendance-summary' | 'department-wise' | 'monthly-summary';

export default function ReportGenerator({
  role,
  meetings,
  departments = [],
  onReportGenerated,
}: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType>('meeting-wise');
  const [meetingId, setMeetingId] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [format] = useState<string>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const adminReportTypes: Array<{ value: ReportType; label: string }> = [
    { value: 'meeting-wise', label: 'Meeting-wise Report' },
    { value: 'attendance-summary', label: 'Attendance Summary' },
    { value: 'department-wise', label: 'Department-wise Report' },
    { value: 'monthly-summary', label: 'Monthly Summary' },
  ];

  const convenerReportTypes: Array<{ value: ReportType; label: string }> = [
    { value: 'meeting-wise', label: 'Meeting-wise Report' },
    { value: 'attendance-summary', label: 'Attendance Summary' },
  ];

  const reportTypes = role === 'admin' ? adminReportTypes : convenerReportTypes;

  const handleGenerate = async () => {
    // Validation
    if (reportType === 'meeting-wise' && !meetingId) {
      toast.error('Please select a meeting');
      return;
    }

    if (reportType === 'department-wise' && !departmentId) {
      toast.error('Please select a department');
      return;
    }

    if (!dateFrom || !dateTo) {
      toast.error('Please select date range');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          meetingId: meetingId ? parseInt(meetingId) : undefined,
          departmentId: departmentId ? parseInt(departmentId) : undefined,
          dateFrom,
          dateTo,
          format,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Report generated successfully');
        onReportGenerated();
        
        // Reset form
        setMeetingId('');
        setDepartmentId('');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Report Generator</h2>
          <p className="text-sm text-gray-600">Configure and generate reports</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Meeting Selector */}
        {(reportType === 'meeting-wise' || reportType === 'attendance-summary') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Meeting {reportType === 'meeting-wise' ? '(Required)' : '(Optional)'}
            </label>
            <select
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Meetings</option>
              {meetings.map((meeting) => (
                <option key={meeting.id} value={meeting.id}>
                  {meeting.meetingTitle} ({new Date(meeting.meetingDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Department Selector (Admin only) */}
        {role === 'admin' && reportType === 'department-wise' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              Department (Required)
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Output Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Format
          </label>
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <Download className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">PDF (Default)</span>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Generate Report
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
