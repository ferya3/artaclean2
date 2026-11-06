#!/usr/bin/env bash
#
# عیب‌یابی سرور آرتا کلین.
#
#   bash scripts/diagnose.sh            # پورت پیش‌فرض ۳۰۰۰
#   PORT=8080 bash scripts/diagnose.sh  # پورت دیگر
#
# هیچ چیزی را تغییر نمی‌دهد؛ فقط وضعیت را گزارش می‌کند.
# هر بخش یکی از علت‌های رایج «ناقص بالا آمدن سایت» را جدا تست می‌کند.

set -uo pipefail

PORT="${PORT:-3000}"
BASE="http://127.0.0.1:${PORT}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 1

RED=$'\033[31m'; GRN=$'\033[32m'; YLW=$'\033[33m'; DIM=$'\033[2m'; BLD=$'\033[1m'; RST=$'\033[0m'
FAILURES=(); WARNINGS=()
STALE_PROCESS=0; DEV_MODE=0

section() { printf '\n%s──── %s %s\n' "$BLD" "$1" "$RST"; }
ok()      { printf '  %s✓%s %s\n' "$GRN" "$RST" "$1"; }
warn()    { printf '  %s!%s %s\n' "$YLW" "$RST" "$1"; WARNINGS+=("$1"); }
bad()     { printf '  %s✗%s %s\n' "$RED" "$RST" "$1"; FAILURES+=("$1"); }
note()    { printf '    %s%s%s\n' "$DIM" "$1" "$RST"; }

# curl با -sS در خطا هم «000» را روی stdout می‌نویسد و هم exit غیرصفر می‌دهد؛
# الگوی «|| echo 000» باعث می‌شد کد دو بار چاپ شود (000000).
http_code() {
  local code
  code="$(curl -sS -o "${2:-/dev/null}" -w '%{http_code}' --max-time "${3:-20}" "$1" 2>/dev/null)"
  [[ -z "$code" ]] && code="000"
  printf '%s' "$code"
}

printf '%sعیب‌یابی آرتا کلین%s  —  %s  —  %s\n' "$BLD" "$RST" "$BASE" "$(date '+%Y-%m-%d %H:%M:%S')"

# ───────────────────────────────────────────────────────── ۱. محیط و نسخه‌ها
section "۱. محیط"

NODE_V="$(node -v 2>/dev/null || echo "نصب نیست")"
NODE_MAJOR="$(printf '%s' "$NODE_V" | sed -E 's/^v([0-9]+).*/\1/')"
if [[ "$NODE_V" == "نصب نیست" ]]; then
  bad "Node.js نصب نیست"
elif [[ ! "$NODE_MAJOR" =~ ^[0-9]+$ ]]; then
  bad "نسخه Node قابل تشخیص نیست ($NODE_V)"
elif (( NODE_MAJOR >= 24 )); then
  ok "Node $NODE_V"
elif (( NODE_MAJOR >= 22 )); then
  # روی ۲۲ کار می‌کند ولی node:sqlite آنجا experimental است و هر اجرا
  # هشدار می‌دهد؛ روی ۲۴ پایدار شده.
  warn "Node $NODE_V — کار می‌کند، ولی این پروژه Node 24 می‌خواهد (node:sqlite روی ۲۲ experimental است)"
else
  bad "Node $NODE_V — این پروژه حداقل Node 24 می‌خواهد (node:sqlite زیر Node 22.5 اصلاً وجود ندارد)"
fi

if [[ -d node_modules ]]; then
  ok "node_modules موجود است"
else
  bad "node_modules نیست — «npm install» اجرا نشده"
fi

COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo '?')"
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
note "کامیت فعلی: $COMMIT روی شاخه $BRANCH"

if git status --porcelain 2>/dev/null | grep -q .; then
  warn "فایل‌های تغییر‌یافته محلی وجود دارد (ممکن است git pull را بلاک کند)"
  git status --short 2>/dev/null | head -5 | sed 's/^/    /'
fi

AVAIL_KB="$(df -Pk . | awk 'NR==2 {print $4}')"
if [[ -n "$AVAIL_KB" ]] && (( AVAIL_KB < 512000 )); then
  bad "فضای دیسک کم است ($(( AVAIL_KB / 1024 ))MB) — build ناقص می‌ماند"
else
  note "فضای دیسک آزاد: $(( AVAIL_KB / 1024 ))MB"
fi

