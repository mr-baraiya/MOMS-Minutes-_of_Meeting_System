'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import RecentMeetings from '@/components/dashboard/RecentMeetings';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import ConvenerMeetingStatsChart from '@/components/dashboard/ConvenerMeetingStatsChart';
import ConvenerParticipantEngagementChart from '@/components/dashboard/ConvenerParticipantEngagementChart';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { 
	Calendar, 
	Clock, 
	CheckCircle, 
	FileText, 
	Users, 
	TrendingUp,
	Plus,
	Upload,
	UserCheck,
	FileBarChart,
	Target,
	Sparkles,
	Award,
	AlertCircle
} from 'lucide-react';

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

export default function ConvenerDashboard() {
	const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['convener'] });
	const [data, setData] = useState<ConvenerDashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [showWelcome, setShowWelcome] = useState(false);
	const headerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Check if this is user's first visit
		const hasVisited = localStorage.getItem('convenerDashboardVisited');
		if (!hasVisited) {
			setShowWelcome(true);
			localStorage.setItem('convenerDashboardVisited', 'true');
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
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
						className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600"
					/>
				</div>
			</DashboardLayout>
		);
	}

	// Generate chart data
	const meetingStatsData = {
		completed: data?.stats.completedMeetings || 0,
		upcoming: data?.stats.upcomingMeetings || 0,
		cancelled: 0, // Can be added to API later
	};

	const participantEngagementData = {
		totalParticipants: data?.stats.totalParticipants || 0,
		activeParticipants: Math.floor((data?.stats.totalParticipants || 0) * 0.85),
		averageAttendance: 85,
	};

	const completionRate = (data?.stats.myMeetings || 0) > 0
		? Math.round(((data?.stats.completedMeetings || 0) / (data?.stats.myMeetings || 1)) * 100)
		: 0;

	return (
		<DashboardLayout role="convener">
			<div className="space-y-8 pb-8">
				{/* Welcome Message for First-Time Users */}
				{showWelcome && (
					<motion.div
						initial={{ opacity: 0, y: -20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ duration: 0.5 }}
						className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 relative overflow-hidden"
					>
						<div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full filter blur-3xl opacity-30"></div>
						<div className="relative flex items-start gap-4">
							<div className="p-3 bg-emerald-600 rounded-xl">
								<Sparkles className="h-6 w-6 text-white" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-bold text-gray-900 mb-1">
									Welcome to Your Convener Dashboard! 🎉
								</h3>
								<p className="text-sm text-gray-600 mb-3">
									As a convener, you can create meetings, manage participants, upload minutes, and track engagement. 
									Get started by exploring your meeting statistics and taking quick actions below.
								</p>
								<button
									onClick={() => setShowWelcome(false)}
									className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
								>
									Got it, thanks! →
								</button>
							</div>
						</div>
					</motion.div>
				)}

				{/* Header */}
				<div ref={headerRef} className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 shadow-xl relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-10"></div>
					<div className="relative">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<h1 className="text-4xl font-bold text-white mb-2">Convener Dashboard</h1>
							<p className="text-emerald-100 text-lg">
								Manage your meetings, track participation, and drive engagement.
							</p>
						</motion.div>
						{completionRate >= 70 && (
							<motion.div
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
								className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2"
							>
								<Target className="h-5 w-5 text-yellow-300" />
								<span className="text-white font-semibold">High Completion Rate!</span>
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
						label="Total Meetings"
						value={data?.stats.myMeetings || 0}
						icon={Calendar}
						color="from-emerald-50 to-emerald-100"
						iconColor="bg-emerald-500"
						textColor="text-emerald-600"
						borderColor="border-emerald-200"
						delay={0.1}
					/>
					<StatCard
						label="Upcoming"
						value={data?.stats.upcomingMeetings || 0}
						icon={Clock}
						color="from-sky-50 to-sky-100"
						iconColor="bg-sky-500"
						textColor="text-sky-600"
						borderColor="border-sky-200"
						delay={0.2}
					/>
					<StatCard
						label="Participants"
						value={data?.stats.totalParticipants || 0}
						icon={Users}
						color="from-purple-50 to-purple-100"
						iconColor="bg-purple-500"
						textColor="text-purple-600"
						borderColor="border-purple-200"
						delay={0.3}
					/>
					<StatCard
						label="Completion Rate"
						value={completionRate}
						icon={TrendingUp}
						color="from-amber-50 to-amber-100"
						iconColor="bg-amber-500"
						textColor="text-amber-600"
						borderColor="border-amber-200"
						delay={0.4}
						suffix="%"
					/>
				</motion.div>

				{/* Charts Row */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<ConvenerMeetingStatsChart data={meetingStatsData} />
					<ConvenerParticipantEngagementChart data={participantEngagementData} />
				</div>

				{/* Pending Documents Alert */}
				{/* {data?.stats.pendingDocuments && data.stats.pendingDocuments > 0 && (
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-sm"
					>
						<div className="flex items-center gap-3">
							<div className="p-3 bg-amber-100 rounded-lg">
								<AlertCircle className="h-6 w-6 text-amber-600" />
							</div>
							<div className="flex-1">
								<p className="font-semibold text-amber-900">
									{data.stats.pendingDocuments} meeting{data.stats.pendingDocuments > 1 ? 's' : ''} awaiting document upload
								</p>
								<p className="text-sm text-amber-700 mt-1">
									Upload minutes of meeting to keep records complete
								</p>
							</div>
							<Link href="/convener/documents">
								<button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
									Upload Now
								</button>
							</Link>
						</div>
					</motion.div>
				)} */}

				{/* Quick Actions */}
				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
				>
					<h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<ActionButton
							icon={Plus}
							label="Create Meeting"
							description="Schedule a new meeting"
							color="emerald"
							delay={0.9}
							href="/convener/meetings"
						/>
						<ActionButton
							icon={Upload}
							label="Upload MOM"
							description="Upload meeting minutes"
							color="blue"
							delay={1.0}
							href="/convener/documents"
						/>
						<ActionButton
							icon={UserCheck}
							label="Mark Attendance"
							description="Record participant attendance"
							color="purple"
							delay={1.1}
							href="/convener/meetings"
						/>
						<ActionButton
							icon={FileBarChart}
							label="View Reports"
							description="Generate meeting reports"
							color="amber"
							delay={1.2}
							href="/convener/reports"
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
	color: 'blue' | 'emerald' | 'purple' | 'amber';
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
		amber: {
			bg: 'bg-amber-50 hover:bg-amber-100',
			icon: 'text-amber-600',
			border: 'border-amber-200 hover:border-amber-400',
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
