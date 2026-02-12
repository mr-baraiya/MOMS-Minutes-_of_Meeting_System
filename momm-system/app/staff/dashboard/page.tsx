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
	const [showWelcome, setShowWelcome] = useState(false);

	useEffect(() => {
		// Check if this is user's first visit
		const hasVisited = localStorage.getItem('staffDashboardVisited');
		if (!hasVisited) {
			setShowWelcome(true);
			localStorage.setItem('staffDashboardVisited', 'true');
		}
	}, []);

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
						className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600"
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
				{/* Welcome Message for First-Time Users */}
				{showWelcome && (
					<motion.div
						initial={{ opacity: 0, y: -20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ duration: 0.5 }}
						className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 relative overflow-hidden"
					>
						<div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
						<div className="relative flex items-start gap-4">
							<div className="p-3 bg-blue-600 rounded-xl">
								<Sparkles className="h-6 w-6 text-white" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-bold text-gray-900 mb-1">
									Welcome to Your Dashboard! 🎉
								</h3>
								<p className="text-sm text-gray-600 mb-3">
									This is your central hub for managing meetings, tracking attendance, and accessing important documents. 
									Get started by exploring your upcoming meetings and attendance history below.
								</p>
								<button
									onClick={() => setShowWelcome(false)}
									className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
								>
									Got it, thanks! →
								</button>
							</div>
						</div>
					</motion.div>
				)}

				{/* Header */}
				<div ref={headerRef} className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-xl relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-10"></div>
					<div className="relative">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<h1 className="text-4xl font-bold text-white mb-2">Staff Dashboard</h1>
							<p className="text-blue-100 text-lg">
								Welcome back, {user?.staff?.name || user?.username}! Track your meetings and performance.
							</p>
						</motion.div>
						{attendanceRate >= 80 && (
							<motion.div
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
								className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2"
							>
								<Award className="h-5 w-5 text-yellow-300" />
								<span className="text-white font-semibold">Great Attendance!</span>
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
						color="from-blue-50 to-blue-100"
						iconColor="bg-blue-500"
						textColor="text-blue-600"
						borderColor="border-blue-200"
						delay={0.1}
					/>
					<StatCard
						label="Upcoming Meetings"
						value={data?.stats.upcomingMeetings || 0}
						icon={Clock}
						color="from-emerald-50 to-emerald-100"
						iconColor="bg-emerald-500"
						textColor="text-emerald-600"
						borderColor="border-emerald-200"
						delay={0.2}
					/>
					<StatCard
						label="Attendance Rate"
						value={attendanceRate}
						icon={TrendingUp}
						color="from-indigo-50 to-indigo-100"
						iconColor="bg-indigo-500"
						textColor="text-indigo-600"
						borderColor="border-indigo-200"
						delay={0.3}
						suffix="%"
					/>
					<StatCard
						label="Documents Available"
						value={data?.stats.documentsAvailable || 0}
						icon={FileText}
						color="from-purple-50 to-purple-100"
						iconColor="bg-purple-500"
						textColor="text-purple-600"
						borderColor="border-purple-200"
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
					className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
				>
					<h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<ActionButton
							icon={CalendarDays}
							label="My Calendar"
							description="View all your meetings"
							color="blue"
							delay={0.9}
							href="/staff/meetings"
						/>
						<ActionButton
							icon={Download}
							label="Get Documents"
							description="Download meeting files"
							color="emerald"
							delay={1.0}
							href="/staff/documents"
						/>
						<ActionButton
							icon={UserCheck}
							label="Update Profile"
							description="Keep your info current"
							color="purple"
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
	color: string;
	iconColor: string;
	textColor: string;
	borderColor: string;
	delay: number;
	suffix?: string;
}

function StatCard({ label, value, icon: Icon, color, iconColor, textColor, borderColor, delay, suffix = '' }: StatCardProps) {
	const count = useCounter(value);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay, ease: 'easeOut' }}
			whileHover={{ scale: 1.05, y: -4 }}
			className={`rounded-2xl border ${borderColor} bg-gradient-to-br ${color} p-6 shadow-sm hover:shadow-lg transition-shadow`}
		>
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<p className="text-xs uppercase tracking-wider text-gray-500 font-medium">{label}</p>
					<motion.p
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ delay: delay + 0.2, duration: 0.3 }}
						className={`text-4xl font-bold ${textColor} mt-2`}
					>
						{count}{suffix}
					</motion.p>
				</div>
				<motion.div
					initial={{ scale: 0, rotate: -180 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
					className={`${iconColor} rounded-xl p-3 shadow-md`}
				>
					<Icon className="h-6 w-6 text-white" />
				</motion.div>
			</div>
			<div className="mt-4 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${Math.min(value * 10, 100)}%` }}
					transition={{ delay: delay + 0.4, duration: 0.8, ease: 'easeOut' }}
					className={`h-2 rounded-full ${iconColor}`}
				/>
			</div>
		</motion.div>
	);
}

interface ActionButtonProps {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	description: string;
	color: 'blue' | 'emerald' | 'purple';
	delay: number;
	href: string;
}

function ActionButton({ icon: Icon, label, description, color, delay, href }: ActionButtonProps) {
	const colorClasses = {
		blue: {
			bg: 'bg-blue-50 hover:bg-blue-100',
			icon: 'text-blue-600',
			border: 'border-blue-200 hover:border-blue-400',
		},
		emerald: {
			bg: 'bg-emerald-50 hover:bg-emerald-100',
			icon: 'text-emerald-600',
			border: 'border-emerald-200 hover:border-emerald-400',
		},
		purple: {
			bg: 'bg-purple-50 hover:bg-purple-100',
			icon: 'text-purple-600',
			border: 'border-purple-200 hover:border-purple-400',
		},
	};

	const classes = colorClasses[color];

	return (
		<Link href={href}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay }}
				whileHover={{ scale: 1.05, y: -4 }}
				whileTap={{ scale: 0.98 }}
				className={`rounded-xl border ${classes.border} ${classes.bg} p-6 text-left transition-all shadow-sm hover:shadow-md cursor-pointer`}
			>
				<Icon className={`h-8 w-8 ${classes.icon} mb-3`} />
				<p className="font-bold text-gray-900 text-lg mb-1">{label}</p>
				<p className="text-sm text-gray-600">{description}</p>
			</motion.div>
		</Link>
	);
}
