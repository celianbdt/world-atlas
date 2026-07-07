# Atlas du Voyageur

Carte interactive du monde : **monuments**, **ingrédients**, **plats régionaux**, **sports**, **animaux**, **plantes** — bilingue FR/EN, 790 points sur 116 pays.

## Démarrer

```bash
npm install
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

## Fonctionnalités

- Carte monde (Leaflet + CARTO dark teintée sépia) avec zoom, clustering et fond marron
- 6 catégories filtrables (chips en haut, **double-clic** pour isoler, toggle FR/EN)
- Recherche full-text sur nom, région, tags **et** descriptions
- Détection pays : taper un pays (« france », « japon »…) affiche une fiche pratique (sécurité, connexion, saison, monnaie, langue, prises) + tous ses points
- Clic sur un résultat = flyTo + panel latéral (bandeau photo Wikipedia, description bilingue, tags, CTA Google Maps + Wikipédia)
- Mobile : bottom-sheet + carousel de filtres

## Structure

- `data/*.json` — 8 fichiers (6 catégories + 2 packs additionnels ingredients2/dishes2) + `countries.json` (fiches pratiques)
- `scripts/enrich-images.mjs` — enrichit les points avec des thumbnails Wikipedia (à relancer si tu ajoutes des points)
- `components/` — AtlasMap, FilterBar, DetailPanel, SearchDropdown, AtlasLogo, CountryTag, StateScreens
- `lib/` — types, data, countries
- `docs/brand-system.md` + `docs/brand-mockup.pdf` — charte "encre & parchemin"

## Ajouter des points

Éditer un fichier JSON en respectant `AtlasPoint` (voir [types.ts](lib/types.ts)), puis relancer :

```bash
node scripts/enrich-images.mjs data/monuments.json
```

## Déployer sur Vercel

```bash
npx vercel
```

## Stack

Next.js 14 · TypeScript · Tailwind · react-leaflet · leaflet.markercluster · Cormorant Garamond / Instrument Sans / Space Mono.
