import type { ReactNode } from "react";

export type AdminTableColumn<Row> = { key: string; header: string; render: (row: Row) => ReactNode };

type AdminDataTableProps<Row> = { title: string; description: string; columns: readonly AdminTableColumn<Row>[]; rows: readonly Row[]; emptyMessage?: string };

export function AdminDataTable<Row>({ title, description, columns, rows, emptyMessage = "No records found." }: AdminDataTableProps<Row>) {
  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="border-b border-emerald-100 p-5"><h2 className="text-lg font-black text-slate-950">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{description}</p></div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-emerald-100 text-left text-sm">
          <thead className="bg-emerald-50/70 text-xs uppercase tracking-wide text-brand-700"><tr>{columns.map((column) => <th key={column.key} className="px-5 py-3 font-black">{column.header}</th>)}</tr></thead>
          <tbody className="divide-y divide-emerald-50">
            {rows.length > 0 ? rows.map((row, index) => (<tr key={index} className="align-top transition hover:bg-emerald-50/40">{columns.map((column) => <td key={column.key} className="px-5 py-4 text-slate-700">{column.render(row)}</td>)}</tr>)) : (<tr><td colSpan={columns.length} className="px-5 py-10 text-center text-slate-500">{emptyMessage}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
