'use client';

import { motion } from 'framer-motion';
import { Eye, Edit, Users, FileText, XCircle, Calendar, MapPin, User } from 'lucide-react';
import { MeetingWithCount } from '@/types/models';

interface MeetingsTableViewProps {
	meetings: MeetingWithCount[];
	loading: boolean;
	onViewMeeting: (meeting: MeetingWithCount) => void;
	onEditMeeting: (meeting: MeetingWithCount) => void;
	onViewAttendance: (meeting: MeetingWithCount) => void;
	onViewDocuments: (meeting: MeetingWithCount) => void;
	onCancelMeeting: (meeting: MeetingWithCount) => void;
	onRefresh: () => void;
}

export default function MeetingsTableView({
	meetings,
	loading,
	onViewMeeting,
	onEditMeeting,
	onViewAttendance,
	onViewDocuments,
	onCancelMeeting,
	onRefresh,
}: MeetingsTableViewProps) {
	const getStatus = (meeting: MeetingWithCount) => {
		if (meeting.isCancelled) return 'cancelled';
		const meetingDate = new Date(meeting.meetingDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		meetingDate.setHours(0, 0, 0, 0);
		
		if (meetingDate < today) return 'completed';
		return 'upcoming';
	};

	const formatTime = (value: Date | string) => {
		return new Date(value).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
		});
	};

	const getStatusBadge = (status: string) => {
		const styles = {
			upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
			completed: 'bg-green-100 text-green-700 border-green-200',
			cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
		};
		const labels = {
			upcoming: 'Upcoming',
			completed: 'Completed',
			cancelled: 'Cancelled',
		};
		return (
			<span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
				{labels[status as keyof typeof labels]}
			</span>
		);
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	if (loading) {
		return (
			<div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
				<div className="space-y-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="animate-pulse flex gap-4">
							<div className="h-12 bg-gray-200 rounded flex-1"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (meetings.length === 0) {
		return (
			<div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
				<Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
				<h3 className="text-lg font-semibold text-gray-900 mb-2">No meetings found</h3>
				<p className="text-gray-600">Try adjusting your filters or create a new meeting</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Title
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Type
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Date & Time
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Organizer
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Venue
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Participants
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{meetings.map((meeting, index) => {
							const status = getStatus(meeting);
							return (
								<motion.tr
									key={meeting.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3, delay: index * 0.05 }}
									onClick={() => onViewMeeting(meeting)}
									className="hover:bg-gray-50 cursor-pointer transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-start gap-2">
											<Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
											<div>
												<p className="text-sm font-medium text-gray-900">
													{meeting.meetingTitle}
												</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
											{meeting.meetingType?.meetingTypeName || 'N/A'}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm">
											<p className="font-medium text-gray-900">
												{formatDate(meeting.meetingDate)}
											</p>
											<p className="text-gray-600">
												{formatTime(meeting.meetingStartTime)} - {formatTime(meeting.meetingEndTime)}
											</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<User className="w-4 h-4 text-gray-400" />
											<span className="text-sm text-gray-900">
												{meeting.organizer?.staffName || 'N/A'}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<MapPin className="w-4 h-4 text-gray-400" />
											<span className="text-sm text-gray-900">
												{meeting.venue?.venueName || 'N/A'}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										{getStatusBadge(status)}
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<Users className="w-4 h-4 text-gray-400" />
											<span className="text-sm font-medium text-gray-900">
												{meeting._count?.meetingMembers || 0}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-1">
											<button
												onClick={(e) => {
													e.stopPropagation();
													onViewMeeting(meeting);
												}}
												className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-200"
												title="View Details"
											>
												<Eye size={16} />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													onEditMeeting(meeting);
												}}
												className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors border border-transparent hover:border-green-200"
												title="Edit Meeting"
											>
												<Edit size={16} />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													onViewAttendance(meeting);
												}}
												className="p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors border border-transparent hover:border-purple-200"
												title="Attendance"
											>
												<Users size={16} />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													onViewDocuments(meeting);
												}}
												className="p-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors border border-transparent hover:border-orange-200"
												title="Documents"
											>
												<FileText size={16} />
											</button>
											{!meeting.isCancelled && (
												<button
													onClick={(e) => {
														e.stopPropagation();
														onCancelMeeting(meeting);
													}}
													className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-200"
													title="Cancel Meeting"
												>
													<XCircle size={16} />
												</button>
											)}
										</div>
									</td>
								</motion.tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
