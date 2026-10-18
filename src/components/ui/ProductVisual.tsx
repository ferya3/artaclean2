/**
 * تصویرسازی محصول.
 *
 * تا وقتی عکس واقعی محصول نداریم، placeholder خاکستری بدترین انتخاب است:
 * کل صفحه را بی‌روح می‌کند و ساختار را هم درست نشان نمی‌دهد. به‌جایش برای هر
 * دسته یک تصویر برداری line-art از خود دستگاه رسم می‌شود — سبک، بدون درخواست
 * شبکه، و متناسب با تم روشن و عمیق.
 *
 * هنگام اتصال به کاتالوگ واقعی، این کامپوننت با <Image> جایگزین می‌شود و
 * همین‌جا به‌عنوان fallback تصویر ناموجود باقی می‌ماند.
 */

interface Props {
  kind: string;
  /** برای اسکرابر و سویپر، مدل سرنشین‌دار شکل متفاوتی دارد. */
  variant?: "walk-behind" | "ride-on" | "robotic" | "stationary" | "handheld";
  tone?: "light" | "deep";
  ratio?: string;
  className?: string;
  label?: string;
  /**
   * مقیاس تصویر (۰.۸ تا ۱.۱۵). از کلاس واقعی دستگاه می‌آید، نه تصادفی —
   * تا در فهرست، دستگاه بزرگ‌تر واقعاً بزرگ‌تر دیده شود.
   */
  scale?: number;
  /** تصویر واقعی محصول. اگر باشد، جای تصویر برداری را می‌گیرد. */
  src?: string;
  /**
   * نوع برس. شکل ابزار کف را تعیین می‌کند — دیسکی، رولی یا اوربیتال.
   * تفاوت بین مدل‌های هم‌دسته از همین می‌آید، نه از یک واریانت تصادفی:
   * S500 دیسکی است و S700 رولی، پس باید متفاوت هم دیده شوند.
   */
  brush?: "disc" | "cylindrical" | "orbital" | "none";
}

