'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface MeetingEventCardProps {
	meeting: any;
	onClick: () => void;
}

export default function MeetingEventCard({ meeting, onClick }: MeetingEventCardProps) {
	const getMeetingColor = () => {
		if (meeting.isCancelled) {
			return 'border-slate-300 bg-slate-50 text-slate-500';
		}

		const typeName = meeting.meetingType?.meetingTypeName?.toLowerCase() || '';
		
		if (typeName.includes('management') || typeName.includes('board')) {
			return 'border-purple-400 bg-purple-50 text-purple-700';
		}
		if (typeName.includes('client') || typeName.includes('customer')) {
			return 'border-blue-400 bg-blue-50 text-blue-700';
		}
		if (typeName.includes('internal') || typeName.includes('team')) {
			return 'border-green-400 bg-green-50 text-green-700';
		}
		if (typeName.includes('project')) {
			return 'border-indigo-400 bg-indigo-50 text-indigo-700';
		}
		
		return 'border-slate-300 bg-slate-50 text-slate-700';
	};

	const formatTime = (timeString: string) => {
		const date = new Date(timeString);
		return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
	};

	const colorClasses = getMeetingColor();

	return (
		<motion.button
			onClick={onClick}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			className={`w-full text-left p-1.5 rounded-md border-l-2 ${colorClasses} transition-all cursor-pointer group`}
		>
			<div className="flex items-start gap-1.5">
				<Clock className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-60" />
				<div className="flex-1 min-w-0">
					<p className={`text-xs font-medium leading-tight truncate ${meeting.isCancelled ? 'line-through' : ''}`}>
						{meeting.meetingTitle}
					</p>
					<p className="text-[10px] opacity-75 mt-0.5">
						{formatTime(meeting.meetingStartTime)}
					</p>
				</div>
			</div>
		</motion.button>
	);
}
