'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedKPICardProps {
	title: string;
	value: number;
	icon: LucideIcon;
	color: 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'red';
	delay?: number;
	suffix?: string;
}

const colorClasses = {
	blue: {
		card: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800',
		glow: 'shadow-blue-500/40',
		iconBg: 'bg-white/20',
		bar: 'bg-white/40',
		barFill: 'bg-white',
		accent: 'text-blue-200',
	},
	green: {
		card: 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700',
		glow: 'shadow-emerald-500/40',
		iconBg: 'bg-white/20',
		bar: 'bg-white/40',
		barFill: 'bg-white',
		accent: 'text-green-200',
	},
	purple: {
		card: 'bg-gradient-to-br from-violet-600 via-purple-700 to-purple-900',
		glow: 'shadow-purple-500/40',
		iconBg: 'bg-white/20',
		bar: 'bg-white/40',
		barFill: 'bg-white',
		accent: 'text-purple-200',
	},
	orange: {
		card: 'bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700',
		glow: 'shadow-orange-500/40',
		iconBg: 'bg-white/20',
		bar: 'bg-white/40',
		barFill: 'bg-white',
		accent: 'text-orange-200',
	},
	teal: {
		card: 'bg-gradient-to-br from-teal-500 via-cyan-600 to-teal-800',
		glow: 'shadow-teal-500/40',
		iconBg: 'bg-white/20',
		bar: 'bg-white/40',
		barFill: 'bg-white',
		accent: 'text-teal-200',
	},
	red: {
		card: 'bg-gradient-to-br from-rose-500 via-red-600 to-rose-800',
		glow: 'shadow-red-500/40',
		iconBg: 'bg-white/20',
		bar: 'bg-white/40',
		barFill: 'bg-white',
		accent: 'text-red-200',
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
	const [barWidth, setBarWidth] = useState(0);
	const colors = colorClasses[color];

	useEffect(() => {
		const duration = 1800;
		const steps = 60;
		const increment = value / steps;
		const stepDuration = duration / steps;
		let currentStep = 0;
		const timer = setInterval(() => {
			currentStep++;
			if (currentStep <= steps) {
				setCount(Math.round(increment * currentStep));
				setBarWidth(Math.min(100, Math.round((currentStep / steps) * 100)));
			} else {
				setCount(value);
				setBarWidth(100);
				clearInterval(timer);
			}
		}, stepDuration);
		return () => clearInterval(timer);
	}, [value]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 28, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.5, delay, ease: 'easeOut' }}
			whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.2 } }}
			className={`relative overflow-hidden rounded-2xl p-5 ${colors.card} shadow-xl ${colors.glow} cursor-default select-none`}
		>
			{/* Decorative blur circle */}
			<div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
			<div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-black/10 blur-2xl pointer-events-none" />

			{/* Top row: title + icon */}
			<div className="flex items-start justify-between mb-4">
				<p className={`text-xs font-semibold uppercase tracking-widest ${colors.accent}`}>
					{title}
				</p>
				<motion.div
					initial={{ rotate: -20, scale: 0 }}
					animate={{ rotate: 0, scale: 1 }}
					transition={{ delay: delay + 0.3, type: 'spring', stiffness: 220 }}
					className={`${colors.iconBg} backdrop-blur-sm p-2.5 rounded-xl border border-white/20`}
				>
					<Icon className="w-5 h-5 text-white" />
				</motion.div>
			</div>

			{/* Value */}
			<motion.p
				initial={{ scale: 0.7, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: delay + 0.15, duration: 0.4 }}
				className="text-4xl font-extrabold text-white tracking-tight"
			>
				{count}{suffix}
			</motion.p>

			{/* Progress bar */}
			<div className={`mt-4 h-1.5 rounded-full ${colors.bar} overflow-hidden`}>
				<motion.div
					initial={{ width: '0%' }}
					animate={{ width: `${barWidth}%` }}
					transition={{ duration: 1.8, delay: delay, ease: 'easeOut' }}
					className={`h-full rounded-full ${colors.barFill}`}
				/>
			</div>
		</motion.div>
	);
}
