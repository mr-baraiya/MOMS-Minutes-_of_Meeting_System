'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import {
	Search,
	Plus,
	Calendar as CalendarIcon,
	Table as TableIcon,
	Grid3x3,
	Filter,
	RotateCcw,
	Download,
} from 'lucide-react';
import MeetingsTableView from '@/components/meetings/MeetingsTableView';
import MeetingsCardView from '@/components/meetings/MeetingsCardView';
import MeetingsCalendarView from '@/components/meetings/MeetingsCalendarView';
import MeetingDetailDrawer from '@/components/meetings/MeetingDetailDrawer';
import NewMeetingModal from '@/components/meetings/NewMeetingModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { MeetingWithCount } from '@/types/models';

type ViewMode = 'table' | 'card' | 'calendar';
type MeetingStatus = 'all' | 'upcoming' | 'completed' | 'cancelled';

interface FilterState {
	search: string;
	dateFrom: string;
	dateTo: string;
	status: MeetingStatus;
	meetingTypeId: string;
	departmentId: string;
}

export default function AdminMeetingsPage() {
	const searchParams = useSearchParams();
	const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
	const [viewMode, setViewMode] = useState<ViewMode>('table');
	const [meetings, setMeetings] = useState<MeetingWithCount[]>([]);
	const [loading, setLoading] = useState(true);
	const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
	const [showEditMeetingModal, setShowEditMeetingModal] = useState(false);
	const [selectedMeeting, setSelectedMeeting] = useState<MeetingWithCount | null>(null);
	const [showDetailDrawer, setShowDetailDrawer] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [meetingToCancel, setMeetingToCancel] = useState<MeetingWithCount | null>(null);
	
	// Filters
	const [filters, setFilters] = useState<FilterState>({
		search: '',
		dateFrom: '',
		dateTo: '',
		status: 'all',
		meetingTypeId: '',
		departmentId: '',
	});

	// Dropdown data
	const [meetingTypes, setMeetingTypes] = useState<any[]>([]);
	const [departments, setDepartments] = useState<any[]>([]);

	useEffect(() => {
		if (!authLoading && user) {
			fetchMeetings();
			fetchMeetingTypes();
			fetchDepartments();
		}
	}, [authLoading, user, filters]);

	useEffect(() => {
		if (!authLoading && user) {
			const create = searchParams.get('create');
			if (create === '1') {
				setShowNewMeetingModal(true);
			}
		}
	}, [authLoading, user, searchParams]);

	const fetchMeetings = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();
			if (filters.search) params.append('search', filters.search);
			if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
			if (filters.dateTo) params.append('dateTo', filters.dateTo);
			if (filters.status !== 'all') params.append('status', filters.status);
			if (filters.meetingTypeId) params.append('meetingTypeId', filters.meetingTypeId);
			if (filters.departmentId) params.append('departmentId', filters.departmentId);

			const response = await fetch(`/api/meetings?${params.toString()}`);
			const result = await response.json();
			
			if (result.success) {
				setMeetings(result.data.data || result.data);
			}
		} catch (error) {
			console.error('Failed to fetch meetings:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchMeetingTypes = async () => {
		try {
			const response = await fetch('/api/meeting-types');
			const result = await response.json();
			if (result.success) {
				setMeetingTypes(result.data.data || result.data);
			}
		} catch (error) {
			console.error('Failed to fetch meeting types:', error);
		}
	};

	const fetchDepartments = async () => {
		try {
			const response = await fetch('/api/departments');
			const result = await response.json();
			if (result.success) {
				setDepartments(result.data.data || result.data);
			}
		} catch (error) {
			console.error('Failed to fetch departments:', error);
		}
	};

	const handleResetFilters = () => {
		setFilters({
			search: '',
			dateFrom: '',
			dateTo: '',
			status: 'all',
			meetingTypeId: '',
			departmentId: '',
		});
	};

	const handleViewMeeting = (meeting: MeetingWithCount) => {
		setSelectedMeeting(meeting);
		setShowDetailDrawer(true);
	};

	const handleEditMeeting = (meeting: MeetingWithCount) => {
		setSelectedMeeting(meeting);
		setShowEditMeetingModal(true);
	};

	const handleViewAttendance = (meeting: MeetingWithCount) => {
		// TODO: Implement attendance modal
		console.log('View attendance:', meeting.id);
	};

	const handleViewDocuments = (meeting: MeetingWithCount) => {
		// TODO: Implement documents modal  
		console.log('View documents:', meeting.id);
	};

	const handleCancelMeeting = (meeting: MeetingWithCount) => {
		setMeetingToCancel(meeting);
		setShowConfirmModal(true);
	};

	const confirmCancelMeeting = async () => {
		if (!meetingToCancel) return;

		try {
			const response = await fetch(`/api/meetings/${meetingToCancel.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isCancelled: true }),
			});

			if (response.ok) {
				fetchMeetings(); // Refresh the list
				setShowConfirmModal(false);
				setMeetingToCancel(null);
			} else {
				alert('Failed to cancel meeting');
			}
		} catch (error) {
			console.error('Error cancelling meeting:', error);
			alert('Error cancelling meeting');
		}
	};

	const handleExportCSV = () => {
		if (!meetings.length) {
			alert('No meetings to export');
			return;
		}

		const formatDate = (value: Date | string) =>
			new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
		const formatTime = (value: Date | string) =>
			new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
		const statusLabel = (meetingDate: Date | string, isCancelled: boolean) => {
			if (isCancelled) return 'Cancelled';
			const date = new Date(meetingDate);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			date.setHours(0, 0, 0, 0);
			return date < today ? 'Completed' : 'Upcoming';
		};
		const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

		const headers = [
			'ID',
			'Title',
			'Date',
			'Start Time',
			'End Time',
			'Type',
			'Organizer',
			'Venue',
			'Status',
			'Participants',
			'Cancelled',
			'Cancellation Reason',
		];

		const rows = meetings.map((m) => [
			m.id,
			m.meetingTitle,
			formatDate(m.meetingDate),
			formatTime(m.meetingStartTime),
			formatTime(m.meetingEndTime),
			m.meetingType?.meetingTypeName || 'N/A',
			m.organizer?.staffName || 'N/A',
			m.venue?.venueName || 'N/A',
			statusLabel(m.meetingDate, m.isCancelled),
			m._count?.meetingMembers ?? 0,
			m.isCancelled ? 'Yes' : 'No',
			m.cancellationReason || '',
		]);

		const csv = [headers, ...rows]
			.map((row) => row.map(escape).join(','))
			.join('\n');

		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `meetings_${Date.now()}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	if (authLoading || loading && meetings.length === 0) {
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
			<div className="space-y-6 p-6">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
				>
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
						<p className="text-gray-600 mt-1">Manage and monitor all scheduled meetings</p>
					</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setShowNewMeetingModal(true)}
						className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
					>
						<Plus size={20} />
						New Meeting
					</motion.button>
				</motion.div>

				{/* Filter Section */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
				>
					<div className="flex items-center gap-2 mb-4">
						<Filter size={20} className="text-gray-600" />
						<h2 className="text-lg font-semibold text-gray-900">Filters</h2>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
						{/* Search */}
						<div className="xl:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Search
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
								<input
									type="text"
									value={filters.search}
									onChange={(e) => setFilters({ ...filters, search: e.target.value })}
									placeholder="Search meetings..."
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Date From */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Date From
							</label>
							<input
								type="date"
								value={filters.dateFrom}
								onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						{/* Date To */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Date To
							</label>
							<input
								type="date"
								value={filters.dateTo}
								onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						{/* Status */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Status
							</label>
							<select
								value={filters.status}
								onChange={(e) => setFilters({ ...filters, status: e.target.value as MeetingStatus })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="all">All Status</option>
								<option value="upcoming">Upcoming</option>
								<option value="completed">Completed</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>

						{/* Meeting Type */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Meeting Type
							</label>
							<select
								value={filters.meetingTypeId}
								onChange={(e) => setFilters({ ...filters, meetingTypeId: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">All Types</option>
								{meetingTypes.map((type) => (
									<option key={type.id} value={type.id}>
										{type.meetingTypeName}
									</option>
								))}
							</select>
						</div>

						{/* Department */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Department
							</label>
							<select
								value={filters.departmentId}
								onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">All Departments</option>
								{departments.map((dept) => (
									<option key={dept.id} value={dept.id}>
										{dept.departmentName}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Filter Actions */}
					<div className="flex gap-3 mt-4">
						<button
							onClick={handleResetFilters}
							className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
						>
							<RotateCcw size={16} />
							Reset Filters
						</button>
						<button
							onClick={handleExportCSV}
							className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
						>
							<Download size={16} />
							Export CSV
						</button>
					</div>
				</motion.div>

				{/* View Toggle */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="flex justify-between items-center"
				>
					<p className="text-sm text-gray-600">
						Showing {meetings.length} meeting{meetings.length !== 1 ? 's' : ''}
					</p>
					<div className="flex gap-2">
						<button
							onClick={() => setViewMode('table')}
							className={`p-2 rounded-lg transition-colors ${
								viewMode === 'table'
									? 'bg-blue-600 text-white'
									: 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
							}`}
							title="Table View"
						>
							<TableIcon size={20} />
						</button>
						<button
							onClick={() => setViewMode('card')}
							className={`p-2 rounded-lg transition-colors ${
								viewMode === 'card'
									? 'bg-blue-600 text-white'
									: 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
							}`}
							title="Card View"
						>
							<Grid3x3 size={20} />
						</button>
						<button
							onClick={() => setViewMode('calendar')}
							className={`p-2 rounded-lg transition-colors ${
								viewMode === 'calendar'
									? 'bg-blue-600 text-white'
									: 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
							}`}
							title="Calendar View"
						>
							<CalendarIcon size={20} />
						</button>
					</div>
				</motion.div>

				{/* Main Content Area */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					{viewMode === 'table' && (
						<MeetingsTableView
							meetings={meetings}
							loading={loading}
							onViewMeeting={handleViewMeeting}
							onEditMeeting={handleEditMeeting}
							onViewAttendance={handleViewAttendance}
							onViewDocuments={handleViewDocuments}
							onCancelMeeting={handleCancelMeeting}
							onRefresh={fetchMeetings}
						/>
					)}
					{viewMode === 'card' && (
						<MeetingsCardView
							meetings={meetings}
							loading={loading}
							onViewMeeting={handleViewMeeting}
							onEditMeeting={handleEditMeeting}
						/>
					)}
					{viewMode === 'calendar' && (
						<MeetingsCalendarView
							meetings={meetings}
							onViewMeeting={handleViewMeeting}
						/>
					)}
				</motion.div>
			</div>

			{/* Meeting Detail Drawer */}
			{showDetailDrawer && selectedMeeting && (
				<MeetingDetailDrawer
					meeting={selectedMeeting}
					onClose={() => setShowDetailDrawer(false)}
					onRefresh={fetchMeetings}
				/>
			)}

			{/* New Meeting Modal */}
			{showNewMeetingModal && (
				<NewMeetingModal
					onClose={() => setShowNewMeetingModal(false)}
					onSuccess={fetchMeetings}
				/>
			)}

			{/* Edit Meeting Modal */}
			{showEditMeetingModal && selectedMeeting && (
				<NewMeetingModal
					onClose={() => {
						setShowEditMeetingModal(false);
						setSelectedMeeting(null);
					}}
					onSuccess={fetchMeetings}
					editMeeting={selectedMeeting}
				/>
			)}

			{/* Cancel Meeting Confirmation Modal */}
			{showConfirmModal && meetingToCancel && (
				<ConfirmModal
					isOpen={showConfirmModal}
					onClose={() => {
						setShowConfirmModal(false);
						setMeetingToCancel(null);
					}}
					onConfirm={confirmCancelMeeting}
					title="Cancel Meeting"
					message={`Are you sure you want to cancel "${meetingToCancel.meetingTitle}"? This action cannot be undone.`}
					confirmText="Yes, Cancel Meeting"
					cancelText="Keep Meeting"
					type="danger"
				/>
			)}
		</DashboardLayout>
	);
}
