'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import MeetingsContainer from '@/components/meetings/MeetingsContainer';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function ConvenerMeetingsPage() {
	const { loading } = useAuthGuard({ allowedRoles: ['convener'] });

	if (loading) {
		return (
			<DashboardLayout role="convener">
				<div className="flex items-center justify-center h-full">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
