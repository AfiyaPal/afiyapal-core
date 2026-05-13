type AdminSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function AdminSectionHeader({ eyebrow, title, description }: AdminSectionHeaderProps) {
  return (
    <div>
      {eyebrow ? <p className="text-sm font-bold uppercase tracking-wide text-theme-primary-dark">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-black tracking-tight text-theme-foreground md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{description}</p>
    </div>
  );
}
