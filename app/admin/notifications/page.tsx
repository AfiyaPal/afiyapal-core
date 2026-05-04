import { AdminNotificationsPage } from "@/features/admin/components/notifications/admin-notifications-page";
import { getAdminNotifications } from "@/features/admin/queries/get-admin-notifications";

export default async function AdminNotificationsRoute() {
  const data = await getAdminNotifications();
  return <AdminNotificationsPage notifications={data.notifications} unreadCount={data.unreadCount} />;
}
