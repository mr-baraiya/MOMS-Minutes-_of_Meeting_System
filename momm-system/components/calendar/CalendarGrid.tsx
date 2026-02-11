'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import MeetingEventCard from './MeetingEventCard';

type ViewMode = 'month' | 'week' | 'day';

interface CalendarGridProps {
	currentDate: Date;
	viewMode: ViewMode;
	meetings: any[];
	loading: boolean;
	onMeetingClick: (meeting: any) => void;
}

export default function CalendarGrid({
	currentDate,
	viewMode,
	meetings,
	loading,
	onMeetingClick,
}: CalendarGridProps) {
	const today = new Date();
	const isToday = (date: Date) => {
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days: (Date | null)[] = [];

		// Add empty cells for days before month starts
		for (let i = 0; i < startingDayOfWeek; i++) {
			days.push(null);
		}

		// Add all days in month
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(new Date(year, month, day));
		}

		return days;
	};

	const getMeetingsForDate = (date: Date | null) => {
		if (!date) return [];

		return meetings.filter((meeting) => {
			const meetingDate = new Date(meeting.meetingDate);
			return (
				meetingDate.getDate() === date.getDate() &&
				meetingDate.getMonth() === date.getMonth() &&
				meetingDate.getFullYear() === date.getFullYear()
			);
		});
	};

	const getWeekDays = (date: Date) => {
		const curr = new Date(date);
		const first = curr.getDate() - curr.getDay();
		const days: Date[] = [];
		
		for (let i = 0; i < 7; i++) {
			days.push(new Date(curr.setDate(first + i)));
		}
		return days;
	};

	const formatTime = (timeString: string) => {
		const date = new Date(timeString);
		return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
	};

	const getTimePosition = (timeString: string) => {
		const date = new Date(timeString);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const totalMinutes = (hours * 60) + minutes;
		const startMinutes = 7 * 60; // 7 AM
		return ((totalMinutes - startMinutes) / 60) * 60; // 60px per hour
	};

	const days = getDaysInMonth(currentDate);
	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const timeSlots = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

	if (loading) {
		return (
			<div className="bg-white border border-slate-200 rounded-xl p-8">
				<div className="flex items-center justify-center py-12">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
				</div>
			</div>
		);
	}

	// Week View
	if (viewMode === 'week') {
		const weekDates = getWeekDays(currentDate);

		return (
			<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
				<div className="grid grid-cols-[80px_repeat(7,1fr)]">
					{/* Header */}
					<div className="border-b border-r border-slate-200 bg-slate-50 p-3"></div>
					{weekDates.map((date, idx) => {
						const isTodayDate = isToday(date);
						return (
							<div
								key={idx}
								className={`border-b border-r border-slate-200 p-3 text-center ${
									isTodayDate ? 'bg-indigo-50' : 'bg-slate-50'
								}`}
							>
								<div className="text-xs font-medium text-slate-500 uppercase">
									{weekDays[date.getDay()]}
								</div>
								<div
									className={`mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
										isTodayDate
											? 'bg-indigo-600 text-white'
											: 'text-slate-700'
									}`}
								>
									{date.getDate()}
								</div>
							</div>
						);
					})}

					{/* Time Slots */}
					{timeSlots.map((hour) => (
						<Fragment key={`hour-${hour}`}>
							<div
								className="border-r border-slate-100 p-2 text-xs text-slate-500 text-right pr-3 bg-slate-50"
							>
								{hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
							</div>
							{weekDates.map((date, idx) => {
								const dayMeetings = getMeetingsForDate(date);
								const hourMeetings = dayMeetings.filter((meeting) => {
									const meetingHour = new Date(meeting.meetingStartTime).getHours();
									return meetingHour === hour;
								});

								return (
									<div
										key={`${hour}-${idx}`}
										className="border-r border-b border-slate-100 p-1 min-h-[60px] hover:bg-slate-50 transition-colors relative"
									>
										<div className="space-y-1">
											{hourMeetings.map((meeting) => (
												<MeetingEventCard
													key={meeting.id}
													meeting={meeting}
													onClick={() => onMeetingClick(meeting)}
												/>
											))}
										</div>
									</div>
								);
							})}
					</Fragment>
				))}
			</div>
		</div>
		);
	}

	// Day View
	if (viewMode === 'day') {
		const dayMeetings = getMeetingsForDate(currentDate);

		return (
			<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
				{/* Header */}
				<div className="border-b border-slate-200 bg-slate-50 p-4">
					<div className="text-center">
						<div className="text-xs font-medium text-slate-500 uppercase mb-1">
							{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
						</div>
						<div className="text-2xl font-bold text-slate-900">
							{currentDate.getDate()}
						</div>
						<div className="text-sm text-slate-500">
							{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
						</div>
					</div>
				</div>

				{/* Timeline */}
				<div className="max-h-[600px] overflow-y-auto">
					<div className="grid grid-cols-[80px_1fr]">
						{timeSlots.map((hour) => {
							const hourMeetings = dayMeetings.filter((meeting) => {
								const meetingHour = new Date(meeting.meetingStartTime).getHours();
								return meetingHour === hour;
							});

							return (
								<Fragment key={`day-hour-${hour}`}>
									<div
										className="border-r border-slate-100 p-2 text-xs text-slate-500 text-right pr-3 bg-slate-50"
									>
										{hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
									</div>
									<div
										className="border-b border-slate-100 p-2 min-h-[80px] hover:bg-slate-50 transition-colors"
									>
										<div className="space-y-2">
											{hourMeetings.map((meeting) => (
												<motion.div
													key={meeting.id}
													initial={{ opacity: 0, x: -10 }}
													animate={{ opacity: 1, x: 0 }}
													whileHover={{ scale: 1.02 }}
													onClick={() => onMeetingClick(meeting)}
													className="p-3 rounded-lg border-l-4 border-indigo-500 bg-indigo-50 cursor-pointer hover:shadow-md transition-all"
												>
													<div className="flex items-start justify-between">
														<div className="flex-1">
															<h4 className="font-semibold text-slate-900 mb-1">
																{meeting.meetingTitle}
															</h4>
															<p className="text-sm text-slate-600 flex items-center gap-1">
																<span>{formatTime(meeting.meetingStartTime)}</span>
																<span>-</span>
																<span>{formatTime(meeting.meetingEndTime)}</span>
															</p>
															{meeting.meetingType && (
																<p className="text-xs text-slate-500 mt-1">
																	{meeting.meetingType.meetingTypeName}
																</p>
															)}
														</div>
													</div>
												</motion.div>
											))}
										</div>
									</div>
								</Fragment>
							);
						})}
					</div>
				</div>

				{/* Empty State */}
				{dayMeetings.length === 0 && (
					<div className="p-12 text-center">
						<p className="text-slate-500">No meetings scheduled for this day</p>
					</div>
				)}
			</div>
		);
	}

	// Month View (default)
	return (
		<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
			{/* Week Day Headers */}
			<div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
				{weekDays.map((day) => (
					<div key={day} className="p-3 text-center">
						<span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{day}</span>
					</div>
				))}
			</div>

			{/* Calendar Days Grid */}
			<div className="grid grid-cols-7">
				{days.map((date, index) => {
					const dayMeetings = getMeetingsForDate(date);
					const isTodayDate = date && isToday(date);

					return (
						<motion.div
							key={index}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.2, delay: index * 0.01 }}
							className={`min-h-[120px] p-2 border-b border-r border-slate-100 ${
								!date ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
							} transition-colors`}
						>
							{date && (
								<>
									<div
										className={`inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full mb-2 ${
											isTodayDate
												? 'bg-indigo-600 text-white'
												: 'text-slate-700'
										}`}
									>
										{date.getDate()}
									</div>

									<div className="space-y-1">
										{dayMeetings.slice(0, 3).map((meeting) => (
											<MeetingEventCard
												key={meeting.id}
												meeting={meeting}
												onClick={() => onMeetingClick(meeting)}
											/>
										))}
										{dayMeetings.length > 3 && (
											<button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium pl-1">
												+{dayMeetings.length - 3} more
											</button>
										)}
									</div>
								</>
							)}
						</motion.div>
					);
				})}
			</div>

			{/* Empty State */}
			{meetings.length === 0 && (
				<div className="p-12 text-center border-t border-slate-200">
					<p className="text-slate-500">No meetings scheduled for this period</p>
				</div>
			)}
		</div>
	);
}
