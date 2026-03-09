'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import AttendanceHistory from '@/components/dashboard/AttendanceHistory';
import StaffAttendanceChart from '@/components/dashboard/StaffAttendanceChart';
import StaffMeetingTrendChart from '@/components/dashboard/StaffMeetingTrendChart';
import StaffActionItems from '@/components/dashboard/staff/StaffActionItems';
import StaffActivityFeed from '@/components/dashboard/staff/StaffActivityFeed';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { 
	Calendar, 
	Clock, 
	CheckCircle, 
	XCircle, 
	AlertCircle, 
	FileText,
	CalendarDays,
	UserCheck,
	Download,
	Sparkles,
	TrendingUp,
	Award
} from 'lucide-react';

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

// Counter animation hook
function useCounter(end: number, duration = 2000) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (end === 0) {
			setCount(0);
			return;
		}

		const steps = 60;
		const increment = end / steps;
		const stepDuration = duration / steps;

		let currentStep = 0;
		const timer = setInterval(() => {
			currentStep++;
			if (currentStep <= steps) {
				setCount(Math.round(increment * currentStep));
			} else {
				setCount(end);
				clearInterval(timer);
			}
		}, stepDuration);

		return () => clearInterval(timer);
	}, [end, duration]);

	return count;
}

export default function StaffDashboard() {
	const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['staff'] });
	const [data, setData] = useState<StaffDashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const headerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!authLoading) {
			if (user) {
				fetchDashboardData();
			} else {
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
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
						className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
					/>
				</div>
			</DashboardLayout>
		);
	}
	// Generate trend data from stats
	const meetingTrendData = [
		{ month: 'Jan', meetings: Math.max(0, (data?.stats.assignedMeetings || 0) - 5) },
		{ month: 'Feb', meetings: Math.max(0, (data?.stats.assignedMeetings || 0) - 3) },
		{ month: 'Mar', meetings: Math.max(0, (data?.stats.assignedMeetings || 0) - 2) },
		{ month: 'Apr', meetings: Math.max(0, (data?.stats.assignedMeetings || 0) - 1) },
		{ month: 'May', meetings: data?.stats.assignedMeetings || 0 },
		{ month: 'Jun', meetings: data?.stats.upcomingMeetings || 0 },
	];

	const attendanceChartData = {
		attended: data?.stats.attendedMeetings || 0,
		missed: data?.stats.missedMeetings || 0,
		pending: data?.stats.pendingMeetings || 0,
	};

	const total = data?.stats.assignedMeetings || 0;
	const attendanceRate = total > 0 
		? Math.round(((data?.stats.attendedMeetings || 0) / total) * 100) 
		: 0;

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
		},
	};

	return (
		<DashboardLayout role="staff">
			<div className="space-y-8 pb-8">
				{/* Header */}
			<div ref={headerRef} className="bg-blue-700 border-2 border-blue-800 p-8 relative">
				<div className="relative">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-wide">Staff Dashboard</h1>
						<p className="text-blue-100 text-lg">
							Welcome back, {user?.staff?.name || user?.username}! Track your meetings and performance.
						</p>
					</motion.div>
					{attendanceRate >= 80 && (
						<motion.div
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
							className="absolute top-4 right-4 bg-blue-800 border-2 border-blue-900 px-4 py-2 flex items-center gap-2"
						>
							<Award className="h-5 w-5 text-yellow-300" />
							<span className="text-white font-semibold uppercase tracking-wide">Great Attendance!</span>
						</motion.div>
					)}
				</div>
			</div>

				{/* Key Stats Cards */}
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
				>
					<StatCard
						label="Assigned Meetings"
						value={data?.stats.assignedMeetings || 0}
						icon={Calendar}
						delay={0.1}
					/>
					<StatCard
						label="Upcoming Meetings"
						value={data?.stats.upcomingMeetings || 0}
						icon={Clock}
						delay={0.2}
					/>
					<StatCard
						label="Attendance Rate"
						value={attendanceRate}
						icon={TrendingUp}
						delay={0.3}
						suffix="%"
					/>
					<StatCard
						label="Documents Available"
						value={data?.stats.documentsAvailable || 0}
						icon={FileText}
						delay={0.4}
					/>
				</motion.div>

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<StaffAttendanceChart data={attendanceChartData} />
					<StaffMeetingTrendChart data={meetingTrendData} />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<StaffActionItems />
					<StaffActivityFeed />
				</div>

				{/* Meetings Overview */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<motion.div 
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.6 }}
						className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
					>
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold text-gray-900">Upcoming Meetings</h2>
							<span className="text-sm text-gray-500">{data?.upcomingMeetings?.length || 0} total</span>
						</div>
						<UpcomingMeetings meetings={data?.upcomingMeetings || []} />
					</motion.div>

					<motion.div 
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.7 }}
						className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
					>
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold text-gray-900">Attendance History</h2>
							<span className="text-sm text-gray-500">Last 5 meetings</span>
						</div>
						<AttendanceHistory history={data?.attendanceHistory || []} />
					</motion.div>
				</div>

				{/* Quick Actions */}
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className="border-2 border-gray-300 bg-white p-6"
				>
					<h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<ActionButton
							icon={CalendarDays}
							label="My Calendar"
							description="View all your meetings"
							delay={0.9}
							href="/staff/meetings"
						/>
						<ActionButton
							icon={Download}
							label="Get Documents"
							description="Download meeting files"
							delay={1.0}
							href="/staff/documents"
						/>
						<ActionButton
							icon={UserCheck}
							label="Update Profile"
							description="Keep your info current"
							delay={1.1}
							href="/staff/profile"
						/>
					</div>
				</motion.div>
			</div>
		</DashboardLayout>
	);
}

