import NotificationsPage from '@/components/common/NotificationsPage';

export default function AdminNotifications() {
  return <NotificationsPage role="admin" allowedRoles={['admin']} />;
}
