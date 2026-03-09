'use client';

import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import MeetingsContainer from '@/components/meetings/MeetingsContainer';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function StaffMeetingsPage() {
	const { loading } = useAuthGuard({ allowedRoles: ['staff'] });

	if (loading) {
		return (
			<DashboardLayout role="staff">
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
		<DashboardLayout role="staff">
			<MeetingsContainer role="staff" />
		</DashboardLayout>
	);
}
