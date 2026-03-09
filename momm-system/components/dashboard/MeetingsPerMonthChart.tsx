'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MeetingsChartProps {
	data: { month: string; meetings: number }[];
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export default function MeetingsPerMonthChart({ data }: MeetingsChartProps) {
	const chartRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);
	useEffect(() => { setMounted(true); }, []);

	return (
		<motion.div
			ref={chartRef}
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6, delay: 0.4 }}
			className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
		>
			<motion.h3
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6 }}
				className="text-xl font-bold text-gray-900 mb-6"
			>
				Meetings per Month
			</motion.h3>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8 }}
                className="h-[300px] w-full"
			>
				{mounted ? <ResponsiveContainer width="100%" height="100%">
					<BarChart data={data}>
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
							radius={[8, 8, 0, 0]}
							animationDuration={1500}
							animationBegin={800}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer> : <div className="h-full w-full animate-pulse bg-gray-100 rounded-lg" />}
			</motion.div>
		</motion.div>
	);
}
