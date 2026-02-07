'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import RecentMeetings from '@/components/dashboard/RecentMeetings';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import { useAuthGuard } from '@/hooks/useAuthGuard';

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
	const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['convener'] });
	const [data, setData] = useState<ConvenerDashboardData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading && user) {
			fetchDashboardData();
		}
	}, [authLoading, user]);

	const fetchDashboardData = async () => {
		try {
			if (!user) {
				setLoading(false);
				return;
			}

			const response = await fetch(`/api/dashboard?role=convener&userId=${user.id}`);
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
			<DashboardLayout role="convener">
				<div className="flex items-center justify-center h-full">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout role="convener">
			<div className="space-y-8">
				{/* Header */}
				<div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-white">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Convener Overview</p>
							<h1 className="text-3xl font-semibold">Convener Dashboard</h1>
							<p className="text-emerald-200 mt-2">Manage meetings, participants, and follow-ups.</p>
						</div>
						<div className="flex items-center gap-3">
							<div className="rounded-full border border-emerald-800 bg-emerald-900/60 px-4 py-2 text-xs uppercase tracking-wide">
								Role: Convener
							</div>
							<div className="rounded-full border border-emerald-800 bg-emerald-900/60 px-4 py-2 text-xs uppercase tracking-wide">
								Status: Active
							</div>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{[
						{ label: 'My Meetings', value: data?.stats.myMeetings || 0, tone: 'border-emerald-200' },
						{ label: 'Upcoming Meetings', value: data?.stats.upcomingMeetings || 0, tone: 'border-lime-200' },
						{ label: 'Completed Meetings', value: data?.stats.completedMeetings || 0, tone: 'border-sky-200' },
						{ label: 'Pending Docs', value: data?.stats.pendingDocuments || 0, tone: 'border-amber-200' },
						{ label: 'Participants', value: data?.stats.totalParticipants || 0, tone: 'border-indigo-200' },
						{ label: 'This Week', value: data?.stats.thisWeekMeetings || 0, tone: 'border-rose-200' },
					].map((item) => (
						<div
							key={item.label}
							className={`rounded-2xl border ${item.tone} bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
						>
							<p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
							<p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
							<div className="mt-6 h-1 w-full rounded-full bg-slate-100">
								<div className="h-1 rounded-full bg-emerald-900" style={{ width: `${Math.min(item.value * 10, 100)}%` }}></div>
							</div>
						</div>
					))}
				</div>

				{/* Alerts */}
				{data?.stats.pendingDocuments && data.stats.pendingDocuments > 0 && (
					<div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
						<p className="text-sm text-amber-900">
							You have <strong>{data.stats.pendingDocuments}</strong> meeting(s) with pending document uploads.
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

					{/* Recent Meetings */}
					<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-slate-900">Recent Meetings</h2>
							<button className="text-slate-600 hover:text-slate-900 text-sm font-medium">
								View all
							</button>
						</div>
						<RecentMeetings meetings={data?.recentMeetings || []} role="convener" />
					</div>
				</div>

				{/* Pending Tasks */}
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<h2 className="text-xl font-semibold text-slate-900 mb-4">Pending Tasks</h2>
					<div className="space-y-3">
						{data?.pendingTasks && data.pendingTasks.length > 0 ? (
							data.pendingTasks.map((task: any, index: number) => (
								<div key={index} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
									<div className="flex items-center space-x-3">
										<input type="checkbox" className="h-4 w-4 text-emerald-600 rounded" />
										<div>
											<p className="font-medium text-slate-900">{task.title}</p>
											<p className="text-sm text-slate-500">{task.meetingTitle}</p>
										</div>
									</div>
									<span className="text-sm text-slate-500">{task.dueDate}</span>
								</div>
							))
						) : (
							<p className="text-slate-500 text-center py-4">No pending tasks</p>
						)}
					</div>
				</div>

				{/* Quick Actions */}
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<button className="rounded-xl border border-emerald-200 px-4 py-5 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-900 hover:shadow-sm">
							<p className="text-xs uppercase tracking-[0.2em] text-emerald-500">Create</p>
							<p className="mt-2 font-semibold text-slate-900">Create Meeting</p>
						</button>
						<button className="rounded-xl border border-emerald-200 px-4 py-5 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-900 hover:shadow-sm">
							<p className="text-xs uppercase tracking-[0.2em] text-emerald-500">Upload</p>
							<p className="mt-2 font-semibold text-slate-900">Upload MOM</p>
						</button>
						<button className="rounded-xl border border-emerald-200 px-4 py-5 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-900 hover:shadow-sm">
							<p className="text-xs uppercase tracking-[0.2em] text-emerald-500">Attendance</p>
							<p className="mt-2 font-semibold text-slate-900">Mark Attendance</p>
						</button>
						<button className="rounded-xl border border-emerald-200 px-4 py-5 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-900 hover:shadow-sm">
							<p className="text-xs uppercase tracking-[0.2em] text-emerald-500">Reports</p>
							<p className="mt-2 font-semibold text-slate-900">View Reports</p>
						</button>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