const S = { fill: "none", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default function ProductVisual({
  kind,
  variant,
  tone = "light",
  ratio = "aspect-[4/3]",
  className = "",
  label,
  scale = 1,
  brush = "disc",
  src,
}: Props) {
  const deep = tone === "deep";
  const s = Math.max(0.8, Math.min(1.15, scale));

  if (src) {
    return (
      <div className={`relative overflow-hidden ${ratio} ${className}`}>
        {/* تصویر آپلودی ابعاد از پیش معلومی ندارد و قبلاً به WebP بهینه شده؛
            next/image اینجا فقط پیکربندی اضافه می‌خواهد بدون سود واقعی. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label ? `تصویر ${label}` : "تصویر دستگاه"}
          loading="lazy"
          className={`h-full w-full object-cover ${deep ? "" : "bg-surface"}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${ratio} ${className}`}
      role="img"
      aria-label={label ? `تصویر ${label}` : "تصویر دستگاه"}
    >
      {/* بستر: گرادیان + شبکه مهندسی + هاله رنگ برند */}
      <div
        className={`absolute inset-0 ${
          deep
            ? "bg-[radial-gradient(120%_100%_at_20%_0%,rgb(33_38_46)_0%,rgb(12_14_18)_70%)]"
            : "bg-[linear-gradient(150deg,rgb(255_255_255)_0%,rgb(238_239_235)_100%)]"
        }`}
      />
      <div className={`absolute inset-0 ${deep ? "blueprint" : "blueprint-light"}`} />
      {/* هاله رنگ برند فقط روی سطح عمیق؛ روی سطح روشن، کل کارت را صورتی می‌کرد. */}
      {deep && (
        <div
          className="glow absolute -top-10 start-1/4 h-40 w-40 opacity-30"
          style={{ background: "rgb(var(--c-accent))" }}
        />
      )}

      <svg
        viewBox="0 0 420 300"
        className={`absolute inset-0 h-full w-full ${deep ? "text-white/70" : "text-ink/70"}`}
        aria-hidden
      >
        <defs>
          <linearGradient id="pv-accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(255 106 26)" />
            <stop offset="100%" stopColor="rgb(226 74 8)" />
          </linearGradient>
        </defs>

        {/* سایه زمین */}
        <ellipse
          cx="210"
          cy="256"
          rx="132"
          ry="11"
          fill="currentColor"
          opacity={deep ? 0.16 : 0.09}
        />

        <g
          stroke="currentColor"
          {...S}
          /* ضریب ۱.۲۲ پایه: طرح‌ها با فاصله امن رسم شده‌اند و بدون آن،
             دستگاه در کادر کوچک و گم‌شده دیده می‌شود. */
          transform={`translate(210 186) scale(${(s * 1.22).toFixed(3)}) translate(-210 -186)`}
        >
          <Machine kind={kind} variant={variant} brush={brush} />
        </g>
      </svg>
    </div>
  );
}

function Machine({
  kind,
  variant,
  brush = "disc",
}: {
  kind: string;
  variant?: Props["variant"];
  brush?: Props["brush"];
}) {
  if (kind === "floor-scrubbers") {
    return variant === "ride-on" ? <RideOnScrubber brush={brush} /> : <WalkBehindScrubber brush={brush} />;
  }
  if (kind === "sweepers") return variant === "ride-on" ? <RideOnSweeper /> : <WalkBehindSweeper />;
  if (kind === "industrial-vacuum-cleaners") return <Vacuum />;
  if (kind === "pressure-washers") return <PressureWasher />;
  if (kind === "steam-cleaners") return <SteamCleaner />;
  if (kind === "carpet-extractors") return <Extractor />;
  if (kind === "single-disc-machines") return <SingleDisc />;
  if (kind === "robotic-cleaning") return <RobotScrubber />;
  if (kind === "cleaning-chemicals") return <ChemicalDrum />;
  if (kind === "accessories") return <Accessory />;
  return <WalkBehindScrubber />;
}

/* ------------------------------------------------------------------ چرخ‌ها */

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} />
      <circle cx={cx} cy={cy} r={r * 0.34} />
    </>
  );
}

/* --------------------------------------------------------------- ابزار کف */

/**
 * ابزار کف بر اساس نوع برس.
 * disc: دیسک گرد · cylindrical: رول کشیده · orbital: صفحه مستطیلی
 */
function BrushTool({
  cx,
  cy,
  width,
  brush,
}: {
  cx: number;
  cy: number;
  width: number;
  brush?: Props["brush"];
}) {
  const half = width / 2;

  if (brush === "cylindrical") {
    return (
      <>
        <path
          d={`M${cx - half} ${cy - 12} h${width} a12 12 0 0 1 0 24 h-${width} a12 12 0 0 1 0-24 z`}
        />
        <path
          d={Array.from({ length: 7 }, (_, i) => {
            const x = cx - half + 6 + (i * (width - 12)) / 6;
            return `M${x} ${cy - 12} v24`;
          }).join(" ")}
          opacity="0.55"
        />
      </>
    );
  }

  if (brush === "orbital") {
    return (
      <>
        <rect x={cx - half} y={cy - 11} width={width} height="22" rx="5" />
        <rect x={cx - half + 7} y={cy - 5} width={width - 14} height="10" rx="3" opacity="0.45" />
      </>
    );
  }

  return (
    <>
      <ellipse cx={cx} cy={cy + 6} rx={half} ry="13" />
      <ellipse cx={cx} cy={cy} rx={half} ry="13" opacity="0.45" />
      <path
        d={`M${cx - half + 6} ${cy + 3} v7 M${cx - half / 2} ${cy + 7} v8 M${cx} ${cy + 8} v8 M${cx + half / 2} ${cy + 7} v8 M${cx + half - 6} ${cy + 3} v7`}
        opacity="0.6"
      />
    </>
  );
}

/* ------------------------------------------------------------- اسکرابر دستی */

/**
 * اسکرابر دستی.
 * شکل مخزن و دسته ثابت است؛ آنچه بین مدل‌ها فرق می‌کند ابزار کف و اندازه کلی
 * است — دقیقاً همان چیزی که در دنیای واقعی هم فرق می‌کند.
 */
