import "server-only";
import { DEFAULT_LOCALE, type Locale } from "./config";
import en from "./dictionaries/en";
import vi, { type Dictionary } from "./dictionaries/vi";
import zhTW from "./dictionaries/zh-TW";

const dictionaries: Record<Locale, Dictionary> = { vi, en, "zh-TW": zhTW };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang] ?? dictionaries[DEFAULT_LOCALE];
}

export type { Dictionary };
