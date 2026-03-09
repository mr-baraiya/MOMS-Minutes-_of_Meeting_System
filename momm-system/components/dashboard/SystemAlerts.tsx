'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Calendar,
  BarChart2,
  TrendingDown,
  Bell,
} from 'lucide-react';

interface AlertItem {
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
}

interface SystemAlertsProps {
  attendanceRate: number;
  totalMeetings: number;
  upcomingCount: number;
  cancelledMeetings: number;
  totalDocuments: number;
}

const alertStyles = {
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-800',
    msgColor: 'text-amber-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800',
    msgColor: 'text-blue-700',
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-800',
    msgColor: 'text-emerald-700',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: XCircle,
    iconColor: 'text-red-500',
    titleColor: 'text-red-800',
    msgColor: 'text-red-700',
  },
};

export default function SystemAlerts({
  attendanceRate,
  totalMeetings,
  upcomingCount,
  cancelledMeetings,
  totalDocuments,
}: SystemAlertsProps) {
  const alerts: AlertItem[] = [];

  // Attendance rate alert
  if (attendanceRate > 0 && attendanceRate < 70) {
    alerts.push({
      type: 'warning',
      title: 'Low Attendance Rate',
      message: `Overall attendance is ${attendanceRate.toFixed(1)}%, below the 70% target. Consider follow-ups.`,
    });
  } else if (attendanceRate >= 90) {
    alerts.push({
      type: 'success',
      title: 'Excellent Attendance',
      message: `Attendance rate is ${attendanceRate.toFixed(1)}% — well above target. Great engagement!`,
    });
  } else if (attendanceRate >= 70) {
    alerts.push({
      type: 'info',
      title: 'Good Attendance Rate',
      message: `Attendance is at ${attendanceRate.toFixed(1)}%. Maintaining above the 70% threshold.`,
    });
  }

  // High cancellation rate
  if (totalMeetings > 0) {
    const cancelRate = (cancelledMeetings / totalMeetings) * 100;
    if (cancelRate > 20) {
      alerts.push({
        type: 'error',
        title: 'High Cancellation Rate',
        message: `${cancelledMeetings} meeting(s) cancelled (${cancelRate.toFixed(1)}% of total). Review scheduling.`,
      });
    }
  }

  // No documents uploaded
  if (totalDocuments === 0) {
    alerts.push({
      type: 'info',
      title: 'No Documents Uploaded',
      message: 'No meeting documents have been uploaded yet. Encourage organizers to attach minutes.',
    });
  }

  // Upcoming meetings reminder
  if (upcomingCount > 0) {
    alerts.push({
      type: 'info',
      title: `${upcomingCount} Upcoming Meeting${upcomingCount > 1 ? 's' : ''}`,
      message: 'Ensure agendas, venues, and attendance lists are prepared in advance.',
    });
  }

  // Fallback: all good
  if (alerts.length === 0) {
    alerts.push({
      type: 'success',
      title: 'All Systems Operational',
      message: 'No issues detected. The system is running smoothly.',
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-full"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Bell className="w-5 h-5 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">System Alerts</h3>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => {
          const styles = alertStyles[alert.type];
          const Icon = styles.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className={`${styles.bg} ${styles.border} border rounded-lg p-3 flex gap-3`}
            >
              <Icon className={`${styles.iconColor} w-5 h-5 shrink-0 mt-0.5`} />
              <div>
                <p className={`text-sm font-semibold ${styles.titleColor}`}>{alert.title}</p>
                <p className={`text-xs mt-0.5 ${styles.msgColor}`}>{alert.message}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
