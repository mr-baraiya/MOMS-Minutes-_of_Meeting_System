'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import AttendanceHistory from '@/components/dashboard/AttendanceHistory';
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
	Download
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

	useEffect(() => {
		if (!authLoading) {
			if (user) {
				fetchDashboardData();
			} else {
				setLoading(false);
			}
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
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
						className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-600"
					/>
				</div>
			</DashboardLayout>
		);
	}

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

	const statsData = [
		{ 
			label: 'Assigned Meetings', 
			value: data?.stats.assignedMeetings || 0, 
			icon: Calendar,
			color: 'from-slate-50 to-slate-100',
			iconColor: 'bg-slate-500',
			textColor: 'text-slate-600',
			borderColor: 'border-slate-200'
		},
		{ 
			label: 'Upcoming Meetings', 
			value: data?.stats.upcomingMeetings || 0, 
			icon: Clock,
			color: 'from-emerald-50 to-emerald-100',
			iconColor: 'bg-emerald-500',
			textColor: 'text-emerald-600',
			borderColor: 'border-emerald-200'
		},
		{ 
			label: 'Attended Meetings', 
			value: data?.stats.attendedMeetings || 0, 
			icon: CheckCircle,
			color: 'from-indigo-50 to-indigo-100',
			iconColor: 'bg-indigo-500',
			textColor: 'text-indigo-600',
			borderColor: 'border-indigo-200'
		},
		{ 
			label: 'Missed Meetings', 
			value: data?.stats.missedMeetings || 0, 
			icon: XCircle,
			color: 'from-rose-50 to-rose-100',
			iconColor: 'bg-rose-500',
			textColor: 'text-rose-600',
			borderColor: 'border-rose-200'
		},
		{ 
			label: 'Pending Attendance', 
			value: data?.stats.pendingMeetings || 0, 
			icon: AlertCircle,
			color: 'from-amber-50 to-amber-100',
			iconColor: 'bg-amber-500',
			textColor: 'text-amber-600',
			borderColor: 'border-amber-200'
		},
		{ 
			label: 'Documents Available', 
			value: data?.stats.documentsAvailable || 0, 
			icon: FileText,
			color: 'from-sky-50 to-sky-100',
			iconColor: 'bg-sky-500',
			textColor: 'text-sky-600',
			borderColor: 'border-sky-200'
		},
	];

	return (
		<DashboardLayout role="staff">
			<motion.div 
				className="space-y-8"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* Header */}
				<motion.div
					variants={itemVariants}
					className="rounded-2xl border border-slate-300 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-lg"
				>
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div>
							<motion.p 
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2 }}
								className="text-xs uppercase tracking-[0.2em] text-slate-300"
							>
								Staff Overview
							</motion.p>
							<motion.h1 
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 }}
								className="text-3xl font-semibold"
							>
								Staff Dashboard
							</motion.h1>
							<motion.p 
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4 }}
								className="text-slate-300 mt-2"
							>
								Track assignments, attendance, and meeting documents.
							</motion.p>
						</div>
						<motion.div 
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
							className="flex items-center gap-3"
						>
							<div className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-wide">
								Role: Staff
							</div>
							<div className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-wide">
								Status: Active
							</div>
						</motion.div>
					</div>
				</motion.div>

				{/* Stats Grid */}
				<motion.div 
					variants={itemVariants}
					className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
				>
					{statsData.map((stat, index) => {
						const Icon = stat.icon;
						return (
							<StatCard
								key={stat.label}
								label={stat.label}
								value={stat.value}
								icon={Icon}
								color={stat.color}
								iconColor={stat.iconColor}
								textColor={stat.textColor}
								borderColor={stat.borderColor}
								delay={index * 0.1}
							/>
						);
					})}
				</motion.div>

				{/* Alerts */}
				{data?.stats.upcomingMeetings && data.stats.upcomingMeetings > 0 && (
					<motion.div 
						variants={itemVariants}
						className="rounded-2xl border border-slate-300 bg-slate-50 p-5 shadow-sm"
					>
						<p className="text-sm text-slate-700">
							You have <strong className="text-slate-900">{data.stats.upcomingMeetings}</strong> upcoming meeting(s) scheduled.
						</p>
					</motion.div>
				)}

				{/* Content Grid */}
				<motion.div 
					variants={itemVariants}
					className="grid grid-cols-1 lg:grid-cols-2 gap-6"
				>
					{/* Upcoming Meetings */}
					<motion.div 
						whileHover={{ scale: 1.02 }}
						transition={{ duration: 0.2 }}
						className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
					>
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-slate-900">Upcoming Meetings</h2>
							<button className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
								View all
							</button>
						</div>
						<UpcomingMeetings meetings={data?.upcomingMeetings || []} />
					</motion.div>

					{/* Attendance History */}
					<motion.div 
						whileHover={{ scale: 1.02 }}
						transition={{ duration: 0.2 }}
						className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
					>
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold text-slate-900">Attendance History</h2>
							<button className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
								View all
							</button>
						</div>
						<AttendanceHistory history={data?.attendanceHistory || []} />
					</motion.div>
				</motion.div>

				{/* Recent Meeting Documents */}
				<motion.div 
					variants={itemVariants}
					className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
				>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold text-slate-900">Recent Meeting Documents</h2>
						<button className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
							View all
						</button>
					</div>
					<div className="space-y-3">
						{data?.recentMeetings && data.recentMeetings.length > 0 ? (
							data.recentMeetings.map((meeting: any, index: number) => (
								<motion.div 
									key={index}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									whileHover={{ scale: 1.02, x: 4 }}
									className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors"
								>
									<div>
										<p className="font-medium text-slate-900">{meeting.title}</p>
										<p className="text-sm text-slate-500">{meeting.date} • {meeting.type}</p>
									</div>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-colors"
									>
										Download
									</motion.button>
								</motion.div>
							))
						) : (
							<p className="text-slate-500 text-center py-4">No documents available</p>
						)}
					</div>
				</motion.div>

				{/* Quick Actions */}
				<motion.div 
					variants={itemVariants}
					className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
				>
					<h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{[
							{ icon: CalendarDays, label: 'View Calendar', color: 'slate' },
							{ icon: UserCheck, label: 'My Attendance', color: 'slate' },
							{ icon: Download, label: 'Download MOMs', color: 'slate' },
						].map((action, index) => {
							const ActionIcon = action.icon;
							return (
								<motion.button
									key={action.label}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 + index * 0.1 }}
									whileHover={{ scale: 1.05, y: -4 }}
									whileTap={{ scale: 0.98 }}
									className="rounded-xl border border-slate-200 px-4 py-5 text-left transition-all hover:border-slate-900 hover:shadow-md"
								>
									<ActionIcon className="h-5 w-5 text-slate-500 mb-2" />
									<p className="text-xs uppercase tracking-[0.2em] text-slate-400">Action</p>
									<p className="mt-2 font-semibold text-slate-900">{action.label}</p>
								</motion.button>
							);
						})}
					</div>
				</motion.div>
			</motion.div>
		</DashboardLayout>
	);
}

// StatCard component with animations
interface StatCardProps {
	label: string;
	value: number;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	iconColor: string;
	textColor: string;
	borderColor: string;
	delay: number;
}

function StatCard({ label, value, icon: Icon, color, iconColor, textColor, borderColor, delay }: StatCardProps) {
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
				<p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
				<motion.div
					initial={{ scale: 0, rotate: -180 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
					className={`${iconColor} rounded-lg p-2`}
				>
					<Icon className="h-5 w-5 text-white" />
				</motion.div>
			</div>
			<motion.p
				initial={{ scale: 0.8 }}
				animate={{ scale: 1 }}
				transition={{ delay: delay + 0.3, duration: 0.3 }}
				className={`text-4xl font-bold ${textColor}`}
			>
				{count}
			</motion.p>
			<div className="mt-4 h-1 w-full rounded-full bg-slate-200 overflow-hidden">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${Math.min(value * 10, 100)}%` }}
					transition={{ delay: delay + 0.4, duration: 0.8, ease: 'easeOut' }}
					className={`h-1 rounded-full ${iconColor}`}
				/>
			</div>
		</motion.div>
	);
}
