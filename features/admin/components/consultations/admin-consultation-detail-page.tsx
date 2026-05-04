import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { getAdminConsultationDetail } from "@/features/admin/queries/get-admin-consultations";
import { assignConsultationDoctorAction, updateConsultationNotesAction, updateConsultationStatusAction } from "@/features/admin/actions/admin-consultation-actions";
import { CONSULTATION_STATUSES, consultationStatusLabel, consultationStatusTone, consultationUrgencyLabel, consultationUrgencyTone } from "@/features/admin/data/consultation-management";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function languageLabel(value: string | null | undefined) {
  if (value === "sw") return "Swahili";
  return "English";
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-emerald-50/60 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-brand-700">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function FormCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export async function AdminConsultationDetailPage({ requestId }: { requestId: number }) {
  const detail = await getAdminConsultationDetail(requestId);
  if (!detail) notFound();

  const { request, user, assignedDoctor, verifiedDoctors } = detail;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Consultation detail"
          title={`Consultation request #${request.id}`}
          description="Privacy-safe care coordination view. Admins can assign verified doctors, update request status, and maintain internal notes without exposing raw AI conversations by default."
        />
        <Link href={routes.adminConsultations} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-brand-600 hover:text-brand-700">
          Back to consultations
        </Link>
      </div>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-emerald-100 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">Created {formatDateTime(request.createdAt)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <AdminStatusBadge tone={consultationUrgencyTone(request.urgencyLevel)}>{consultationUrgencyLabel(request.urgencyLevel)}</AdminStatusBadge>
              <AdminStatusBadge tone={consultationStatusTone(request.status)}>{consultationStatusLabel(request.status)}</AdminStatusBadge>
              <AdminStatusBadge tone={request.assignedDoctorId ? "blue" : "amber"}>{request.assignedDoctorId ? "Assigned" : "Unassigned"}</AdminStatusBadge>
            </div>
          </div>
          {user ? (
            <Link href={`${routes.adminUsers}/${user.id}`} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800">
              View user profile
            </Link>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="Reason summary" value={request.reasonSummary} />
          <DetailItem label="Preferred language" value={languageLabel(request.preferredLanguage)} />
          <DetailItem label="Country / region" value={request.countryRegion || "Not provided"} />
          <DetailItem label="Requested specialty" value={request.requestedSpecialty || "General clinician"} />
          <DetailItem label="Date created" value={formatDateTime(request.createdAt)} />
          <DetailItem label="Last updated" value={formatDateTime(request.updatedAt)} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Patient summary</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Basic account details only. Health conversation details remain outside this view unless reviewed through safety workflows.</p>
          {user ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <DetailItem label="Name" value={user.username} />
              <DetailItem label="Email" value={user.email} />
              <DetailItem label="Phone" value={user.phone || "Not provided"} />
              <DetailItem label="Account status" value={user.status} />
            </div>
          ) : (
            <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">This request is not linked to a registered user.</p>
          )}
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Assigned doctor</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Only verified doctors can be assigned to consultation requests.</p>
          {assignedDoctor ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <DetailItem label="Name" value={assignedDoctor.fullName} />
              <DetailItem label="Specialty" value={assignedDoctor.specialty || "Not provided"} />
              <DetailItem label="Country / region" value={[assignedDoctor.country, assignedDoctor.cityRegion].filter(Boolean).join(" / ") || "Not provided"} />
              <DetailItem label="Availability" value={assignedDoctor.availabilityStatus} />
            </div>
          ) : (
            <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">No doctor is assigned yet.</p>
          )}
        </section>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <FormCard title="Assign verified doctor" description="Choose a verified doctor, or clear the assignment to return the request to awaiting assignment.">
          <form action={assignConsultationDoctorAction} className="space-y-4">
            <input type="hidden" name="requestId" value={request.id} />
            <select name="assignedDoctorId" defaultValue={request.assignedDoctorId ?? ""} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-brand-600">
              <option value="">Unassigned</option>
              {verifiedDoctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullName} — {doctor.specialty || "General"}{doctor.country ? ` · ${doctor.country}` : ""}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800">Save assignment</button>
          </form>
        </FormCard>

        <FormCard title="Change status" description="Track the request from new intake to assignment, doctor acceptance, completion, cancellation, or escalation.">
          <form action={updateConsultationStatusAction} className="space-y-4">
            <input type="hidden" name="requestId" value={request.id} />
            <select name="status" defaultValue={request.status} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-brand-600">
              {CONSULTATION_STATUSES.map((status) => <option key={status} value={status}>{consultationStatusLabel(status)}</option>)}
            </select>
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800">Save status</button>
          </form>
        </FormCard>

        <FormCard title="Internal notes" description="Keep admin-only coordination notes. Do not paste full private health conversations here.">
          <form action={updateConsultationNotesAction} className="space-y-4">
            <input type="hidden" name="requestId" value={request.id} />
            <textarea name="adminNotes" defaultValue={request.adminNotes ?? ""} rows={7} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600" placeholder="Add assignment notes, follow-up details, or care coordination context..." />
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800">Save notes</button>
          </form>
        </FormCard>
      </section>
    </div>
  );
}
