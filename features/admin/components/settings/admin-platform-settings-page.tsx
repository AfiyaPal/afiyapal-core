import Link from "next/link";
import { routes } from "@/lib/routes";
import { updatePlatformSettingsAction } from "@/features/admin/actions/admin-settings-actions";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { getAdminPlatformSettings } from "@/features/admin/queries/get-admin-platform-settings";
import { PLATFORM_SETTING_KEYS, type PlatformSettingKey } from "@/features/admin/data/platform-settings";

const longPlatformSettingKeys: readonly PlatformSettingKey[] = [
  PLATFORM_SETTING_KEYS.EMERGENCY_MESSAGE_TEXT,
  PLATFORM_SETTING_KEYS.DOCTOR_VERIFICATION_REQUIREMENTS,
  PLATFORM_SETTING_KEYS.AI_DISCLAIMER_TEXT,
  PLATFORM_SETTING_KEYS.DEFAULT_CONSULTATION_URGENCY_RULES
];

function isLongSetting(key: PlatformSettingKey) {
  return longPlatformSettingKeys.includes(key);
}

export async function AdminPlatformSettingsPage() {
  const settings = await getAdminPlatformSettings();

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Admin settings"
        title="Configure platform safety defaults"
        description="Manage Stage 2 safety copy, supported languages, doctor verification rules, content review timing, and support contact information from one place."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Link href={routes.adminHealthResources} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Health resources</p>
          <h2 className="mt-3 text-xl font-black text-slate-950">Clinics, hotlines & contacts</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Manage country-specific clinics, hotlines, emergency contacts, and support resources.</p>
        </Link>
        <Link href={routes.adminMentalHealthResources} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Mental health</p>
          <h2 className="mt-3 text-xl font-black text-slate-950">Support resources</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Maintain mental-health-focused hotline and support resources used by companion oversight.</p>
        </Link>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Governance</p>
          <h2 className="mt-3 text-xl font-black text-slate-950">Audit-backed updates</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Platform setting changes are recorded in Super Admin audit logs for accountability.</p>
        </div>
      </div>

      <form action={updatePlatformSettingsAction} className="space-y-5 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-950">Platform settings</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">These are operational defaults for AI safety copy, escalation, doctor verification, and health content governance.</p>
        </div>

        <div className="grid gap-5">
          {settings.map((setting) => (
            <label key={setting.key} className="block space-y-2 text-sm font-bold text-slate-700">
              <span>{setting.label}</span>
              <span className="block text-xs font-semibold leading-5 text-slate-500">{setting.description}</span>
              {isLongSetting(setting.key) ? (
                <textarea
                  name={setting.key}
                  defaultValue={setting.value}
                  rows={4}
                  className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-700 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-emerald-100"
                />
              ) : (
                <input
                  name={setting.key}
                  defaultValue={setting.value}
                  type={setting.key === PLATFORM_SETTING_KEYS.CONTENT_REVIEW_INTERVAL_MONTHS ? "number" : setting.key === PLATFORM_SETTING_KEYS.SUPPORT_EMAIL ? "email" : "text"}
                  min={setting.key === PLATFORM_SETTING_KEYS.CONTENT_REVIEW_INTERVAL_MONTHS ? 1 : undefined}
                  max={setting.key === PLATFORM_SETTING_KEYS.CONTENT_REVIEW_INTERVAL_MONTHS ? 24 : undefined}
                  className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-emerald-100"
                />
              )}
              {setting.updatedAt ? <span className="block text-xs font-semibold text-slate-400">Last updated {setting.updatedAt.toLocaleDateString()}</span> : null}
            </label>
          ))}
        </div>

        <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">Save platform settings</button>
      </form>
    </div>
  );
}
