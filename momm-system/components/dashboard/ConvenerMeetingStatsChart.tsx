'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

interface ConvenerMeetingStatsChartProps {
	data: {
		completed: number;
		upcoming: number;
		cancelled: number;
	};
	monthlyData?: { month: string; meetings: number }[];
}

const COLORS = {
	completed: '#10B981',
	upcoming: '#3B82F6',
	cancelled: '#EF4444',
};

export default function ConvenerMeetingStatsChart({ data, monthlyData }: ConvenerMeetingStatsChartProps) {
	const statsData = [
		{ name: 'Completed', value: data.completed, color: COLORS.completed, icon: CheckCircle },
		{ name: 'Upcoming', value: data.upcoming, color: COLORS.upcoming, icon: Calendar },
		{ name: 'Cancelled', value: data.cancelled, color: COLORS.cancelled, icon: XCircle },
	];

	const defaultMonthlyData = monthlyData || [
		{ month: 'Jan', meetings: 4 },
		{ month: 'Feb', meetings: 6 },
		{ month: 'Mar', meetings: 5 },
		{ month: 'Apr', meetings: 8 },
		{ month: 'May', meetings: 7 },
		{ month: 'Jun', meetings: 9 },
	];

	const totalMeetings = data.completed + data.upcoming + data.cancelled;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, delay: 0.3 }}
			className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
		>
			<div className="flex items-center justify-between mb-6">
				<div>
					<motion.h3
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className="text-xl font-bold text-gray-900"
					>
						Meeting Statistics
					</motion.h3>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="text-sm text-gray-600 mt-1"
					>
						Overview of your convened meetings
					</motion.p>
				</div>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
					className="flex flex-col items-center"
				>
					<div className="text-3xl font-bold text-emerald-600">{totalMeetings}</div>
					<div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.7 }}
			>
				<ResponsiveContainer width="100%" height={250}>
					<BarChart data={defaultMonthlyData}>
						<defs>
							<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
								<stop offset="100%" stopColor="#059669" stopOpacity={1} />
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
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: '#fff',
								border: '1px solid #e5e7eb',
								borderRadius: '8px',
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
							}}
						/>
						<Bar
							dataKey="meetings"
							fill="url(#barGradient)"
							radius={[8, 8, 0, 0]}
							animationDuration={1500}
							animationBegin={700}
						/>
					</BarChart>
				</ResponsiveContainer>
			</motion.div>

			<div className="mt-6 grid grid-cols-3 gap-3">
				{statsData.map((item, index) => {
					const Icon = item.icon;
					const percentage = totalMeetings > 0 ? Math.round((item.value / totalMeetings) * 100) : 0;
					return (
						<motion.div
							key={item.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 + index * 0.1 }}
							className="flex flex-col items-center p-3 rounded-lg bg-gray-50"
						>
							<div
								className="p-2 rounded-lg mb-2"
								style={{ backgroundColor: `${item.color}20` }}
							>
								<Icon className="h-4 w-4" style={{ color: item.color }} />
							</div>
							<span className="text-xs text-gray-600 mb-1">{item.name}</span>
							<span className="font-bold text-gray-900 text-lg">{item.value}</span>
							<span className="text-xs text-gray-500">{percentage}%</span>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
}
