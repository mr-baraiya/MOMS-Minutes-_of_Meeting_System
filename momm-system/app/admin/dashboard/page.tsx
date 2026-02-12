'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AnimatedKPICard from '@/components/dashboard/AnimatedKPICard';
import MeetingsPerMonthChart from '@/components/dashboard/MeetingsPerMonthChart';
import AttendanceTrendChart from '@/components/dashboard/AttendanceTrendChart';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Calendar, Users, Building2, TrendingUp } from 'lucide-react';

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
		overallAttendance: number;
	};
	recentMeetings: any[];
	upcomingMeetings: any[];
	recentActivity: any[];
	meetingsPerMonth: { month: string; meetings: number }[];
	attendanceTrend: { month: string; attendance: number }[];
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
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout role="admin">
			<div className="space-y-8 pb-8">
				{/* Header */}
				<div ref={headerRef} className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-xl">
					<h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
					<p className="text-blue-100 text-lg">
						Welcome back! Here's an overview of your system performance
					</p>
				</div>

				{/* Row 1: KPI Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<AnimatedKPICard
						title="Total Meetings"
						value={data?.stats.totalMeetings || 0}
						icon={Calendar}
						color="blue"
						delay={0.1}
					/>
					<AnimatedKPICard
						title="Upcoming Meetings"
						value={data?.stats.activeMeetings || 0}
						icon={TrendingUp}
						color="green"
						delay={0.2}
					/>
					<AnimatedKPICard
						title="Total Staff"
						value={data?.stats.totalStaff || 0}
						icon={Users}
						color="purple"
						delay={0.3}
					/>
					<AnimatedKPICard
						title="Attendance Rate"
						value={data?.stats.overallAttendance || 0}
						icon={Building2}
						color="orange"
						delay={0.4}
						suffix="%"
					/>
				</div>

				{/* Row 2: Charts */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<MeetingsPerMonthChart data={data?.meetingsPerMonth || []} />
					<AttendanceTrendChart data={data?.attendanceTrend || []} />
				</div>

				{/* Row 3: Recent Activity */}
				<RecentActivityList activities={data?.recentActivity || []} />
			</div>
		</DashboardLayout>
	);
}
