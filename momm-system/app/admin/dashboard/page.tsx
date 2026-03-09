'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AnimatedKPICard from '@/components/dashboard/AnimatedKPICard';
import MeetingsPerMonthChart from '@/components/dashboard/MeetingsPerMonthChart';
import AttendanceTrendChart from '@/components/dashboard/AttendanceTrendChart';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import DepartmentDistributionChart from '@/components/dashboard/DepartmentDistributionChart';
import MeetingTypePieChart from '@/components/dashboard/MeetingTypePieChart';
import MeetingStatusChart from '@/components/dashboard/MeetingStatusChart';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import QuickActions from '@/components/dashboard/QuickActions';
import SystemAlerts from '@/components/dashboard/SystemAlerts';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Calendar, Users, Building2, TrendingUp, Layers, FileText } from 'lucide-react';

interface AdminDashboardData {
	stats: {
		totalUsers: number;
		totalMeetings: number;
		totalDepartments: number;
		totalVenues: number;
		activeMeetings: number;
		completedMeetings: number;
		cancelledMeetings: number;
		totalStaff: number;
		totalDocuments: number;
		overallAttendance: number;
	};
	recentMeetings: any[];
	upcomingMeetings: any[];
	recentActivity: any[];
	meetingsPerMonth: { month: string; meetings: number }[];
	attendanceTrend: { month: string; attendance: number }[];
	departmentStats: { name: string; value: number }[];
	meetingTypeStats: { name: string; value: number }[];
}

export default function AdminDashboard() {
	const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
	const [data, setData] = useState<AdminDashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const headerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!authLoading) {
			if (user) {
				fetchDashboardData();
			} else {
				// Stop loading if no user is present (will be redirected by AuthGuard)
				setLoading(false);
			}
		}
	}, [authLoading, user]);

	useEffect(() => {
		if (headerRef.current && data) {
			// GSAP animation for header
			gsap.from(headerRef.current, {
				y: -50,
				opacity: 0,
				duration: 0.8,
				ease: 'power3.out',
			});
		}
	}, [data]);

	const fetchDashboardData = async () => {
		try {
			const response = await fetch('/api/dashboard?role=admin');
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
			<DashboardLayout role="admin">
				<div className="flex items-center justify-center h-full">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
						className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
					/>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout role="admin">
			<div className="space-y-6 pb-8">
				{/* Header */}
				<div ref={headerRef} className="bg-blue-700 p-8 text-white border-2 border-blue-800 rounded-xl">
					<h1 className="text-4xl font-bold mb-2 uppercase tracking-wide">Admin Dashboard</h1>
					<p className="text-blue-100 text-lg">
						Welcome back! Here's an overview of your system performance
					</p>
				</div>

				{/* ── Row 1: 6 KPI Stat Cards ── */}
				<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
					<AnimatedKPICard
						title="Total Meetings"
						value={data?.stats.totalMeetings || 0}
						icon={Calendar}
						color="blue"
						delay={0.05}
					/>
					<AnimatedKPICard
						title="Upcoming Meetings"
						value={data?.stats.activeMeetings || 0}
						icon={TrendingUp}
						color="green"
						delay={0.1}
					/>
					<AnimatedKPICard
						title="Total Staff"
						value={data?.stats.totalStaff || 0}
						icon={Users}
						color="purple"
						delay={0.15}
					/>
					<AnimatedKPICard
						title="Attendance Rate"
						value={data?.stats.overallAttendance || 0}
						icon={Building2}
						color="orange"
						delay={0.2}
						suffix="%"
					/>
					<AnimatedKPICard
						title="Total Departments"
						value={data?.stats.totalDepartments || 0}
						icon={Layers}
						color="teal"
						delay={0.25}
					/>
					<AnimatedKPICard
						title="Total Documents"
						value={data?.stats.totalDocuments || 0}
						icon={FileText}
						color="red"
						delay={0.3}
					/>
				</div>

				{/* ── Row 2: Meetings per Month + Attendance Trend ── */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<MeetingsPerMonthChart data={data?.meetingsPerMonth || []} />
					<AttendanceTrendChart data={data?.attendanceTrend || []} />
				</div>

				{/* ── Row 3: Dept chart + Meeting Types + Meeting Status ── */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<DepartmentDistributionChart data={data?.departmentStats || []} />
					<MeetingTypePieChart data={data?.meetingTypeStats || []} />
					<MeetingStatusChart
						completed={data?.stats.completedMeetings || 0}
						upcoming={data?.stats.activeMeetings || 0}
						cancelled={data?.stats.cancelledMeetings || 0}
					/>
				</div>

				{/* ── Row 4: Upcoming Meetings (2/3) + Quick Actions (1/3) ── */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
					>
						<div className="flex items-center justify-between mb-5">
							<h3 className="text-xl font-bold text-gray-900">Upcoming Meetings</h3>
							<a
								href="/admin/meetings"
								className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
							>
								View all →
							</a>
						</div>
						<UpcomingMeetings
							meetings={(data?.upcomingMeetings || []).map((m: any) => ({
								id: m.id,
								title: m.meetingTitle,
								date: typeof m.meetingDate === 'string'
									? m.meetingDate.split('T')[0]
									: new Date(m.meetingDate).toISOString().split('T')[0],
								time: m.meetingStartTime || 'TBD',
								type: m.meetingType?.meetingTypeName || 'N/A',
								venue: m.venue?.venueName || 'N/A',
								participantsCount: m._count?.meetingMembers ?? 0,
							}))}
						/>
					</motion.div>
					<QuickActions />
				</div>

				{/* ── Row 5: Recent Activity (2/3) + System Alerts (1/3) ── */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<RecentActivityList activities={data?.recentActivity || []} />
					</div>
					<SystemAlerts
						attendanceRate={data?.stats.overallAttendance || 0}
						totalMeetings={data?.stats.totalMeetings || 0}
						upcomingCount={data?.stats.activeMeetings || 0}
						cancelledMeetings={data?.stats.cancelledMeetings || 0}
						totalDocuments={data?.stats.totalDocuments || 0}
					/>
				</div>
			</div>
		</DashboardLayout>
	);
}
