'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MeetingsContainer from '@/components/meetings/MeetingsContainer';
import { useAuthGuard } from '@/hooks/useAuthGuard';

function ConvenerMeetingsContent() {
	const { loading } = useAuthGuard({ allowedRoles: ['convener'] });

	if (loading) {
		return (
			<DashboardLayout role="convener">
				<div className="flex items-center justify-center h-full">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
						className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
					/>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout role="convener">
			<MeetingsContainer role="convener" />
		</DashboardLayout>
	);
}

export default function ConvenerMeetingsPage() {
	return (
		<Suspense fallback={
			<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
		}>
			<ConvenerMeetingsContent />
		</Suspense>
	);
}