// Helper Components
interface StatCardProps {
	label: string;
	value: number;
	icon: React.ComponentType<{ className?: string }>;
	delay: number;
	suffix?: string;
}

function StatCard({ label, value, icon: Icon, delay, suffix = '' }: StatCardProps) {
	const count = useCounter(value);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay, ease: 'easeOut' }}
			whileHover={{ scale: 1.02, y: -2 }}
			className={`border-2 border-gray-300 bg-white p-6 hover:bg-blue-50 transition-colors`}
		>
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<p className="text-xs uppercase tracking-wider text-gray-500 font-medium">{label}</p>
					<motion.p
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ delay: delay + 0.2, duration: 0.3 }}
						className={`text-4xl font-bold text-blue-700 mt-2`}
					>
						{count}{suffix}
					</motion.p>
				</div>
				<motion.div
					initial={{ scale: 0, rotate: -180 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
					className={`bg-blue-700 border-2 border-blue-800 p-3`}
				>
					<Icon className="h-6 w-6 text-white" />
				</motion.div>
			</div>
			<div className="mt-4 h-2 w-full bg-gray-200 overflow-hidden">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${Math.min(value * 10, 100)}%` }}
					transition={{ delay: delay + 0.4, duration: 0.8, ease: 'easeOut' }}
					className={`h-2 bg-blue-700`}
				/>
			</div>
		</motion.div>
	);
}

interface ActionButtonProps {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	description: string;
	delay: number;
	href: string;
}

function ActionButton({ icon: Icon, label, description, delay, href }: ActionButtonProps) {
	return (
		<Link href={href}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay }}
				whileHover={{ scale: 1.02, y: -2 }}
				whileTap={{ scale: 0.98 }}
				className={`border-2 border-gray-300 bg-white hover:bg-blue-50 p-6 text-left transition-colors cursor-pointer`}
			>
				<Icon className={`h-8 w-8 text-blue-700 mb-3`} />
				<p className="font-bold text-gray-900 text-lg mb-1 uppercase tracking-wide">{label}</p>
				<p className="text-sm text-gray-600">{description}</p>
			</motion.div>
		</Link>
	);
}
