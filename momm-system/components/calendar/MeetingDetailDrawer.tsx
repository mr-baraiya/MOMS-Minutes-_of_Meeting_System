'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	X,
	Calendar,
	Clock,
	MapPin,
	User,
	Users,
	FileText,
	Edit,
	Ban,
	Trash2,
	CheckCircle,
	XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface MeetingDetailDrawerProps {
	meeting: any;
	onClose: () => void;
	onRefresh: () => void;
}

export default function MeetingDetailDrawer({ meeting, onClose, onRefresh }: MeetingDetailDrawerProps) {
	const router = useRouter();
	const [detailedMeeting, setDetailedMeeting] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchMeetingDetails();
	}, [meeting.id]);

	const fetchMeetingDetails = async () => {
		try {
			const response = await fetch(`/api/meetings/${meeting.id}`);
			const result = await response.json();
			if (result.success) {
				setDetailedMeeting(result.data);
			}
		} catch (error) {
			console.error('Failed to fetch meeting details:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = () => {
		router.push(`/admin/meetings?edit=${meeting.id}`);
		onClose();
	};

	const handleCancel = async () => {
		const result = await Swal.fire({
			title: 'Cancel Meeting?',
			text: 'Are you sure you want to cancel this meeting?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#ef4444',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Yes, cancel it',
			cancelButtonText: 'No, keep it',
			reverseButtons: true,
		});

		if (!result.isConfirmed) return;

		try {
			const response = await fetch(`/api/meetings/${meeting.id}/cancel`, {
				method: 'PUT',
			});

			if (response.ok) {
				await Swal.fire({
					icon: 'success',
					title: 'Meeting Cancelled',
					text: 'The meeting has been cancelled successfully.',
					timer: 2000,
					showConfirmButton: false,
				});
				onRefresh();
				onClose();
			} else {
				await Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Failed to cancel the meeting. Please try again.',
				});
			}
		} catch (error) {
			console.error('Failed to cancel meeting:', error);
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'An unexpected error occurred. Please try again.',
			});
		}
	};

	const handleDelete = async () => {
		const result = await Swal.fire({
			title: 'Delete Meeting?',
			text: 'Are you sure you want to delete this meeting? This action cannot be undone!',
			icon: 'error',
			showCancelButton: true,
			confirmButtonColor: '#dc2626',
			cancelButtonColor: '#6b7280',
			confirmButtonText: 'Yes, delete it',
			cancelButtonText: 'Cancel',
			reverseButtons: true,
		});

		if (!result.isConfirmed) return;

		try {
			const response = await fetch(`/api/meetings/${meeting.id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				await Swal.fire({
					icon: 'success',
					title: 'Meeting Deleted',
					text: 'The meeting has been deleted successfully.',
					timer: 2000,
					showConfirmButton: false,
				});
				onRefresh();
				onClose();
			} else {
				await Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Failed to delete the meeting. Please try again.',
				});
			}
		} catch (error) {
			console.error('Failed to delete meeting:', error);
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'An unexpected error occurred. Please try again.',
			});
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const formatTime = (timeString: string) => {
		return new Date(timeString).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	};

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-end">
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
					className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
				/>

				{/* Drawer */}
				<motion.div
					initial={{ x: '100%' }}
					animate={{ x: 0 }}
					exit={{ x: '100%' }}
					transition={{ type: 'spring', damping: 30, stiffness: 300 }}
					className="relative w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto"
				>
					{/* Header */}
					<div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
						<div className="flex items-start justify-between">
							<div className="flex-1 pr-4">
								<h2 className="text-2xl font-bold text-slate-900 leading-tight">
									{meeting.meetingTitle}
								</h2>
								<p className="text-sm text-slate-500 mt-1">
									{meeting.meetingType?.meetingTypeName || 'Meeting'}
								</p>
							</div>
							<button
								onClick={onClose}
								className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
					</div>

					{loading ? (
						<div className="flex items-center justify-center py-12">
							<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
						</div>
					) : (
						<div className="p-6 space-y-6">
							{/* Status Badge */}
							{meeting.isCancelled && (
								<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
									<Ban className="w-4 h-4" />
									Cancelled
								</div>
							)}

							{/* Basic Info */}
							<section className="space-y-4">
								<h3 className="text-lg font-semibold text-slate-900">Meeting Details</h3>
								<div className="space-y-3">
									<div className="flex items-start gap-3">
										<Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-slate-900">
												{formatDate(detailedMeeting?.meetingDate || meeting.meetingDate)}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Clock className="w-5 h-5 text-slate-400 mt-0.5" />
										<div>
											<p className="text-sm text-slate-700">
												{formatTime(detailedMeeting?.meetingStartTime || meeting.meetingStartTime)}
												{' - '}
												{formatTime(detailedMeeting?.meetingEndTime || meeting.meetingEndTime)}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
										<div>
											<p className="text-sm text-slate-700">
												{detailedMeeting?.venue?.venueName || meeting.venue?.venueName || 'No venue specified'}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<User className="w-5 h-5 text-slate-400 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-slate-900">Organizer</p>
											<p className="text-sm text-slate-700">
												{detailedMeeting?.organizer?.staffName || meeting.organizer?.staffName || 'Unknown'}
											</p>
										</div>
									</div>
								</div>

								{detailedMeeting?.meetingDescription && (
									<div className="pt-3 border-t border-slate-200">
										<p className="text-sm text-slate-700 leading-relaxed">
											{detailedMeeting.meetingDescription}
										</p>
									</div>
								)}
							</section>

							{/* Participants */}
							<section className="space-y-4">
								<div className="flex items-center gap-2">
									<Users className="w-5 h-5 text-slate-700" />
									<h3 className="text-lg font-semibold text-slate-900">
										Participants ({detailedMeeting?.meetingMembers?.length || 0})
									</h3>
								</div>
								<div className="space-y-2">
									{detailedMeeting?.meetingMembers && detailedMeeting.meetingMembers.length > 0 ? (
										detailedMeeting.meetingMembers.map((member: any) => (
											<div
												key={member.id}
												className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
											>
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
														{member.staff?.staffName?.charAt(0) || 'U'}
													</div>
													<div>
														<p className="text-sm font-medium text-slate-900">
															{member.staff?.staffName || 'Unknown'}
														</p>
														<p className="text-xs text-slate-500">
															{member.staff?.department?.departmentName || 'No department'}
														</p>
													</div>
												</div>
												{member.isPresent !== null && (
													<div className="flex items-center gap-1.5">
														{member.isPresent ? (
															<>
																<CheckCircle className="w-4 h-4 text-green-600" />
																<span className="text-xs font-medium text-green-600">Present</span>
															</>
														) : (
															<>
																<XCircle className="w-4 h-4 text-red-600" />
																<span className="text-xs font-medium text-red-600">Absent</span>
															</>
														)}
													</div>
												)}
											</div>
										))
									) : (
										<p className="text-sm text-slate-500 py-4 text-center">No participants added</p>
									)}
								</div>
							</section>

							{/* Documents */}
							<section className="space-y-4">
								<div className="flex items-center gap-2">
									<FileText className="w-5 h-5 text-slate-700" />
									<h3 className="text-lg font-semibold text-slate-900">Documents</h3>
								</div>
								<div className="text-sm text-slate-500 py-4 text-center bg-slate-50 rounded-lg">
									No documents uploaded yet
								</div>
							</section>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-6 border-t border-slate-200">
								{!meeting.isCancelled && (
									<>
										<button
											onClick={handleEdit}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
										>
											<Edit size={18} />
											Edit Meeting
										</button>
										<button
											onClick={handleCancel}
											className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
										>
											<Ban size={18} />
											Cancel
										</button>
									</>
								)}
								<button
									onClick={handleDelete}
									className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium"
								>
									<Trash2 size={18} />
									Delete
								</button>
							</div>
						</div>
					)}
				</motion.div>
			</div>
		</AnimatePresence>
	);
}