function WalkBehindScrubber({ brush }: { brush?: Props["brush"] }) {
  const wide = brush === "cylindrical";
  const tankEnd = wide ? 252 : 240;
  const toolWidth = wide ? 104 : brush === "orbital" ? 74 : 88;

  return (
    <>
      {/* مخزن */}
      <path
        d={`M112 128 h${tankEnd - 112} a16 16 0 0 1 16 16 v58 a10 10 0 0 1-10 10 H112 a12 12 0 0 1-12-12 v-60 a12 12 0 0 1 12-12 z`}
      />
      {/* پنل بالایی — قطعه رنگی */}
      <path
        d="M124 112 h74 a10 10 0 0 1 10 10 v6 H114 v-6 a10 10 0 0 1 10-10 z"
        fill="url(#pv-accent)"
        stroke="none"
      />
      {/* سطح آب داخل مخزن */}
      <path d={`M112 178 h${tankEnd - 104}`} opacity="0.4" strokeDasharray="6 7" />
      {/* دسته */}
      <path d={`M${tankEnd + 12} 146 L318 96`} strokeWidth="7" />
      <path d="M304 86 L336 108" strokeWidth="7" />
      <rect x="286" y="98" width="26" height="18" rx="5" transform="rotate(-38 299 107)" />
      {/* تیغه مکش پشت */}
      <path d="M250 212 l24 14 h-14" />
      <path d="M244 226 h42" strokeWidth="5" />
      {/* ابزار کف */}
      <BrushTool cx={152} cy={216} width={toolWidth} brush={brush} />
      {/* چرخ */}
      <Wheel cx={252} cy={200} r={17} />
      {/* پاشش آب */}
      <path d="M104 196 q-14 6 -18 18" opacity="0.35" />
      <path d="M110 204 q-12 4 -15 14" opacity="0.25" />
    </>
  );
}

/* -------------------------------------------------------- اسکرابر سرنشین‌دار */

function RideOnScrubber({ brush }: { brush?: Props["brush"] }) {
  return (
    <>
      {/* بدنه */}
      <path d="M96 150 h150 a14 14 0 0 1 14 14 v46 a10 10 0 0 1-10 10 H92 a12 12 0 0 1-12-12 v-46 a12 12 0 0 1 12-12 z" />
      {/* صندلی */}
      <path d="M196 150 v-30 a10 10 0 0 1 10-10 h20 a8 8 0 0 1 8 8 v32" />
      <path d="M188 150 h56" strokeWidth="6" />
      {/* ستون فرمان */}
      <path d="M150 148 L136 100" strokeWidth="6" />
      <path d="M118 96 h36" strokeWidth="6" />
      <circle cx="136" cy="96" r="5" fill="url(#pv-accent)" stroke="none" />
      {/* نوار رنگی بدنه */}
      <path d="M88 176 h164" stroke="url(#pv-accent)" strokeWidth="6" />
      {/* دک برس */}
      <BrushTool cx={140} cy={222} width={104} brush={brush} />
      {/* تیغه مکش */}
      <path d="M258 214 l22 12 h-12" />
      <path d="M252 228 h44" strokeWidth="5" />
      {/* چرخ‌ها */}
      <Wheel cx={252} cy={204} r={20} />
      <Wheel cx={100} cy={210} r={14} />
      {/* چراغ ایمنی */}
      <path d="M232 118 v-14" />
      <circle cx="232" cy="98" r="7" fill="url(#pv-accent)" stroke="none" />
    </>
  );
}

/* ------------------------------------------------------------ سویپر دستی */

