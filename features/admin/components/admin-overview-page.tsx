import { Activity, AlertTriangle, BookOpenCheck, CalendarCheck, ClipboardList, ShieldAlert, Stethoscope, Users } from "lucide-react";
import { AdminDashboardCard } from "./admin-dashboard-card";
import { AdminDataTable, type AdminTableColumn } from "./admin-data-table";
import { AdminRecentActivityFeed } from "./admin-recent-activity-feed";
import { AdminSectionHeader } from "./admin-section-header";
import { AdminStatusBadge } from "./admin-status-badge";
import type { getAdminOverviewDashboardData } from "@/features/admin/queries/get-admin-overview-dashboard-data";

type AdminOverviewData = Awaited<ReturnType<typeof getAdminOverviewDashboardData>>;

type MetricRow = {
  metric: string;
  value: string;
  owner: string;
  note: string;
  status: "Live" | "Needs data" | "Ready";
};

const metricColumns: readonly AdminTableColumn<MetricRow>[] = [
  { key: "metric", header: "Metric", render: (row) => <span className="font-bold text-slate-950">{row.metric}</span> },
  { key: "value", header: "Current value", render: (row) => <span className="text-base font-black text-slate-950">{row.value}</span> },
  { key: "owner", header: "Owner", render: (row) => row.owner },
  { key: "note", header: "Why it matters", render: (row) => row.note },
  { key: "status", header: "Status", render: (row) => <AdminStatusBadge tone={row.status === "Live" ? "green" : row.status === "Ready" ? "slate" : "amber"}>{row.status}</AdminStatusBadge> }
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

export function AdminOverviewPage({ data }: { data: AdminOverviewData }) {
  const { totals } = data;

  const cardItems = [
    {
      label: "Total registered users",
      value: formatNumber(totals.totalUsers),
      helper: "All AFIYAPAL accounts created on the platform.",
      icon: Users
    },
    {
      label: "Active users today",
      value: formatNumber(totals.activeToday),
      helper: "Users with recent account activity in the last 24 hours.",
      icon: Activity
    },
    {
      label: "Active users this week",
      value: formatNumber(totals.activeWeek),
      helper: "Users active within the last 7 days.",
      icon: Activity
    },
    {
      label: "Active users this month",
      value: formatNumber(totals.activeMonth),
      helper: "Users active within the last 30 days.",
      icon: Activity
    },
    {
      label: "Symptom checks",
      value: formatNumber(totals.totalSymptomChecks),
      helper: "Logged AI symptom checker interactions.",
      icon: ClipboardList
    },
    {
      label: "Consultation requests",
      value: formatNumber(totals.totalConsultationRequests),
      helper: "User requests waiting for care coordination or doctor assignment.",
      icon: CalendarCheck
    },
    {
      label: "Pending doctor verifications",
      value: formatNumber(totals.pendingDoctorVerifications),
      helper: "Doctor applications that need verification review.",
      icon: Stethoscope
    },
    {
      label: "Flagged AI interactions",
      value: formatNumber(totals.flaggedAiInteractions),
      helper: "Open or in-review AI safety flags.",
      icon: ShieldAlert
    },
    {
      label: "Emergency-risk interactions",
      value: formatNumber(totals.emergencyRiskInteractions),
      helper: "Symptom checks classified as emergency risk.",
      icon: AlertTriangle
    },
    {
      label: "Published articles",
      value: formatNumber(totals.publishedArticles),
      helper: "Public health education articles currently published.",
      icon: BookOpenCheck
    }
  ];

  const metricRows: MetricRow[] = [
    { metric: "Total registered users", value: formatNumber(totals.totalUsers), owner: "Support Admin", note: "Tracks platform adoption and user base growth.", status: "Live" },
    { metric: "Active users today/week/month", value: `${formatNumber(totals.activeToday)} / ${formatNumber(totals.activeWeek)} / ${formatNumber(totals.activeMonth)}`, owner: "Super Admin", note: "Uses recent user account activity until a dedicated analytics event stream is added.", status: "Live" },
    { metric: "Symptom checks completed", value: formatNumber(totals.totalSymptomChecks), owner: "Medical Reviewer", note: "Core usage metric for the AI health assistant.", status: totals.totalSymptomChecks > 0 ? "Live" : "Needs data" },
    { metric: "Consultation requests", value: formatNumber(totals.totalConsultationRequests), owner: "Support Admin", note: "Shows demand for doctor connection workflows.", status: totals.totalConsultationRequests > 0 ? "Live" : "Needs data" },
    { metric: "Pending doctor verifications", value: formatNumber(totals.pendingDoctorVerifications), owner: "Doctor Manager", note: "Highlights provider applications awaiting approval.", status: totals.pendingDoctorVerifications > 0 ? "Live" : "Ready" },
    { metric: "Flagged AI interactions", value: formatNumber(totals.flaggedAiInteractions), owner: "Medical Reviewer", note: "Surfaces AI responses requiring safety or quality review.", status: totals.flaggedAiInteractions > 0 ? "Live" : "Ready" },
    { metric: "Emergency-risk interactions", value: formatNumber(totals.emergencyRiskInteractions), owner: "Medical Reviewer", note: "Helps prioritize critical cases that should be guided toward urgent care.", status: totals.emergencyRiskInteractions > 0 ? "Live" : "Ready" },
    { metric: "Published articles", value: formatNumber(totals.publishedArticles), owner: "Content Manager", note: "Measures currently public health education content.", status: totals.publishedArticles > 0 ? "Live" : "Ready" }
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-theme-border bg-gradient-to-br from-theme-primary-light via-theme-surface to-theme-accent/10 p-6 shadow-sm md:p-8">
        <AdminSectionHeader
          eyebrow="AFIYAPAL Admin Overview"
          title="Operational dashboard for safety, care, and platform growth."
          description="Phase 4 connects the admin landing page to real dashboard metrics and a recent activity feed so the team can monitor AFIYAPAL from one place."
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cardItems.map((item) => {
          const Icon = item.icon;
          return (
            <AdminDashboardCard key={item.label} label={item.label} value={item.value} helper={item.helper} icon={<Icon aria-hidden="true" className="size-5" />} />
          );
        })}
      </section>

      <AdminRecentActivityFeed items={data.recentActivity} />

      <AdminDataTable
        title="Overview metric ownership"
        description="Each metric belongs to a clear admin responsibility so the dashboard supports real operational follow-up."
        columns={metricColumns}
        rows={metricRows}
      />
    </div>
  );
}