MEM_MB="$(free -m 2>/dev/null | awk '/^Mem:/ {print $2}')"
if [[ -n "$MEM_MB" ]]; then
  note "حافظه کل: ${MEM_MB}MB"
  (( MEM_MB < 900 )) && warn "حافظه کمتر از ۱ گیگ — «npm run build» ممکن است وسط کار OOM بخورد و خروجی ناقص بسازد"
fi

# ─────────────────────────────────────────────────────────── ۲. وضعیت build
section "۲. خروجی build"

if [[ ! -f .next/BUILD_ID ]]; then
  bad ".next/BUILD_ID نیست — «npm run build» اصلاً اجرا نشده یا شکست خورده"
else
  ok "build موجود است (BUILD_ID: $(cat .next/BUILD_ID))"

  BUILD_TS="$(stat -c %Y .next/BUILD_ID 2>/dev/null || stat -f %m .next/BUILD_ID 2>/dev/null)"
  NEWEST_SRC="$(find src tailwind.config.ts next.config.mjs package.json -type f \
                  -newer .next/BUILD_ID 2>/dev/null | head -1)"
  if [[ -n "$NEWEST_SRC" ]]; then
    bad "کد از build جدیدتر است — build قدیمی سرو می‌شود. اولین فایل جدیدتر: $NEWEST_SRC"
    note "راه‌حل: npm run build  و بعد ری‌استارت"
  else
    ok "build از آخرین تغییر کد جدیدتر است"
  fi
  note "زمان build: $(date -d "@$BUILD_TS" '+%Y-%m-%d %H:%M' 2>/dev/null || echo '?')"

  # webpack فایل CSS را در .next/static/css می‌گذاشت، Turbopack (پیش‌فرض
  # Next 16) در .next/static/chunks. پس کل static جست‌وجو می‌شود و بزرگ‌ترین
  # فایل — که همان استایل اصلی سایت است — سنجیده می‌شود.
  CSS_FILE="$(find .next/static -name '*.css' -printf '%s %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2-)"
  if [[ -z "$CSS_FILE" ]]; then
    bad "هیچ فایل CSS در .next/static نیست — Tailwind کامپایل نشده"
  else
    CSS_SIZE="$(stat -c %s "$CSS_FILE" 2>/dev/null || stat -f %z "$CSS_FILE" 2>/dev/null)"
    if (( CSS_SIZE < 10000 )); then
      bad "فایل CSS فقط ${CSS_SIZE} بایت است — Tailwind کلاس‌ها را پیدا نکرده"
    else
      ok "CSS ساخته شده ($(( CSS_SIZE / 1024 ))KB)"
    fi
  fi
fi

# ─────────────────────────────────────────────────────── ۴. پاسخ HTML صفحه
section "۳. پاسخ سرور"

HTML_FILE="$(mktemp)"
HTTP_CODE="$(http_code "$BASE/" "$HTML_FILE" 25)"

if [[ "$HTTP_CODE" == "000" ]]; then
  bad "سرور اصلاً پاسخ نداد (اتصال برقرار نشد)"
elif [[ "$HTTP_CODE" != "200" ]]; then
  bad "صفحه اصلی کد $HTTP_CODE برگرداند"
  head -c 400 "$HTML_FILE" | sed 's/^/    /'
else
  SIZE="$(wc -c < "$HTML_FILE")"
  ok "صفحه اصلی: HTTP 200 ($(( SIZE / 1024 ))KB)"
  (( SIZE < 20000 )) && bad "حجم HTML خیلی کم است — احتمالاً صفحه خطا سرو می‌شود، نه صفحه واقعی"

  # نشانه‌های محتوایی: اگر HTML هست ولی این‌ها نیستند، رندر سمت سرور ناقص است
  for marker in "نظافت صنعتی" "مشاور انتخاب دستگاه" "آرتا کلین"; do
    if grep -qF "$marker" "$HTML_FILE"; then
      ok "متن «$marker» در HTML هست"
    else
      bad "متن «$marker» در HTML نیست — رندر سمت سرور ناقص است"
    fi
  done

  grep -q 'dir="rtl"' "$HTML_FILE" && ok "جهت RTL روی <html> ست شده" || bad "dir=\"rtl\" روی <html> نیست"

  # ── مهم‌ترین تست: آیا پروسه در حال اجرا، همین build را سرو می‌کند؟
  #
  # پروسه‌ای که از قبل روی پورت مانده، بعد از build جدید همچنان .next قدیمی
  # را از حافظه سرو می‌کند: بعضی مسیرها ۲۰۰ می‌دهند و بعضی ۵۰۰، و چانک‌ها ۴۰۴
  # می‌شوند. از بیرون شبیه «سایت خراب» است، در حالی که کد و build سالم‌اند.
  if [[ -f .next/BUILD_ID ]]; then
    DISK_BUILD_ID="$(cat .next/BUILD_ID)"
    if grep -qF "$DISK_BUILD_ID" "$HTML_FILE"; then
      ok "شناسه build صفحه با build روی دیسک یکی است"
    else
      bad "پروسه در حال اجرا build دیگری را سرو می‌کند (build دیسک: $DISK_BUILD_ID)"
      note "یعنی یک پروسه قدیمی روی پورت مانده. راه‌حل در انتهای گزارش."
      STALE_PROCESS=1
    fi
  fi

  # اسم چانک بدون هش یعنی حالت توسعه؛ روی سرور نباید «next dev» اجرا شود.
  if grep -qE '/_next/static/chunks/(main-app|polyfills|app-pages-internals)\.js' "$HTML_FILE"; then
    bad "سرور در حالت توسعه (next dev) اجرا شده، نه production"
    note "next dev کند است، کش ندارد و بعد از build جدید خطای ۵۰۰ می‌دهد."
    note "راه‌حل: با «npm start» یا pm2 اجرا کنید، نه «npm run dev»."
    DEV_MODE=1
  fi
