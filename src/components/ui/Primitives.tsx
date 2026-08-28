import Link from "next/link";

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="مسیر صفحه" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
            {i < trail.length - 1 && <span aria-hidden className="text-line">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {lead && <p className="mt-3 text-muted">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="shell py-10 sm:py-14">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{lead}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}

/**
 * جای تصویر محصول. عمداً به‌جای تصویر واقعی، یک نشانه هندسی می‌گذارد تا
 * ساختار صفحه بدون دارایی تصویری هم درست ارزیابی شود.
 */
export function ProductImage({
  label,
  ratio = "aspect-[4/3]",
  className = "",
}: {
  label: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative ${ratio} overflow-hidden rounded-card bg-gradient-to-br from-primary-soft to-canvas ${className}`}
      role="img"
      aria-label={`تصویر ${label}`}
    >
      <svg
        className="absolute inset-0 h-full w-full text-ink/[0.07]"
        aria-hidden
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <span className="text-center text-xs font-medium text-muted/70">{label}</span>
      </div>
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" }) {
  const cls =
    tone === "accent"
      ? "bg-accent-soft text-accent"
      : "bg-primary-soft text-ink/70";
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {children}
    </span>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="card px-6 py-16 text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
