export type Category = "monument" | "ingredient" | "dish" | "sport" | "animal" | "plant";

export type Locale = "fr" | "en";

export interface Bilingual {
  fr: string;
  en: string;
}

export interface AtlasPoint {
  id: string;
  category: Category;
  name: Bilingual;
  region: string;
  country: Bilingual;
  countryCode: string;
  coordinates: [number, number];
  description: Bilingual;
  tags?: string[];
  image?: string;
}

export const CATEGORY_META: Record<Category, { color: string; label: Bilingual }> = {
  monument: {
    color: "#C08A3E",
    label: { fr: "Monuments", en: "Monuments" },
  },
  ingredient: {
    color: "#7F8A4F",
    label: { fr: "Ingrédients", en: "Ingredients" },
  },
  dish: {
    color: "#B0553A",
    label: { fr: "Plats", en: "Dishes" },
  },
  sport: {
    color: "#5F7D8C",
    label: { fr: "Sports", en: "Sports" },
  },
  animal: {
    color: "#7A5570",
    label: { fr: "Animaux", en: "Animals" },
  },
  plant: {
    color: "#4F7A6B",
    label: { fr: "Plantes & arbres", en: "Plants & trees" },
  },
};

export const ALL_CATEGORY_COLOR = "#5B608C";

export const UI_TEXT = {
  title: { fr: "Atlas du Voyageur", en: "Traveler's Atlas" },
  subtitle: {
    fr: "Terroirs & itinéraires du monde entier",
    en: "Terroirs & itineraries around the world",
  },
  filterAll: { fr: "Tout", en: "All" },
  clearFilter: { fr: "Effacer", en: "Clear" },
  region: { fr: "Région", en: "Region" },
  country: { fr: "Pays", en: "Country" },
  description: { fr: "Description", en: "Description" },
  tags: { fr: "Tags", en: "Tags" },
  close: { fr: "Fermer", en: "Close" },
  points: { fr: "points", en: "points" },
  loading: { fr: "Chargement de la carte…", en: "Loading map…" },
  searchPlaceholder: { fr: "Nom, région, tag…", en: "Name, region, tag…" },
  emptyTitle: { fr: "Aucun point ici", en: "No point here" },
  emptyBody: {
    fr: "Élargis tes filtres ou dézoome pour explorer d'autres terroirs.",
    en: "Widen your filters or zoom out to explore other terroirs.",
  },
  coordinates: { fr: "Coordonnées", en: "Coordinates" },
  isolateHint: {
    fr: "Double-clic pour isoler une catégorie",
    en: "Double-click to isolate a category",
  },
  results: { fr: "résultats", en: "results" },
  noResults: { fr: "Aucun résultat", en: "No result" },
  countryKicker: { fr: "Pays", en: "Country" },
  safety: { fr: "Sécurité", en: "Safety" },
  internet: { fr: "Connexion", en: "Internet" },
  currency: { fr: "Monnaie", en: "Currency" },
  bestSeason: { fr: "Meilleure saison", en: "Best season" },
  plug: { fr: "Prises", en: "Plugs" },
  language: { fr: "Langue", en: "Language" },
} as const;
