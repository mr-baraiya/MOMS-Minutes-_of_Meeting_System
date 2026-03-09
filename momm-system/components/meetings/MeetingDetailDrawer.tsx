'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
	X,
	Calendar,
	Clock,
	MapPin,
	User,
	Users,
	FileText,
	CheckCircle,
	XCircle,
	Edit,
	Video,
} from 'lucide-react';
import { MeetingWithCount } from '@/types/models';

interface MeetingDetailDrawerProps {
	meeting: MeetingWithCount;
	onClose: () => void;
	onRefresh: () => void;
	onEdit?: (meeting: MeetingWithCount) => void;
}

export default function MeetingDetailDrawer({
	meeting,
	onClose,
	onRefresh,
	onEdit,
}: MeetingDetailDrawerProps) {
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

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const formatTime = (value: Date | string) => {
		return new Date(value).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
		});
	};

	const getStatus = () => {
		if (meeting.isCancelled) return { label: 'Cancelled', color: 'bg-gray-100 text-gray-700' };
		const meetingDate = new Date(meeting.meetingDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		meetingDate.setHours(0, 0, 0, 0);
		
		if (meetingDate < today) return { label: 'Completed', color: 'bg-green-100 text-green-700' };
		return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
	};

	const status = getStatus();

	const attendanceStats = detailedMeeting?.meetingMembers
		? {
				total: detailedMeeting.meetingMembers.length,
				present: detailedMeeting.meetingMembers.filter((m: any) => m.isPresent).length,
				absent: detailedMeeting.meetingMembers.filter((m: any) => !m.isPresent && m.attendanceMarkedAt)
					.length,
				pending: detailedMeeting.meetingMembers.filter((m: any) => !m.attendanceMarkedAt).length,
		  }
		: { total: 0, present: 0, absent: 0, pending: 0 };

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 overflow-hidden">
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
					className="absolute inset-0 bg-black bg-opacity-50"
				/>

				{/* Drawer */}
				<motion.div
					initial={{ x: '100%' }}
					animate={{ x: 0 }}
					exit={{ x: '100%' }}
					transition={{ type: 'spring', damping: 25, stiffness: 200 }}
					className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto"
				>
					{/* Header */}
					<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">Meeting Details</h2>
							<span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${status.color}`}>
								{status.label}
							</span>
						</div>
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<X size={24} />
						</button>
					</div>

					{loading ? (
						<div className="p-6 space-y-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="animate-pulse">
									<div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
									<div className="h-6 bg-gray-200 rounded w-3/4"></div>
								</div>
							))}
						</div>
					) : (
						<div className="p-6 space-y-6">
							{/* Basic Info */}
							<section>
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<Calendar className="w-5 h-5 text-blue-600" />
									Basic Information
								</h3>
								<div className="bg-gray-50 rounded-lg p-4 space-y-3">
									<div>
										<p className="text-sm text-gray-600 mb-1">Meeting Title</p>
										<p className="text-base font-semibold text-gray-900">{meeting.meetingTitle}</p>
									</div>
									{detailedMeeting?.description && (
										<div>
											<p className="text-sm text-gray-600 mb-1">Description</p>
											<p className="text-base text-gray-900">{detailedMeeting.description}</p>
										</div>
									)}
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-gray-600 mb-1">Date</p>
											<p className="text-base font-medium text-gray-900">{formatDate(meeting.meetingDate)}</p>
										</div>
										<div>
											<p className="text-sm text-gray-600 mb-1">Time</p>
											<p className="text-base font-medium text-gray-900">
												{formatTime(meeting.meetingStartTime)} - {formatTime(meeting.meetingEndTime)}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600 mb-1">Meeting Type</p>
											<span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-700 text-sm rounded">
												{meeting.meetingType?.meetingTypeName || 'N/A'}
											</span>
										</div>
										<div>
											<p className="text-sm text-gray-600 mb-1">Venue</p>
											<p className="text-base font-medium text-gray-900 flex items-center gap-1">
												<MapPin className="w-4 h-4 text-gray-400" />
												{meeting.venue?.venueName || 'N/A'}
											</p>
										</div>
										<div className="col-span-2">
											<p className="text-sm text-gray-600 mb-1">Organizer</p>
											<p className="text-base font-medium text-gray-900 flex items-center gap-1">
												<User className="w-4 h-4 text-gray-400" />
												{meeting.organizer?.staffName || 'N/A'}
											</p>
										</div>
									</div>
								</div>
							</section>

							{/* Participants */}
							<section>
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<Users className="w-5 h-5 text-green-600" />
									Participants ({attendanceStats.total})
								</h3>
								<div className="bg-gray-50 rounded-lg p-4">
									{detailedMeeting?.meetingMembers && detailedMeeting.meetingMembers.length > 0 ? (
										<div className="space-y-2">
											{detailedMeeting.meetingMembers.map((member: any) => (
												<div
													key={member.id}
													className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
												>
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
															<User className="w-5 h-5 text-blue-600" />
														</div>
														<div>
															<p className="font-medium text-gray-900">{member.staff?.staffName || 'N/A'}</p>
															<p className="text-sm text-gray-600">{member.staff?.emailAddress}</p>
														</div>
													</div>
													{member.attendanceMarkedAt ? (
														member.isPresent ? (
															<span className="flex items-center gap-1 text-green-600 text-sm font-medium">
																<CheckCircle size={16} />
																Present
															</span>
														) : (
															<span className="flex items-center gap-1 text-red-600 text-sm font-medium">
																<XCircle size={16} />
																Absent
															</span>
														)
													) : (
														<span className="text-gray-500 text-sm">Pending</span>
													)}
												</div>
											))}
										</div>
									) : (
										<p className="text-gray-600 text-center py-4">No participants added</p>
									)}
								</div>
							</section>

							{/* Attendance Summary */}
							<section>
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<FileText className="w-5 h-5 text-orange-600" />
									Attendance Summary
								</h3>
								<div className="grid grid-cols-4 gap-4">
									<div className="bg-blue-50 rounded-lg p-4 text-center">
										<p className="text-3xl font-bold text-blue-600">{attendanceStats.total}</p>
										<p className="text-sm text-gray-600 mt-1">Total</p>
									</div>
									<div className="bg-green-50 rounded-lg p-4 text-center">
										<p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
										<p className="text-sm text-gray-600 mt-1">Present</p>
									</div>
									<div className="bg-red-50 rounded-lg p-4 text-center">
										<p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
										<p className="text-sm text-gray-600 mt-1">Absent</p>
									</div>
									<div className="bg-gray-50 rounded-lg p-4 text-center">
										<p className="text-3xl font-bold text-gray-600">{attendanceStats.pending}</p>
										<p className="text-sm text-gray-600 mt-1">Pending</p>
									</div>
								</div>
							</section>

							{/* Documents */}
							<section>
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<FileText className="w-5 h-5 text-purple-600" />
									Documents
								</h3>
								<div className="bg-gray-50 rounded-lg p-4">
									{detailedMeeting?.documents && detailedMeeting.documents.length > 0 ? (
										<div className="space-y-2">
											{detailedMeeting.documents.map((doc: any) => (
												<div
													key={doc.id}
													className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
												>
													<div className="flex items-center gap-3">
														<FileText className="w-5 h-5 text-gray-400" />
														<div>
															<p className="font-medium text-gray-900">{doc.documentName}</p>
															<p className="text-sm text-gray-600">
																{new Date(doc.uploadedAt).toLocaleDateString()}
															</p>
														</div>
													</div>
													<a
														href={doc.documentPath}
														download
														className="text-blue-600 hover:text-blue-700 text-sm font-medium"
													>
														Download
													</a>
												</div>
											))}
										</div>
									) : (
										<p className="text-gray-600 text-center py-4">No documents uploaded</p>
									)}
								</div>
							</section>

							{/* Action Buttons */}
							<div className="space-y-3 pt-4 border-t border-gray-200">
								{/* Join Online — always shown unless cancelled */}
								{!meeting.isCancelled && (
									<Link
										href={`/meeting/${meeting.id}/join`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
									>
										<Video size={18} />
										Join Online Meeting
									</Link>
								)}
								<div className="flex gap-3">
									{onEdit && !meeting.isCancelled && (
										<button
											onClick={() => {
												onEdit(meeting);
												onClose();
											}}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
										>
											<Edit size={18} />
											Edit Meeting
										</button>
									)}
									<button
										onClick={onClose}
										className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
									>
										Close
									</button>
								</div>
							</div>
						</div>
					)}
				</motion.div>
			</div>
		</AnimatePresence>
	);
}