fi

# ────────────────────────────────────────────────────────────── ۳. پروسه‌ها
section "۴. پروسه و پورت"

LISTENERS=""
if command -v lsof >/dev/null 2>&1; then
  LISTENERS="$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | tail -n +2)"
fi
# عبارت فیلتر ss («sport = :3000») بین نسخه‌های iproute2 یکسان رفتار نمی‌کند
# و روی بعضی توزیع‌ها چیزی برنمی‌گرداند. فهرست کامل و grep همیشه کار می‌کند.
if [[ -z "$LISTENERS" ]] && command -v ss >/dev/null 2>&1; then
  LISTENERS="$(ss -ltnp 2>/dev/null | grep -E ":${PORT}([^0-9]|$)")"
fi
# آخرین راه، بدون هیچ ابزاری: جدول سوکت‌های خود کرنل. lsof و ss هر دو ممکن
# است نصب نباشند یا در کانتینر چیزی نبینند، ولی این فایل روی هر لینوکسی هست.
# پورت به هگز است و حالت 0A یعنی LISTEN.
if [[ -z "$LISTENERS" ]] && [[ -r /proc/net/tcp ]]; then
  PORT_HEX="$(printf '%04X' "$PORT")"
  # فقط فایل‌های موجود: روی سرور بدون IPv6، tcp6 وجود ندارد و با pipefail
  # یک cat ناموفق کل بررسی را منفی می‌کرد.
  SOCK_TABLES=(/proc/net/tcp)
  [[ -r /proc/net/tcp6 ]] && SOCK_TABLES+=(/proc/net/tcp6)
  if awk -v p=":$PORT_HEX" '$2 ~ p"$" && $4 == "0A" { found=1 } END { exit !found }' \
       "${SOCK_TABLES[@]}"; then
    LISTENERS="(از /proc/net/tcp) یک سوکت روی پورت $PORT در حالت LISTEN است"
  fi
fi

HAVE_PORT_TOOL=0
command -v lsof >/dev/null 2>&1 && HAVE_PORT_TOOL=1
command -v ss   >/dev/null 2>&1 && HAVE_PORT_TOOL=1
[[ -r /proc/net/tcp ]] && HAVE_PORT_TOOL=1

if (( HAVE_PORT_TOOL == 0 )); then
  note "نه lsof نصب است نه ss — بررسی پورت رد شد (پاسخ HTTP بالا مرجع است)"
  note "برای بررسی دقیق‌تر: sudo apt install -y lsof"
elif [[ -z "$LISTENERS" ]]; then
  # اگر HTTP جواب داده، پروسه قطعاً هست و فقط ابزار آن را ندیده.
  if [[ "$HTTP_CODE" == "200" ]]; then
    warn "روی پورت $PORT چیزی دیده نشد ولی سرور پاسخ می‌دهد — احتمالاً پشت پروکسی یا در کانتینر است"
  else
    bad "هیچ پروسه‌ای روی پورت $PORT گوش نمی‌دهد — سرور اجرا نیست"
  fi
else
  COUNT="$(printf '%s\n' "$LISTENERS" | grep -c . )"
  ok "پورت $PORT در حال گوش دادن است"
  printf '%s\n' "$LISTENERS" | head -4 | sed 's/^/    /'
  (( COUNT > 2 )) && warn "بیش از یک پروسه روی این پورت — نسخه قدیمی هنوز زنده است و ممکن است پاسخ بدهد"
