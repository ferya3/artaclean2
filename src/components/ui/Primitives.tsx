import Link from "next/link";

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="مسیر صفحه" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
            {i < trail.length - 1 && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-line" aria-hidden>
                <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            )}
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
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: React.ReactNode;
  tone?: "light" | "deep";
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="eyebrow-accent mb-3">
            <span className="h-px w-6 bg-accent" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h2 className="text-section font-extrabold text-balance">{title}</h2>
        {lead && (
          <p className={`mt-4 leading-8 ${tone === "deep" ? "text-white/60" : "text-muted"}`}>{lead}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/**
 * سربرگ صفحه.
 * نسخه deep برای صفحاتی که باید «وزن» داشته باشند (دسته‌بندی، راهکار، برند)
 * تا ورود به هر بخش، ریتم بصری خودش را داشته باشد.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
  tone = "deep",
  aside,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  tone?: "light" | "deep";
  aside?: React.ReactNode;
}) {
  if (tone === "light") {
    return (
      <header className="border-b border-line bg-surface">
        <div className="shell py-12 sm:py-16">
          {eyebrow && <p className="eyebrow-accent mb-3">{eyebrow}</p>}
          <h1 className="max-w-3xl text-hero font-extrabold text-balance">{title}</h1>
          {lead && <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{lead}</p>}
          {children && <div className="mt-7">{children}</div>}
        </div>
      </header>
    );
  }

  return (
    <header className="section-deep grain">
      <div
        className="glow -top-24 start-[12%] h-72 w-72 opacity-25"
        style={{ background: "rgb(var(--c-accent))" }}
      />
      <div className="absolute inset-0 blueprint opacity-70" aria-hidden />
      <div className="shell relative grid gap-10 py-14 sm:py-20 lg:grid-cols-12">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          {eyebrow && (
            <p className="eyebrow-accent mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-accent" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h1 className="text-hero font-extrabold text-white text-balance">{title}</h1>
          {lead && <p className="mt-5 max-w-2xl text-lg leading-9 text-white/60">{lead}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-5">{aside}</div>}
      </div>
    </header>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card px-6 py-20 text-center">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-ink/[0.04]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-lg font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">{body}</p>
      {action && <div className="mt-7 flex justify-center">{action}</div>}
    </div>
  );
}

/** نوار نسبت برای مقادیر عددی کارت محصول. */
export function SpecBar({ ratio }: { ratio: number }) {
  return (
    <div className="spec-bar mt-1.5">
      <span style={{ width: `${Math.max(6, Math.min(100, ratio * 100))}%` }} />
    </div>
  );
}
