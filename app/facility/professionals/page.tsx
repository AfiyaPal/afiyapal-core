import { getCurrentUser } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { getFacilityByAdminId, getAvailableDoctors } from "@/features/facility/queries/get-facility-data";
import { AddProfessionalForm } from "@/features/facility/components/facility-professionals-page";
import { RemoveProfessionalButton } from "@/features/facility/components/facility-actions";

export const metadata = { title: "Professionals" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACILITY_ADMIN") redirect(routes.login);

  const facility = await getFacilityByAdminId(user.id);
  if (!facility) redirect(routes.facilityDashboard);

  const availableDoctors = await getAvailableDoctors();
  const isVerified = facility.verificationStatus === "VERIFIED";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Professionals</h1>
        <p className="mt-1 text-sm text-slate-600">Manage doctors and health professionals under your facility.</p>
      </div>

      {isVerified ? (
        <>
          <div>
            <h2 className="text-lg font-black text-slate-950">Add professional</h2>
            <p className="mt-1 text-sm text-slate-600">Link a verified doctor to your facility.</p>
            <div className="mt-3">
              <AddProfessionalForm availableDoctors={availableDoctors} verificationStatus={facility.verificationStatus} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-950">Current professionals</h2>
            <div className="mt-3">
              {facility.professionals.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">No professionals added yet.</p>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-emerald-100 text-left text-sm">
                    <thead className="bg-emerald-50/70 text-xs uppercase tracking-wide text-brand-700">
                      <tr>
                        <th className="px-5 py-3 font-black">Name</th>
                        <th className="px-5 py-3 font-black">Specialty</th>
                        <th className="px-5 py-3 font-black">Role</th>
                        <th className="px-5 py-3 font-black">Status</th>
                        <th className="px-5 py-3 font-black">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50">
                      {facility.professionals.map((p: { id: number; doctorProfile: { id: number; fullName: string; specialty: string | null; verificationStatus: string }; role: string }) => (
                        <tr key={p.id} className="transition hover:bg-emerald-50/40">
                          <td className="px-5 py-4 font-bold text-slate-950">{p.doctorProfile.fullName}</td>
                          <td className="px-5 py-4 text-slate-600">{p.doctorProfile.specialty ?? "\u2014"}</td>
                          <td className="px-5 py-4 text-slate-600">{p.role.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                          <td className="px-5 py-4 text-slate-600">{p.doctorProfile.verificationStatus}</td>
                          <td className="px-5 py-4"><RemoveProfessionalButton professionalId={p.id} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-8 text-center shadow-sm">
          <h2 className="text-lg font-black text-amber-900">Professionals — Pending Verification</h2>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            {facility.verificationStatus === "PENDING" && <>Professional management is available once your facility is verified. This typically takes 1–2 business days.</>}
            {facility.verificationStatus === "REJECTED" && <>Your facility verification was not approved. Please contact support.</>}
            {facility.verificationStatus === "SUSPENDED" && <>Your facility has been suspended. Please contact support.</>}
          </p>
        </div>
      )}
    </div>
  );
}
