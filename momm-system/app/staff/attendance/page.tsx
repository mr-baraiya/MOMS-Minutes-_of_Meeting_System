'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import AttendanceHistory from '@/components/dashboard/AttendanceHistory';
import { Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function StaffAttendancePage() {
    const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['staff', 'admin', 'convener'] });
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0
    });

    useEffect(() => {
        if (!authLoading && user) {
            fetchAttendance();
        }
    }, [authLoading, user]);

    const fetchAttendance = async () => {
        try {
            const response = await fetch('/api/staff/attendance');
            const result = await response.json();
            
            if (result.success) {
                const data = result.data;
                const mappedHistory = data.map((record: any) => ({
                    id: record.id,
                    meetingTitle: record.meeting.meetingTitle,
                    date: new Date(record.meeting.meetingDate).toLocaleDateString(),
                    status: record.isPresent ? 'present' : (new Date(record.meeting.meetingDate) < new Date() ? 'absent' : 'pending'),
                    meetingType: record.meeting.meetingType?.meetingTypeName || 'Meeting'
                }));
                
                setHistory(mappedHistory);
                
                // Calculate stats
                const total = mappedHistory.filter((h: any) => h.status !== 'pending').length;
                const present = mappedHistory.filter((h: any) => h.status === 'present').length;
                const absent = mappedHistory.filter((h: any) => h.status === 'absent').length;
                const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
                
                setStats({ total, present, absent, percentage });
            }
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <DashboardLayout role={(user?.role as 'admin' | 'convener' | 'staff') || 'staff'}>
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
        <DashboardLayout role={(user?.role as 'admin' | 'convener' | 'staff') || 'staff'}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">My Attendance</h1>
                        <p className="text-slate-500">Track your meeting attendance history.</p>
                    </div>
                    <div className="bg-white px-4 py-2 border-2 border-gray-300">
                        <span className="text-sm text-gray-600 uppercase tracking-wide">Attendance Rate</span>
                        <p className={`text-2xl font-bold text-blue-700`}>
                            {stats.percentage}%
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 border-2 border-gray-300 flex items-center gap-4">
                        <div className="p-3 bg-blue-700 border-2 border-blue-800 text-white">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 uppercase tracking-wide">Present</p>
                            <p className="text-2xl font-semibold text-blue-700">{stats.present}</p>
                        </div>
                    </div>
                     <div className="bg-white p-4 border-2 border-gray-300 flex items-center gap-4">
                        <div className="p-3 bg-blue-700 border-2 border-blue-800 text-white">
                            <XCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 uppercase tracking-wide">Absent</p>
                            <p className="text-2xl font-semibold text-blue-700">{stats.absent}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 border-2 border-gray-300 flex items-center gap-4">
                        <div className="p-3 bg-blue-700 border-2 border-blue-800 text-white">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 uppercase tracking-wide">Total Completed</p>
                            <p className="text-2xl font-semibold text-blue-700">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-2 border-gray-300 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 uppercase tracking-wide">Detailed History</h2>
                    <AttendanceHistory history={history} />
                </div>
            </div>
        </DashboardLayout>
    );
}
