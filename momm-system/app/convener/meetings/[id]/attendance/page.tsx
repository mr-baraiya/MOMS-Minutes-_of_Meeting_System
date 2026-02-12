'use client';

import { use, useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AttendanceManager from '@/components/meetings/AttendanceManager';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function ConvenerAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user, loading } = useAuthGuard({ allowedRoles: ['convener'] });
  const [meetingId, setMeetingId] = useState<number | null>(null);

  useEffect(() => {
    if (resolvedParams.id) {
      setMeetingId(parseInt(resolvedParams.id));
    }
  }, [resolvedParams.id]);

  if (loading || !meetingId) {
    return (
      <DashboardLayout role="convener">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="convener">
      <AttendanceManager meetingId={meetingId} role="convener" />
    </DashboardLayout>
  );
}
