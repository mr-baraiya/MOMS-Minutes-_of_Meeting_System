import NotificationsPage from '@/components/common/NotificationsPage';

export default function StaffNotifications() {
  return <NotificationsPage role="staff" allowedRoles={['staff']} />;
}
