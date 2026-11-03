import type { Language } from "../../shared/i18n";

const LOCALES: Readonly<Record<Language, string>> = { he: "he-IL", ru: "ru-RU", uk: "uk-UA" };

export function localeOf(language: Language): string {
  return LOCALES[language];
}

/**
 * Picks the plural form from "игра|игры|игр" (ru/uk: one|few|many) or "משחק|משחקים" (he: one|other).
 */
export function plural(forms: string, count: number, language: Language): string {
  const variants = forms.split("|");
  const category = new Intl.PluralRules(localeOf(language)).select(count);
  if (variants.length === 2) return category === "one" ? variants[0] : variants[1];
  if (category === "one") return variants[0];
  if (category === "few") return variants[1];
  return variants[2] ?? variants[variants.length - 1];
}

/** "2026-10-28" or "2026-10-28T10:00:00" (already in the family's zone) -> a local date at midnight */
export function parseDay(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

/**
 * "сегодня" / "вчера" / "чт" (this week) / "28 окт." for a game time.
 * today/yesterday are passed in already translated.
 */
export function dayLabel(value: string, language: Language, today: string, yesterday: string): string {
  const ago = daysBetween(parseDay(value), startOfToday());
  if (ago === 0) return today;
  if (ago === 1) return yesterday;
  const locale = localeOf(language);
  if (ago > 1 && ago < 7) return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(parseDay(value));
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(parseDay(value));
}

/** Label under an activity bar: weekday (week), "28.10" (month: the week's first day), "окт." (all time) */
export function activityLabel(label: string, period: "week" | "month" | "all", language: Language): string {
  const locale = localeOf(language);
  if (period === "all") {
    const [year, month] = label.split("-").map(Number);
    return new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(year, month - 1, 1));
  }
  const options: Intl.DateTimeFormatOptions =
    period === "week" ? { weekday: "short" } : { day: "numeric", month: "numeric" };
  return new Intl.DateTimeFormat(locale, options).format(parseDay(label));
}
