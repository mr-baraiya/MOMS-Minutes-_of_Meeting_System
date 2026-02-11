'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import CalendarFilters from '@/components/calendar/CalendarFilters';
import MeetingDetailDrawer from '@/components/calendar/MeetingDetailDrawer';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ViewMode = 'month' | 'week' | 'day';

interface FilterState {
	search: string;
	meetingTypeId: string;
	departmentId: string;
	status: string;
}

export default function AdminCalendarPage() {
	const router = useRouter();
	const { loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
	const [currentDate, setCurrentDate] = useState(new Date());
	const [viewMode, setViewMode] = useState<ViewMode>('month');
	const [meetings, setMeetings] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
	const [showDrawer, setShowDrawer] = useState(false);
	const [filters, setFilters] = useState<FilterState>({
		search: '',
		meetingTypeId: '',
		departmentId: '',
		status: 'upcoming',
	});

	useEffect(() => {
		if (!authLoading) {
			fetchMeetings();
		}
	}, [authLoading, currentDate, filters]);

	const fetchMeetings = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();
			
			if (filters.search) params.append('search', filters.search);
			if (filters.meetingTypeId) params.append('meetingTypeId', filters.meetingTypeId);
			if (filters.departmentId) params.append('departmentId', filters.departmentId);
			if (filters.status && filters.status !== 'all') params.append('status', filters.status);

			const response = await fetch(`/api/meetings?${params.toString()}`);
			const result = await response.json();

			if (result.success) {
				setMeetings(result.data.data || result.data || []);
			}
		} catch (error) {
			console.error('Failed to fetch meetings:', error);
		} finally {
			setLoading(false);
		}
	};

	const handlePreviousMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
	};

	const handleNextMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
	};

	const handleToday = () => {
		setCurrentDate(new Date());
	};

	const handleNewMeeting = () => {
		router.push('/admin/meetings?create=1');
	};

	const handleMeetingClick = (meeting: any) => {
		setSelectedMeeting(meeting);
		setShowDrawer(true);
	};

	if (authLoading) {
		return (
			<DashboardLayout role="admin">
				<div className="flex items-center justify-center h-full">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
				</div>
			</DashboardLayout>
		);
	}

	const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

	return (
		<DashboardLayout role="admin">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="space-y-6"
			>
				{/* Page Header */}
				<div className="flex items-center justify-between">
					<div>
						<div className="flex items-center gap-3">
							<div className="p-2 bg-indigo-100 rounded-lg">
								<CalendarIcon className="w-6 h-6 text-indigo-600" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
								<p className="text-slate-500 mt-0.5">Visual overview of all scheduled meetings</p>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={handleToday}
							className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
						>
							Today
						</button>
						<div className="flex items-center gap-2">
							<button
								onClick={handlePreviousMonth}
								className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
								aria-label="Previous month"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<div className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg min-w-[180px] text-center">
								{monthName}
							</div>
							<button
								onClick={handleNextMonth}
								className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
								aria-label="Next month"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</div>
						<button
							onClick={handleNewMeeting}
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
						>
							<Plus className="w-4 h-4" />
							New Meeting
						</button>
					</div>
				</div>

				{/* Filters */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
				>
					<CalendarFilters
						filters={filters}
						onFilterChange={setFilters}
						onReset={() => setFilters({ search: '', meetingTypeId: '', departmentId: '', status: 'upcoming' })}
					/>
				</motion.div>

				{/* View Mode Switch */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className="flex items-center justify-end gap-2"
				>
					<div className="inline-flex bg-white border border-slate-200 rounded-lg p-1">
						{(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
							<button
								key={mode}
								onClick={() => setViewMode(mode)}
								className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
									viewMode === mode
										? 'bg-indigo-600 text-white shadow-sm'
										: 'text-slate-600 hover:text-slate-900'
								}`}
							>
								{mode.charAt(0).toUpperCase() + mode.slice(1)}
							</button>
						))}
					</div>
				</motion.div>

				{/* Calendar Grid */}
				<motion.div
					initial={{ opacity: 0, scale: 0.98 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4, delay: 0.3 }}
				>
					<CalendarGrid
						currentDate={currentDate}
						viewMode={viewMode}
						meetings={meetings}
						loading={loading}
						onMeetingClick={handleMeetingClick}
					/>
				</motion.div>
			</motion.div>

			{/* Meeting Detail Drawer */}
			{showDrawer && selectedMeeting && (
				<MeetingDetailDrawer
					meeting={selectedMeeting}
					onClose={() => {
						setShowDrawer(false);
						setSelectedMeeting(null);
					}}
					onRefresh={fetchMeetings}
				/>
			)}
		</DashboardLayout>
	);
}
