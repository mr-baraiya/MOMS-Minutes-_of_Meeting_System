'use client';

import { use, useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AttendanceManager from '@/components/meetings/AttendanceManager';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function AdminAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user, loading } = useAuthGuard({ allowedRoles: ['admin'] });
  const [meetingId, setMeetingId] = useState<number | null>(null);

  useEffect(() => {
    if (resolvedParams.id) {
      setMeetingId(parseInt(resolvedParams.id));
    }
  }, [resolvedParams.id]);

  if (loading || !meetingId) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-full">
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
      <AttendanceManager meetingId={meetingId} role="admin" />
    </DashboardLayout>
  );
}