function WalkBehindSweeper() {
  return (
    <>
      {/* مخزن ضایعات */}
      <path d="M120 132 h120 a14 14 0 0 1 14 14 v50 a10 10 0 0 1-10 10 H118 a12 12 0 0 1-12-12 v-50 a12 12 0 0 1 14-12 z" />
      <path d="M124 148 h74" stroke="url(#pv-accent)" strokeWidth="6" />
      {/* درپوش فیلتر */}
      <path d="M144 132 v-14 h72 v14" />
      {/* دسته */}
      <path d="M250 152 L316 104" strokeWidth="7" />
      <path d="M302 94 L334 116" strokeWidth="7" />
      {/* برس اصلی */}
      <ellipse cx="176" cy="222" rx="52" ry="12" />
      <path d="M136 220 v8 M156 225 v9 M176 226 v9 M196 225 v9 M214 220 v8" opacity="0.6" />
      {/* برس کناری */}
      <circle cx="104" cy="216" r="24" />
      <path d="M104 192 v10 M128 216 h-10 M104 240 v-10 M80 216 h10 M121 199 l-7 7 M121 233 l-7-7 M87 233 l7-7 M87 199 l7 7" opacity="0.7" />
      <circle cx="104" cy="216" r="6" fill="url(#pv-accent)" stroke="none" />
      {/* چرخ */}
      <Wheel cx={246} cy={204} r={17} />
      {/* ذرات جمع‌شونده */}
      <path d="M74 244 h10 M92 250 h8 M60 234 h7" opacity="0.4" />
    </>
  );
}

function RideOnSweeper() {
  return (
    <>
      <path d="M92 144 h146 a16 16 0 0 1 16 16 v44 a10 10 0 0 1-10 10 H88 a12 12 0 0 1-12-12 v-46 a12 12 0 0 1 16-12 z" />
      {/* کابین */}
      <path d="M186 144 v-42 h52 a10 10 0 0 1 10 10 v32" />
      <path d="M196 112 h40 v26 h-40 z" opacity="0.45" />
      <path d="M84 172 h168" stroke="url(#pv-accent)" strokeWidth="6" />
      {/* مخزن قابل تخلیه */}
      <path d="M100 144 v-26 h64 v26" />
      {/* برس کناری بزرگ */}
      <circle cx="90" cy="214" r="26" />
      <path d="M90 188 v11 M116 214 h-11 M90 240 v-11 M64 214 h11 M108 196 l-8 8 M108 232 l-8-8 M72 232 l8-8 M72 196 l8 8" opacity="0.7" />
      <Wheel cx={238} cy={210} r={24} />
      <Wheel cx={120} cy={214} r={16} />
    </>
  );
}

/* ----------------------------------------------------------- مکنده صنعتی */

function Vacuum() {
  return (
    <>
      {/* سر موتور */}
      <path d="M152 96 h108 a14 14 0 0 1 14 14 v22 H138 v-22 a14 14 0 0 1 14-14 z" />
      <path d="M162 110 h48" stroke="url(#pv-accent)" strokeWidth="6" />
      {/* قفل‌های جانبی */}
      <path d="M138 138 h-12 v18 h12 M274 138 h12 v18 h-12" />
      {/* مخزن */}
      <path d="M140 132 h132 v88 a14 14 0 0 1-14 14 H154 a14 14 0 0 1-14-14 z" />
      <path d="M140 190 h132" opacity="0.35" strokeDasharray="6 7" />
      {/* شیلنگ */}
      <path d="M274 118 q52 6 56 52 q4 40-34 46" strokeWidth="6" opacity="0.9" />
      <path d="M290 224 l14 12 l-16 8" strokeWidth="5" />
      {/* چرخ‌ها */}
      <Wheel cx={162} cy={244} r={14} />
      <Wheel cx={250} cy={244} r={14} />
      {/* جریان مکش */}
      <path d="M330 196 q10-10 8-24 M340 200 q14-12 12-30" opacity="0.3" />
    </>
  );
}

/* -------------------------------------------------------------- واترجت */

