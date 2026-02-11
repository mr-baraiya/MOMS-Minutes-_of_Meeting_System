'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface AttendanceChartProps {
	data: { month: string; attendance: number }[];
}

export default function AttendanceTrendChart({ data }: AttendanceChartProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6, delay: 0.5 }}
			className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
		>
			<motion.h3
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.7 }}
				className="text-xl font-bold text-gray-900 mb-6"
			>
				Attendance Trend
			</motion.h3>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.9 }}
			>
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart data={data}>
						<defs>
							<linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
								<stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
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
							domain={[0, 100]}
							tickFormatter={(value) => `${value}%`}
						/>
						<Tooltip 
							contentStyle={{
								backgroundColor: '#fff',
								border: '1px solid #e5e7eb',
								borderRadius: '8px',
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
							}}
							formatter={(value) => [`${value}%`, 'Attendance']}
						/>
						<Area
							type="monotone"
							dataKey="attendance"
							stroke="#10B981"
							strokeWidth={3}
							fill="url(#colorAttendance)"
							animationDuration={1500}
							animationBegin={900}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</motion.div>
		</motion.div>
	);
}
