"use client";

import { useRef, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { updateUserRoleAction } from "@/features/admin/actions/admin-user-actions";

type RoleOption = { value: string; label: string };

function getRoleConfirmationMessage(label: string) {
  if (label === "Super Admin") return "give this user full platform authority as Super Admin?";
  if (label === "Admin") return "grant this user Admin access?";
  return `set this user's role to ${label}?`;
}

export function RoleChangeForm({ userId, currentRole, options, canAssignAdminRoles }: {
  userId: number;
  currentRole: string;
  options: RoleOption[];
  canAssignAdminRoles: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedLabel = options.find((o) => o.value === selectedRole)?.label ?? selectedRole;
  const isAdminRole = selectedRole !== "USER" && selectedRole !== "DOCTOR";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isAdminRole && selectedRole !== currentRole) {
      setShowConfirm(true);
      return;
    }
    formRef.current?.requestSubmit();
  }

  function handleConfirm() {
    setShowConfirm(false);
    formRef.current?.requestSubmit();
  }

  return (
    <>
      <form ref={formRef} action={updateUserRoleAction} onSubmit={handleSubmit} className="flex gap-2">
        <input type="hidden" name="userId" value={userId} />
        <select
          name="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="min-w-0 flex-1 rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-brand-600"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.value !== "USER" && option.value !== "DOCTOR" && !canAssignAdminRoles}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white transition hover:bg-slate-800">
          Save
        </button>
      </form>

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm role change">
        <p className="text-sm leading-6 text-slate-200">
          Are you sure you want to {getRoleConfirmationMessage(selectedLabel)}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          This action will be logged in the admin audit trail.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="rounded-full border border-brand-700 px-4 py-2 text-sm font-bold text-brand-200 transition hover:bg-brand-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-full bg-white px-4 py-2 text-sm font-black text-brand-900 transition hover:bg-slate-100"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
}
