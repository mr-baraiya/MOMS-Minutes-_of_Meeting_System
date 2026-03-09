'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, Users, Eye, Edit, Clock, Video } from 'lucide-react';
import { MeetingWithCount } from '@/types/models';

interface MeetingsCardViewProps {
	meetings: MeetingWithCount[];
	loading: boolean;
	onViewMeeting: (meeting: MeetingWithCount) => void;
	onEditMeeting: (meeting: MeetingWithCount) => void;
}

export default function MeetingsCardView({
	meetings,
	loading,
	onViewMeeting,
	onEditMeeting,
}: MeetingsCardViewProps) {
	const getStatus = (meeting: MeetingWithCount) => {
		if (meeting.isCancelled) return 'cancelled';
		const meetingDate = new Date(meeting.meetingDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		meetingDate.setHours(0, 0, 0, 0);
		
		if (meetingDate < today) return 'completed';
		return 'upcoming';
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
			<span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
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

	const formatTime = (value: Date | string) => {
		return new Date(value).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
		});
	};

	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div key={i} className="animate-pulse bg-white rounded-xl shadow-md border border-gray-100 p-6">
						<div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
						<div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
					</div>
				))}
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
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{meetings.map((meeting, index) => {
				const status = getStatus(meeting);
				return (
					<motion.div
						key={meeting.id}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3, delay: index * 0.05 }}
						whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
						onClick={() => onViewMeeting(meeting)}
						className="bg-white rounded-xl shadow-md border border-gray-100 p-6 cursor-pointer transition-all"
					>
						{/* Header */}
						<div className="mb-4">
							<div className="flex items-start justify-between gap-2 mb-2">
								<h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
									{meeting.meetingTitle}
								</h3>
							</div>
							<span className="inline-flex px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
								{meeting.meetingType?.meetingTypeName || 'N/A'}
							</span>
						</div>

						{/* Date & Time */}
						<div className="space-y-3 mb-4">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Calendar className="w-4 h-4 text-gray-400" />
								<span className="font-medium text-gray-900">{formatDate(meeting.meetingDate)}</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Clock className="w-4 h-4 text-gray-400" />
								<span>{formatTime(meeting.meetingStartTime)} - {formatTime(meeting.meetingEndTime)}</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<User className="w-4 h-4 text-gray-400" />
								<span>{meeting.organizer?.staffName || 'N/A'}</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<MapPin className="w-4 h-4 text-gray-400" />
								<span>{meeting.venue?.venueName || 'N/A'}</span>
							</div>
						</div>

						{/* Footer */}
						<div className="flex items-center justify-between pt-4 border-t border-gray-100">
							<div className="flex items-center gap-2">
								<Users className="w-4 h-4 text-gray-400" />
								<span className="text-sm font-medium text-gray-900">
									{meeting._count?.meetingMembers || 0} Participants
								</span>
							</div>
							{getStatusBadge(status)}
						</div>

						{/* Action Buttons */}
						<div className="flex gap-2 mt-4">
							<button
								onClick={(e) => {
									e.stopPropagation();
									onViewMeeting(meeting);
								}}
								className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
							>
								<Eye size={16} />
								View
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									onEditMeeting(meeting);
								}}
								className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
							>
								<Edit size={16} />
								Edit
							</button>
							{!meeting.isCancelled && meeting.meetingLink && (
								<Link
									href={`/meeting/${meeting.id}/join`}
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
									className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
							>
								<Video size={16} />
								Join
								</Link>
							)}
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}