fi

RUNNING="$(pgrep -af 'next-server|next start' 2>/dev/null | grep -v diagnose | head -5)"
[[ -n "$RUNNING" ]] && printf '%s\n' "$RUNNING" | sed 's/^/    /'

if command -v pm2 >/dev/null 2>&1; then
  note "pm2:"
  pm2 list 2>/dev/null | sed 's/^/    /' | head -12
  if pm2 list 2>/dev/null | grep -qE 'errored|stopped'; then
    bad "یک پروسه pm2 در وضعیت errored/stopped است — بالا نیامده و پروسه دیگری جای آن پاسخ می‌دهد"
    STALE_PROCESS=1
  fi
fi

# ────────────────────────────────────────────── ۵. فایل‌های استاتیک صفحه
section "۵. فایل‌های استاتیک (CSS/JS)"

if [[ "$HTTP_CODE" == "200" ]]; then
  # آدرس دارایی‌ها را از خود HTML بیرون می‌کشیم تا دقیقاً همان چیزی تست شود
  # که مرورگر درخواست می‌کند.
  ASSETS="$(grep -oE '/_next/static/[^"'"'"']+\.(css|js)' "$HTML_FILE" | sort -u)"
  ASSET_COUNT="$(printf '%s\n' "$ASSETS" | grep -c . )"

  if (( ASSET_COUNT == 0 )); then
    bad "هیچ لینک به /_next/static در HTML نیست — خروجی build به صفحه وصل نشده"
  else
    note "$ASSET_COUNT فایل استاتیک در صفحه"
    BROKEN=0
    while IFS= read -r asset; do
      [[ -z "$asset" ]] && continue
      CODE="$(http_code "${BASE}${asset}" /dev/null 15)"
      if [[ "$CODE" != "200" ]]; then
        bad "$CODE  $asset"
        BROKEN=$(( BROKEN + 1 ))
      fi
    done <<< "$ASSETS"

    if (( BROKEN == 0 )); then
      ok "همه فایل‌های استاتیک ۲۰۰ برمی‌گردانند"
    else
      note "۴۰۴ روی فایل استاتیک یعنی پروسه در حال اجرا، .next قدیمی را سرو می‌کند."
      note "راه‌حل: پروسه را کامل ببندید، دوباره build بگیرید، بعد استارت کنید."
    fi

    # حجم CSS واقعی سرو‌شده — اگر کم باشد استایل ناقص می‌شود
    CSS_URL="$(printf '%s\n' "$ASSETS" | grep '\.css$' | head -1)"
    if [[ -n "$CSS_URL" ]]; then
      SERVED_CSS="$(curl -sS --max-time 15 "${BASE}${CSS_URL}" 2>/dev/null | wc -c)"
      if (( SERVED_CSS < 10000 )); then
        bad "CSS سرو‌شده فقط ${SERVED_CSS} بایت است — استایل ناقص می‌آید"
      else
        ok "CSS سرو‌شده: $(( SERVED_CSS / 1024 ))KB"
      fi
    fi
  fi
fi

# ────────────────────────────────────────────── ۶. مسیرهای کلیدی سایت
section "۶. مسیرهای کلیدی"

for path in /products /products/floor-scrubbers /products/floor-scrubbers/vertex-r850 \
            /solutions/factories /advisor /spare-parts /quote /compare; do
  CODE="$(http_code "${BASE}${path}" /dev/null 20)"
  if [[ "$CODE" == "200" ]]; then
    ok "$CODE  $path"
  else
    bad "$CODE  $path"
  fi
done

# ────────────────────────────────────────────────────────── ۷. فونت فارسی
section "۷. فونت فارسی"

