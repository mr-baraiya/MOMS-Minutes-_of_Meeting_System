'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface StaffMeetingTrendChartProps {
	data: { month: string; meetings: number }[];
}

export default function StaffMeetingTrendChart({ data }: StaffMeetingTrendChartProps) {
	const maxValue = Math.max(...data.map(d => d.meetings), 1);
	const avgMeetings = data.length > 0 
		? Math.round(data.reduce((sum, d) => sum + d.meetings, 0) / data.length)
		: 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.4 }}
			className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
		>
			<div className="flex items-center justify-between mb-6">
				<div>
					<motion.h3
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.5 }}
						className="text-xl font-bold text-gray-900"
					>
						Meeting Participation Trend
					</motion.h3>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
						className="text-sm text-gray-600 mt-1"
					>
						Your meetings over the past 6 months
					</motion.p>
				</div>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
					className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg"
				>
					<TrendingUp className="h-5 w-5 text-blue-600" />
					<div>
						<div className="text-lg font-bold text-blue-600">{avgMeetings}</div>
						<div className="text-xs text-blue-600">Avg/month</div>
					</div>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8 }}
				className="w-full h-[280px] min-h-[280px]"
			>
				<ResponsiveContainer width="100%" height="100%" minHeight={280}>
					<AreaChart data={data}>
						<defs>
							<linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
								<stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
						<XAxis
							dataKey="month"
							tick={{ fontSize: 12 }}
							stroke="#9CA3AF"
						/>
						<YAxis
							tick={{ fontSize: 12 }}
							stroke="#9CA3AF"
							domain={[0, maxValue + 2]}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: '#fff',
								border: '1px solid #e5e7eb',
								borderRadius: '8px',
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
							}}
							formatter={(value) => [`${value} meetings`, 'Count']}
						/>
						<Area
							type="monotone"
							dataKey="meetings"
							stroke="#3B82F6"
							strokeWidth={3}
							fill="url(#colorMeetings)"
							animationDuration={1500}
							animationBegin={800}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</motion.div>
		</motion.div>
	);
}
