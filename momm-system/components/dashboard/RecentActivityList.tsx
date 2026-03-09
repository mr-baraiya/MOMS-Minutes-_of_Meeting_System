'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, FileText, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Activity {
	action: string;
	user: string;
	timestamp: string;
	type: 'meeting' | 'attendance' | 'document' | string;
}

interface RecentActivityListProps {
	activities: Activity[];
}

const getActivityIcon = (type: string) => {
	switch (type) {
		case 'meeting':
			return { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-100' };
		case 'attendance':
			return { icon: Users, color: 'text-green-500', bg: 'bg-green-100' };
		case 'document':
			return { icon: FileText, color: 'text-purple-500', bg: 'bg-purple-100' };
		default:
			return { icon: CheckCircle, color: 'text-gray-500', bg: 'bg-gray-100' };
	}
};

export default function RecentActivityList({ activities }: RecentActivityListProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.6 }}
			className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
		>
			<motion.h3
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8 }}
				className="text-xl font-bold text-gray-900 mb-6"
			>
				Recent Activity
			</motion.h3>
			<div className="space-y-3">
				{activities.length === 0 ? (
					<div className="text-center py-8 text-gray-400">
						<AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>No recent activity</p>
					</div>
				) : (
					activities.slice(0, 10).map((activity, index) => {
						const { icon: Icon, color, bg } = getActivityIcon(activity.type);
						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ 
									duration: 0.4, 
									delay: 0.9 + (index * 0.1),
									ease: 'easeOut'
								}}
								whileHover={{ 
									scale: 1.02,
									backgroundColor: '#f9fafb',
									transition: { duration: 0.2 }
								}}
								className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all cursor-pointer"
							>
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ 
										delay: 1 + (index * 0.1),
										type: 'spring',
										stiffness: 200
									}}
									className={`${bg} p-2.5 rounded-lg flex-shrink-0`}
								>
									<Icon className={`w-5 h-5 ${color}`} />
								</motion.div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 mb-1">
										{activity.action}
									</p>
									<div className="flex items-center gap-2 text-xs text-gray-500">
										<span className="font-medium">{activity.user}</span>
										<span>•</span>
										<span>{activity.timestamp}</span>
									</div>
								</div>
							</motion.div>
						);
					})
				)}
			</div>

			{activities.length > 0 && (
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.5 }}
					className="mt-6 pt-4 border-t border-gray-100 text-center"
				>
					<Link 
						href="/admin/activity" 
						className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
					>
						View All Activity
						<ArrowRight className="w-4 h-4" />
					</Link>
				</motion.div>
			)}
		</motion.div>
	);
}