# فونت Vazirmatn از خود سایت سرو می‌شود (‎@fontsource-variable‎)، نه از CDN.
# اگر فایل فونت ۴۰۴ بدهد، متن با فونت جایگزین سیستم رندر می‌شود و صفحه
# «به‌هم‌ریخته» به‌نظر می‌رسد — بدون اینکه هیچ خطایی در لاگ باشد. پس نشانی
# فونت از همان CSS سرو‌شده بیرون کشیده و درخواست می‌شود.
if [[ -n "${CSS_URL:-}" ]]; then
  FONT_REL="$(curl -sS --max-time 15 "${BASE}${CSS_URL}" 2>/dev/null \
               | grep -oE 'url\([^)]*vazirmatn-arabic[^)]*\.woff2\)' | head -1 \
               | sed -E 's/^url\(//; s/\)$//; s/^["'"'"']//; s/["'"'"']$//')"
  if [[ -z "$FONT_REL" ]]; then
    bad "فونت Vazirmatn در CSS سرو‌شده پیدا نشد — متن فارسی با فونت سیستم نمایش داده می‌شود"
  else
    # نشانی در CSS نسبی است (‎../media/…‎) — نسبت به مسیر خود فایل CSS.
    FONT_URL="$(dirname "$CSS_URL")/$FONT_REL"
    FONT_CODE="$(http_code "${BASE}${FONT_URL}" /dev/null 15)"
    if [[ "$FONT_CODE" == "200" ]]; then
      ok "فونت از خود سایت سرو می‌شود (بدون وابستگی به CDN)"
    else
      bad "فایل فونت $FONT_CODE برگرداند — متن فارسی با فونت سیستم نمایش داده می‌شود"
    fi
  fi
else
  note "CSS سرو‌شده پیدا نشد — بررسی فونت رد شد"
fi

# ──────────────────────────────────────────────────────────── ۸. لاگ‌ها
section "۸. آخرین خطاهای لاگ"

LOG_FOUND=0
if command -v pm2 >/dev/null 2>&1; then
  # خط سربرگی که خود pm2 چاپ می‌کند («…/artaclean-error.log last 200 lines:»)
  # کلمه error را در نام فایل دارد و نباید به‌عنوان خطا شمرده شود.
  ERR_LOG="$(pm2 logs --nostream --lines 200 --err 2>/dev/null \
              | grep -vE '\.log last [0-9]+ lines|^\[TAILING\]' \
              | grep -iE 'error|exception|failed|ENOENT|EADDRINUSE' | tail -15)"
  if [[ -n "$ERR_LOG" ]]; then
    printf '%s\n' "$ERR_LOG" | sed 's/^/    /'
    # pm2 لاگ را با ری‌استارت پاک نمی‌کند، پس این خطوط ممکن است مربوط به
    # قبل از آخرین استارت سالم باشند و بی‌جهت نگران‌کننده به‌نظر برسند.
    warn "در لاگ pm2 خطا هست (بالا) — اگر پروسه تازه ری‌استارت شده احتمالاً مربوط به قبل است؛ «pm2 flush» بزنید و دوباره اجرا کنید"
    LOG_FOUND=1
  fi
fi
(( LOG_FOUND == 0 )) && note "خطای مشخصی در لاگ پیدا نشد (یا لاگ در دسترس نیست)"

rm -f "$HTML_FILE"

# ─────────────────────────────────────────────────────────────── خلاصه
section "خلاصه"

if (( ${#FAILURES[@]} == 0 )); then
  printf '  %s✓ هیچ مشکل سمت سرور پیدا نشد.%s\n' "$GRN" "$RST"
  printf '  اگر باز هم ناقص می‌بینید، مشکل سمت مرورگر است:\n'
  printf '    ۱) Ctrl+Shift+R بزنید (کش HTML قدیمی به فایل CSS قدیمی اشاره می‌کند)\n'
  printf '    ۲) کنسول مرورگر (F12) را باز کنید و تب Console و Network را بفرستید\n'
  printf '    ۳) اگر پشت nginx هستید، هدرهای proxy و کش nginx را چک کنید\n'
else
  printf '  %s%d مشکل پیدا شد:%s\n' "$RED" "${#FAILURES[@]}" "$RST"
  for f in "${FAILURES[@]}"; do printf '    • %s\n' "$f"; done

  if (( STALE_PROCESS == 1 || DEV_MODE == 1 )); then
    printf '\n  %sعلت اصلی: یک پروسه قدیمی روی پورت مانده و build فعلی را سرو نمی‌کند.%s\n' "$BLD" "$RST"
    printf '  همه پروسه‌ها را ببندید و تمیز از نو بالا بیاورید:\n\n'
    printf '    pm2 delete all; pkill -f next-server; pkill -f "next dev"; pkill -f "next start"\n'
    printf '    sleep 2 && rm -rf .next && npm run build\n'
    printf '    pm2 start npm --name artaclean -- start && pm2 save\n'
  fi
fi

if (( ${#WARNINGS[@]} > 0 )); then
  printf '\n  %s%d هشدار:%s\n' "$YLW" "${#WARNINGS[@]}" "$RST"
  for w in "${WARNINGS[@]}"; do printf '    • %s\n' "$w"; done
fi

printf '\n'
(( ${#FAILURES[@]} > 0 )) && exit 1
exit 0
