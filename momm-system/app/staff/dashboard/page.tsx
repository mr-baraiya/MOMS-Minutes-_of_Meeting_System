'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import AttendanceHistory from '@/components/dashboard/AttendanceHistory';
import { useAuthGuard } from '@/hooks/useAuthGuard';

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
			const staffId = user?.staff?.id;

			if (!staffId) {
				setLoading(false);
				return;
			}

			const response = await fetch(`/api/dashboard?role=staff&staffId=${staffId}`);
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
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout role="staff">
			<div className="space-y-8">
				{/* Header */}
				<div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-slate-300">Staff Overview</p>
							<h1 className="text-3xl font-semibold">Staff Dashboard</h1>
							<p className="text-slate-300 mt-2">Track assignments, attendance, and meeting documents.</p>
						</div>
						<div className="flex items-center gap-3">
							<div className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-wide">
								Role: Staff
							</div>
							<div className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-wide">
								Status: Active
							</div>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{[
						{ label: 'Assigned Meetings', value: data?.stats.assignedMeetings || 0, tone: 'border-slate-200' },
						{ label: 'Upcoming Meetings', value: data?.stats.upcomingMeetings || 0, tone: 'border-emerald-200' },
						{ label: 'Attended Meetings', value: data?.stats.attendedMeetings || 0, tone: 'border-indigo-200' },
						{ label: 'Missed Meetings', value: data?.stats.missedMeetings || 0, tone: 'border-rose-200' },
						{ label: 'Pending Attendance', value: data?.stats.pendingMeetings || 0, tone: 'border-amber-200' },
						{ label: 'Documents Available', value: data?.stats.documentsAvailable || 0, tone: 'border-sky-200' },
					].map((item) => (
						<div
							key={item.label}
							className={`rounded-2xl border ${item.tone} bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
						>
							<p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
							<p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
							<div className="mt-6 h-1 w-full rounded-full bg-slate-100">
								<div className="h-1 rounded-full bg-slate-900" style={{ width: `${Math.min(item.value * 10, 100)}%` }}></div>
							</div>
						</div>
					))}
				</div>

				{/* Alerts */}
				{data?.stats.upcomingMeetings && data.stats.upcomingMeetings > 0 && (
					<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
						<p className="text-sm text-slate-700">
							You have <strong className="text-slate-900">{data.stats.upcomingMeetings}</strong> upcoming meeting(s) scheduled.
						</p>
					</div>
				)}

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Upcoming Meetings */}
					<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-slate-900">Upcoming Meetings</h2>
							<button className="text-slate-600 hover:text-slate-900 text-sm font-medium">
								View all
							</button>
						</div>
						<UpcomingMeetings meetings={data?.upcomingMeetings || []} />
					</div>

					{/* Attendance History */}
					<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-slate-900">Attendance History</h2>
							<button className="text-slate-600 hover:text-slate-900 text-sm font-medium">
								View all
							</button>
						</div>
						<AttendanceHistory history={data?.attendanceHistory || []} />
					</div>
				</div>

				{/* Recent Meeting Documents */}
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold text-slate-900">Recent Meeting Documents</h2>
						<button className="text-slate-600 hover:text-slate-900 text-sm font-medium">
							View all
						</button>
					</div>
					<div className="space-y-3">
						{data?.recentMeetings && data.recentMeetings.length > 0 ? (
							data.recentMeetings.map((meeting: any, index: number) => (
								<div key={index} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
									<div>
										<p className="font-medium text-slate-900">{meeting.title}</p>
										<p className="text-sm text-slate-500">{meeting.date} • {meeting.type}</p>
									</div>
									<button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-900 hover:text-slate-900">
										Download
									</button>
								</div>
							))
						) : (
							<p className="text-slate-500 text-center py-4">No documents available</p>
						)}
					</div>
				</div>

				{/* Quick Actions */}
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<button className="rounded-xl border border-slate-200 px-4 py-5 text-left transition-all hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-sm">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-400">Calendar</p>
							<p className="mt-2 font-semibold text-slate-900">View Calendar</p>
						</button>
						<button className="rounded-xl border border-slate-200 px-4 py-5 text-left transition-all hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-sm">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-400">Attendance</p>
							<p className="mt-2 font-semibold text-slate-900">My Attendance</p>
						</button>
						<button className="rounded-xl border border-slate-200 px-4 py-5 text-left transition-all hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-sm">
							<p className="text-xs uppercase tracking-[0.2em] text-slate-400">Documents</p>
							<p className="mt-2 font-semibold text-slate-900">Download MOMs</p>
						</button>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
