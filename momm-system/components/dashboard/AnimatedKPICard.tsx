'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedKPICardProps {
	title: string;
	value: number;
	icon: LucideIcon;
	color: 'blue' | 'green' | 'purple' | 'orange';
	delay?: number;
	suffix?: string;
}

const colorClasses = {
	blue: {
		bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
		iconBg: 'bg-blue-500',
		text: 'text-blue-600',
		border: 'border-blue-200',
	},
	green: {
		bg: 'bg-gradient-to-br from-green-50 to-green-100',
		iconBg: 'bg-green-500',
		text: 'text-green-600',
		border: 'border-green-200',
	},
	purple: {
		bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
		iconBg: 'bg-purple-500',
		text: 'text-purple-600',
		border: 'border-purple-200',
	},
	orange: {
		bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
		iconBg: 'bg-orange-500',
		text: 'text-orange-600',
		border: 'border-orange-200',
	},
};

export default function AnimatedKPICard({
	title,
	value,
	icon: Icon,
	color,
	delay = 0,
	suffix = '',
}: AnimatedKPICardProps) {
	const [count, setCount] = useState(0);
	const colors = colorClasses[color];

	useEffect(() => {
		const duration = 2000; // 2 seconds
		const steps = 60;
		const increment = value / steps;
		const stepDuration = duration / steps;

		let currentStep = 0;
		const timer = setInterval(() => {
			currentStep++;
			if (currentStep <= steps) {
				setCount(Math.round(increment * currentStep));
			} else {
				setCount(value);
				clearInterval(timer);
			}
		}, stepDuration);

		return () => clearInterval(timer);
	}, [value]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.5,
				delay: delay,
				ease: 'easeOut',
			}}
			whileHover={{ 
				scale: 1.03,
				transition: { duration: 0.2 }
			}}
			className={`${colors.bg} ${colors.border} border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
					<motion.div
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ delay: delay + 0.2, duration: 0.3 }}
						className="flex items-baseline gap-2"
					>
						<h3 className={`text-4xl font-bold ${colors.text}`}>
							{count}
							{suffix}
						</h3>
					</motion.div>
				</div>
				<motion.div
					initial={{ scale: 0, rotate: -180 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{
						delay: delay + 0.3,
						duration: 0.5,
						type: 'spring',
						stiffness: 200,
					}}
					className={`${colors.iconBg} p-3 rounded-xl shadow-md`}
				>
					<Icon className="w-6 h-6 text-white" />
				</motion.div>
			</div>
		</motion.div>
	);
}