function PressureWasher() {
  return (
    <>
      {/* شاسی */}
      <path d="M116 140 h148 a14 14 0 0 1 14 14 v58 H102 v-58 a14 14 0 0 1 14-14 z" />
      {/* پمپ */}
      <path d="M132 158 h64 v40 h-64 z" />
      <path d="M140 158 v-18 h20 v18" />
      <path d="M132 170 h64" stroke="url(#pv-accent)" strokeWidth="5" />
      {/* قرقره شیلنگ */}
      <circle cx="238" cy="178" r="26" />
      <circle cx="238" cy="178" r="9" />
      {/* دسته حمل */}
      <path d="M110 140 L96 104 h58" strokeWidth="6" />
      {/* شیلنگ و لنس */}
      <path d="M262 178 q46 4 54 34" strokeWidth="5" />
      <path d="M316 212 l30 22" strokeWidth="7" />
      <path d="M346 234 l14 10" strokeWidth="5" />
      {/* پاشش فشار بالا */}
      <path d="M362 246 l26 10 M362 250 l24 18 M364 242 l28 2" opacity="0.45" />
      {/* پایه‌ها */}
      <Wheel cx={122} cy={226} r={15} />
      <path d="M262 212 v18 h14" />
    </>
  );
}

/* ------------------------------------------------------------- بخارشوی */

function SteamCleaner() {
  return (
    <>
      <path d="M138 138 h136 a16 16 0 0 1 16 16 v58 a12 12 0 0 1-12 12 H134 a12 12 0 0 1-12-12 v-58 a16 16 0 0 1 16-16 z" />
      {/* بویلر */}
      <circle cx="176" cy="176" r="22" />
      <circle cx="176" cy="176" r="8" fill="url(#pv-accent)" stroke="none" />
      {/* گیج‌ها */}
      <circle cx="232" cy="164" r="11" />
      <path d="M232 164 l6-5" />
      <path d="M216 196 h56" stroke="url(#pv-accent)" strokeWidth="5" />
      {/* شیلنگ و نازل */}
      <path d="M290 156 q46 0 50 36" strokeWidth="6" />
      <path d="M340 192 l4 26 l-20 8" strokeWidth="5" />
      {/* بخار */}
      <path d="M312 208 q-16-14-6-30 q8-14-4-24" opacity="0.4" />
      <path d="M330 236 q18 4 26-8 q8-12 24-8" opacity="0.35" />
      <path d="M344 250 q16 6 26-2" opacity="0.25" />
      <Wheel cx={152} cy={236} r={13} />
      <Wheel cx={258} cy={236} r={13} />
    </>
  );
}

/* ---------------------------------------------------------- موکت‌شوی */

function Extractor() {
  return (
    <>
      {/* مخزن دوطبقه */}
      <path d="M146 120 h108 a14 14 0 0 1 14 14 v40 H132 v-40 a14 14 0 0 1 14-14 z" />
      <path d="M132 174 h136 v48 a14 14 0 0 1-14 14 H146 a14 14 0 0 1-14-14 z" />
      <path d="M146 140 h48" stroke="url(#pv-accent)" strokeWidth="6" />
      <path d="M132 200 h136" opacity="0.35" strokeDasharray="6 7" />
      {/* شیلنگ و وند */}
      <path d="M268 140 q50 8 52 46" strokeWidth="6" />
      <path d="M320 186 L344 236" strokeWidth="7" />
      <path d="M330 236 h30" strokeWidth="6" />
      {/* تزریق */}
      <path d="M338 244 q-4 8-14 10 M348 244 q0 10-8 14" opacity="0.4" />
      <Wheel cx={158} cy={244} r={13} />
      <Wheel cx={244} cy={244} r={13} />
    </>
  );
}

/* -------------------------------------------------------------- پولیشر */

function SingleDisc() {
  return (
    <>
      {/* دسته بلند */}
      <path d="M196 206 L292 96" strokeWidth="8" />
      <path d="M270 88 h44" strokeWidth="8" />
      <rect x="256" y="112" width="30" height="20" rx="6" transform="rotate(-48 271 122)" />
      {/* موتور */}
      <path d="M158 176 h76 a12 12 0 0 1 12 12 v18 h-100 v-18 a12 12 0 0 1 12-12 z" />
      <path d="M170 186 h40" stroke="url(#pv-accent)" strokeWidth="5" />
      {/* دیسک */}
      <ellipse cx="196" cy="222" rx="70" ry="20" />
      <ellipse cx="196" cy="214" rx="70" ry="20" opacity="0.4" />
      <ellipse cx="196" cy="216" rx="26" ry="8" opacity="0.55" />
      {/* چرخش */}
      <path d="M280 214 q10-14 0-26" opacity="0.4" />
      <path d="M280 188 l-8 4 l2-9" opacity="0.4" />
      {/* مخزن محلول */}
      <path d="M244 140 h32 v30 h-32 z" transform="rotate(-14 260 155)" opacity="0.8" />
    </>
  );
}

