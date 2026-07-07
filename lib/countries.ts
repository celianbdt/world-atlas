import countriesRaw from "@/data/countries.json";
import type { Bilingual } from "./types";

export interface CountryInfo {
  name: Bilingual;
  currency: string;
  language: Bilingual;
  safety: Bilingual;
  internet: Bilingual;
  bestSeason: Bilingual;
  plug: string;
}

export const COUNTRY_INFO = countriesRaw as Record<string, CountryInfo>;
