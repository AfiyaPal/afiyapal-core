import type { Metadata } from "next";
import { AdminScopePage } from "@/features/admin/components/admin-scope-page";

export const metadata: Metadata = {
  title: "Admin Scope",
  description: "Stage 2 admin scope for AFIYAPAL."
};

export default function AdminPage() {
  return <AdminScopePage />;
}
