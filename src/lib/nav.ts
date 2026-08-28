import { categories, categoryGroups } from "@/lib/data/taxonomy";
import { industries } from "@/lib/data/industries";
import { services } from "@/lib/data/services";

/** معماری اطلاعات سایت در یک‌جا — هدر، فوتر و sitemap همه از همین می‌خوانند. */

export const primaryNav = [
  { label: "محصولات", href: "/products", mega: "products" as const },
  { label: "راهکارها", href: "/solutions", mega: "solutions" as const },
  { label: "برندها", href: "/brands" },
  { label: "خدمات", href: "/services", mega: "services" as const },
  { label: "راهنمای خرید", href: "/knowledge" },
  { label: "پروژه‌ها", href: "/company/projects" },
];

export const megaProducts = categoryGroups.map((group) => ({
  title: group.title,
  items: categories
    .filter((c) => c.group === group.key)
    .map((c) => ({ label: c.name, href: `/products/${c.slug}`, latin: c.latin })),
}));

export const megaSolutions = [
  {
    title: "صنایع تولیدی",
    items: ["factories", "food-industry", "automotive", "construction"],
  },
  {
    title: "لجستیک و تجاری",
    items: ["warehouses", "retail", "parking"],
  },
  {
    title: "خدماتی و درمانی",
    items: ["hospitals", "hotels", "offices", "restaurants"],
  },
].map((group) => ({
  title: group.title,
  items: group.items
    .map((slug) => industries.find((i) => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => Boolean(i))
    .map((i) => ({ label: i.name, href: `/solutions/${i.slug}`, latin: i.latin })),
}));

export const megaServices = [
  {
    title: "پیش از خرید",
    items: ["rental", "training"],
  },
  {
    title: "پس از فروش",
    items: ["installation", "maintenance", "repair", "warranty"],
  },
  {
    title: "تأمین",
    items: ["spare-parts"],
  },
].map((group) => ({
  title: group.title,
  items: group.items
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.name, href: `/services/${s.slug}`, latin: s.latin })),
}));

export const footerNav = [
  {
    title: "محصولات",
    links: categories.slice(0, 7).map((c) => ({ label: c.name, href: `/products/${c.slug}` })),
  },
  {
    title: "راهکارها",
    links: industries.slice(0, 7).map((i) => ({ label: i.name, href: `/solutions/${i.slug}` })),
  },
  {
    title: "خدمات",
    links: services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
  },
  {
    title: "شرکت",
    links: [
      { label: "درباره ما", href: "/company/about" },
      { label: "پروژه‌ها", href: "/company/projects" },
      { label: "نمایندگی‌ها", href: "/company/representatives" },
      { label: "گواهی‌نامه‌ها", href: "/company/certifications" },
      { label: "تماس با ما", href: "/company/contact" },
      { label: "راهنمای خرید", href: "/knowledge" },
      { label: "قطعات یدکی", href: "/spare-parts" },
    ],
  },
];
