import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminUsersPage } from "@/features/admin/components/users/admin-users-page";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const currentUser = await requireAnyAdminPermission(adminModulePermissions["users"]);
  const params = (await searchParams) ?? {};

  return (
    <AdminUsersPage
      currentUserRole={currentUser.role}
      searchParams={{
        search: first(params.search),
        role: first(params.role),
        status: first(params.status)
      }}
    />
  );
}