/* ---------------------------------------------------------------- ربات */

function RobotScrubber() {
  return (
    <>
      {/* بدنه کوتاه و عریض */}
      <path d="M104 162 h212 a16 16 0 0 1 16 16 v34 a12 12 0 0 1-12 12 H100 a12 12 0 0 1-12-12 v-34 a16 16 0 0 1 16-16 z" />
      {/* نمایشگر */}
      <rect x="128" y="176" width="58" height="24" rx="6" />
      <path d="M138 188 h24" stroke="url(#pv-accent)" strokeWidth="4" />
      {/* گنبد LiDAR */}
      <path d="M188 162 v-18 a26 26 0 0 1 52 0 v18" />
      <circle cx="214" cy="146" r="7" fill="url(#pv-accent)" stroke="none" />
      {/* پرتوهای اسکن */}
      <path d="M252 128 q34 6 44 34" opacity="0.4" />
      <path d="M262 112 q56 10 70 54" opacity="0.28" />
      <path d="M176 128 q-34 6-44 34" opacity="0.4" />
      <path d="M166 112 q-56 10-70 54" opacity="0.28" />
      {/* برس زیر بدنه */}
      <ellipse cx="200" cy="230" rx="56" ry="10" opacity="0.7" />
      <Wheel cx={124} cy={228} r={14} />
      <Wheel cx={296} cy={228} r={14} />
    </>
  );
}

/* ------------------------------------------------------------ مواد شوینده */

function ChemicalDrum() {
  return (
    <>
      {/* بشکه */}
      <path d="M150 108 h120 a10 10 0 0 1 10 10 v112 a14 14 0 0 1-14 14 H154 a14 14 0 0 1-14-14 V118 a10 10 0 0 1 10-10 z" />
      {/* درپوش */}
      <path d="M186 108 v-18 h34 v18" />
      <path d="M180 90 h46" strokeWidth="6" />
      {/* برچسب */}
      <rect x="162" y="146" width="96" height="56" rx="8" fill="url(#pv-accent)" stroke="none" opacity="0.9" />
      <path d="M176 166 h58 M176 180 h40" stroke="white" strokeWidth="4" opacity="0.85" />
      {/* دستگیره */}
      <path d="M280 132 q26 10 26 34 q0 24-26 32" strokeWidth="5" />
      {/* قطره */}
      <path d="M330 196 q10 14 0 20 q-10-6 0-20" opacity="0.5" />
    </>
  );
}

/* ----------------------------------------------------------- لوازم جانبی */

function Accessory() {
  return (
    <>
      {/* پد پایینی */}
      <ellipse cx="200" cy="220" rx="82" ry="24" />
      <ellipse cx="200" cy="204" rx="82" ry="24" opacity="0.45" />
      {/* برس بالایی */}
      <ellipse cx="212" cy="160" rx="66" ry="20" />
      <ellipse cx="212" cy="148" rx="66" ry="20" opacity="0.5" />
      <ellipse cx="212" cy="150" rx="22" ry="7" fill="url(#pv-accent)" stroke="none" />
      {/* موهای برس */}
      <path d="M154 158 v14 M176 166 v16 M198 168 v16 M220 168 v16 M242 166 v16 M264 158 v14" opacity="0.6" />
      {/* تیغه لاستیکی */}
      <path d="M96 128 q52-16 104 0" strokeWidth="6" />
      <path d="M96 128 v12 M200 128 v12" opacity="0.5" />
    </>
  );
}
