'use client';

import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users, UserCheck, TrendingUp } from 'lucide-react';

interface ConvenerParticipantEngagementChartProps {
	data: {
		totalParticipants: number;
		activeParticipants: number;
		averageAttendance: number;
	};
}

export default function ConvenerParticipantEngagementChart({ data }: ConvenerParticipantEngagementChartProps) {
	const engagementRate = data.totalParticipants > 0
		? Math.round((data.activeParticipants / data.totalParticipants) * 100)
		: 0;

	const chartData = [
		{
			name: 'Engagement',
			value: engagementRate,
			fill: '#10B981',
		},
		{
			name: 'Total',
			value: 100,
			fill: 'transparent',
		}
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.4 }}
			className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
		>
			<motion.h3
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.5 }}
				className="text-xl font-bold text-gray-900 mb-2"
			>
				Participant Engagement
			</motion.h3>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6 }}
				className="text-sm text-gray-600 mb-6"
			>
				Meeting participation and attendance metrics
			</motion.p>

			<div className="flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
					className="relative"
				>
					<ResponsiveContainer width={220} height={220}>
						<RadialBarChart
							cx="50%"
							cy="50%"
							innerRadius="60%"
							outerRadius="100%"
							barSize={20}
							data={[chartData[0]]}
							startAngle={90}
							endAngle={-270}
						>
							<RadialBar
								background={{ fill: '#e5e7eb' }}
								dataKey="value"
								cornerRadius={10}
								max={100}
							/>
						</RadialBarChart>
					</ResponsiveContainer>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<div className="text-4xl font-bold text-emerald-600">{engagementRate}%</div>
						<div className="text-sm text-gray-600 mt-1">Engagement</div>
					</div>
				</motion.div>
			</div>

			<div className="mt-6 space-y-3">
				{data.totalParticipants > 0 ? (
					<>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.8 }}
							className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
						>
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-blue-50">
									<Users className="h-4 w-4 text-blue-600" />
								</div>
								<span className="font-medium text-gray-900">Total Participants</span>
							</div>
							<span className="font-bold text-gray-900">{data.totalParticipants}</span>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.9 }}
							className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
						>
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-emerald-50">
									<UserCheck className="h-4 w-4 text-emerald-600" />
								</div>
								<span className="font-medium text-gray-900">Active Participants</span>
							</div>
							<span className="font-bold text-gray-900">{data.activeParticipants}</span>
						</motion.div>
					</>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg"
					>
						No participant data available yet
					</motion.div>
				)}

				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 1.0 }}
					className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50"
				>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-white">
							<TrendingUp className="h-4 w-4 text-emerald-600" />
						</div>
						<span className="font-medium text-gray-900">Avg. Attendance</span>
					</div>
					<span className="font-bold text-emerald-600">{data.averageAttendance}%</span>
				</motion.div>
			</div>
		</motion.div>
	);
}
