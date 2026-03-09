'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StaffAttendanceChartProps {
	data: {
		attended: number;
		missed: number;
		pending: number;
	};
}

const COLORS = {
	attended: '#10B981',
	missed: '#EF4444',
	pending: '#F59E0B',
};

export default function StaffAttendanceChart({ data }: StaffAttendanceChartProps) {
	const chartData = [
		{ name: 'Attended', value: data.attended, color: COLORS.attended, icon: CheckCircle },
		{ name: 'Missed', value: data.missed, color: COLORS.missed, icon: XCircle },
		{ name: 'Pending', value: data.pending, color: COLORS.pending, icon: Clock },
	];

	const total = data.attended + data.missed + data.pending;
	const attendanceRate = total > 0 ? Math.round((data.attended / total) * 100) : 0;

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
						Attendance Overview
					</motion.h3>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="text-sm text-gray-600 mt-1"
					>
						Your meeting participation summary
					</motion.p>
				</div>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
					className="flex flex-col items-center"
				>
					<div className="text-3xl font-bold text-emerald-600">{attendanceRate}%</div>
					<div className="text-xs text-gray-500 uppercase tracking-wide">Rate</div>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.7 }}
				className="w-full h-[250px] min-h-[250px]"
			>
				<ResponsiveContainer width="100%" height="100%" minHeight={250}>
					<PieChart>
						<Pie
							data={chartData}
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={90}
							paddingAngle={5}
							dataKey="value"
							animationBegin={700}
							animationDuration={1000}
						>
							{chartData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: '#fff',
								border: '1px solid #e5e7eb',
								borderRadius: '8px',
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			</motion.div>

			<div className="mt-6 space-y-3">
				{chartData.map((item, index) => {
					const Icon = item.icon;
					return (
						<motion.div
							key={item.name}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.8 + index * 0.1 }}
							className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
						>
							<div className="flex items-center gap-3">
								<div
									className="p-2 rounded-lg"
									style={{ backgroundColor: `${item.color}20` }}
								>
									<Icon className="h-4 w-4" style={{ color: item.color }} />
								</div>
								<span className="font-medium text-gray-900">{item.name}</span>
							</div>
							<span className="font-bold text-gray-900">{item.value}</span>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
}
