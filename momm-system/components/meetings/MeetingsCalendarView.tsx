'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { MeetingWithCount } from '@/types/models';

interface MeetingsCalendarViewProps {
	meetings: MeetingWithCount[];
	onViewMeeting: (meeting: MeetingWithCount) => void;
}

export default function MeetingsCalendarView({
	meetings,
	onViewMeeting,
}: MeetingsCalendarViewProps) {
	const [currentDate, setCurrentDate] = useState(new Date());

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		return { daysInMonth, startingDayOfWeek };
	};

	const formatTime = (value: Date | string) => {
		return new Date(value).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
		});
	};

	const getMeetingsForDate = (date: number) => {
		const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
		targetDate.setHours(0, 0, 0, 0);

		return meetings.filter((meeting) => {
			const meetingDate = new Date(meeting.meetingDate);
			meetingDate.setHours(0, 0, 0, 0);
			return meetingDate.getTime() === targetDate.getTime();
		});
	};

	const previousMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
	};

	const nextMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
	};

	const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
	const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const getTypeColor = (typeName: string) => {
		const colors: { [key: string]: string } = {
			'Board Meeting': 'bg-blue-500',
			'Department Meeting': 'bg-green-500',
			'Staff Meeting': 'bg-purple-500',
			'Project Review': 'bg-orange-500',
			'Training Session': 'bg-pink-500',
		};
		return colors[typeName] || 'bg-gray-500';
	};

	return (
		<div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
			{/* Calendar Header */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
				<div className="flex gap-2">
					<button
						onClick={previousMonth}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ChevronLeft size={20} />
					</button>
					<button
						onClick={nextMonth}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ChevronRight size={20} />
					</button>
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="grid grid-cols-7 gap-2">
				{/* Week Day Headers */}
				{weekDays.map((day) => (
					<div
						key={day}
						className="text-center font-semibold text-sm text-gray-600 py-2"
					>
						{day}
					</div>
				))}

				{/* Empty cells for days before month starts */}
				{Array.from({ length: startingDayOfWeek }).map((_, index) => (
					<div key={`empty-${index}`} className="aspect-square"></div>
				))}

				{/* Calendar Days */}
				{Array.from({ length: daysInMonth }).map((_, index) => {
					const date = index + 1;
					const dayMeetings = getMeetingsForDate(date);
					const isToday =
						date === new Date().getDate() &&
						currentDate.getMonth() === new Date().getMonth() &&
						currentDate.getFullYear() === new Date().getFullYear();

					return (
						<motion.div
							key={date}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: index * 0.01 }}
							className={`aspect-square border rounded-lg p-2 ${
								isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
							} hover:border-blue-300 hover:bg-blue-50 transition-colors`}
						>
							<div className="h-full flex flex-col">
								<div className={`text-sm font-semibold mb-1 ${
									isToday ? 'text-blue-600' : 'text-gray-900'
								}`}>
									{date}
								</div>
								<div className="flex-1 overflow-y-auto space-y-1">
									{dayMeetings.slice(0, 3).map((meeting) => (
										<div
											key={meeting.id}
											onClick={() => onViewMeeting(meeting)}
											className={`text-xs px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity ${getTypeColor(
												meeting.meetingType?.meetingTypeName || ''
											)} text-white truncate`}
											title={meeting.meetingTitle}
										>
											{formatTime(meeting.meetingStartTime)} {meeting.meetingTitle}
										</div>
									))}
									{dayMeetings.length > 3 && (
										<div className="text-xs text-gray-600 text-center">
											+{dayMeetings.length - 3} more
										</div>
									)}
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Legend */}
			<div className="mt-6 pt-6 border-t border-gray-200">
				<h3 className="text-sm font-semibold text-gray-700 mb-3">Meeting Types</h3>
				<div className="flex flex-wrap gap-3">
					{Array.from(new Set(meetings.map((m) => m.meetingType?.meetingTypeName).filter(Boolean))).map(
						(typeName) => (
							<div key={typeName} className="flex items-center gap-2">
								<div className={`w-3 h-3 rounded ${getTypeColor(typeName || '')}`}></div>
								<span className="text-xs text-gray-600">{typeName}</span>
							</div>
						)
					)}
				</div>
			</div>

			{meetings.length === 0 && (
				<div className="text-center py-12">
					<Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<p className="text-gray-600">No meetings scheduled</p>
				</div>
			)}
		</div>
	);
}
