# Atlas du Voyageur — Brief & Brand System

_Document de refonte — à remettre à l'équipe design/dev. Décrit la direction visuelle validée et les specs d'implémentation._

---

## 1. Vision & promesse

Une carte du monde interactive qui centralise, en un écran, ce qui rend un voyage mémorable : monuments & lieux naturels, ingrédients iconiques par terroir, plats régionaux, origines des sports et meilleurs spots. ~430 points, bilingue FR/EN.

> **Promesse :** « Zoome n'importe où sur la planète et vois immédiatement ce qui rend cette région irremplaçable. »

**Cible :** voyageur curieux qui prépare un trip et veut découvrir ce qui rend une région unique — sa cuisine, ses matières premières, ses lieux, sa culture sportive. Usage avant/pendant le voyage, desktop et mobile.

**Ton éditorial :** documentaire pointu, pas « guide touristique ». Écriture évocatrice, factuelle, courte.

---

## 2. Direction artistique

**Concept : « Encre & parchemin ».** Une cartographie moderne à l'âme vintage — l'encre profonde du planisphère ancien, la clarté d'une interface d'aujourd'hui. Moderne/minimaliste dans la structure, vintage dans la matière (couleurs sépia, teintes mates, sérif de cartographe).

**Décision clé — pas d'emojis.** L'identité repose sur des **photos cadrées en rond**, avec un **contour couleur-codé selon la catégorie**. C'est la signature du produit.

**Deux ambiances complémentaires :**
- **App = dark (encre).** La carte reste la reine ; l'UI = calques flottants glassmorphism qui ne l'écrasent pas.
- **Branding / style guide = parchemin clair.** Pour la marque, la doc, les supports.

---

## 3. Couleurs

### Catégories — désaturées, mates (vintage)
| Catégorie | Hex | Nom |
|---|---|---|
| Tout / clusters | `#5B608C` | Indigo (muté) |
| Monuments | `#C08A3E` | Ambre / pierre |
| Ingrédients | `#7F8A4F` | Olive |
| Plats | `#B0553A` | Terracotta |
| Sports | `#5F7D8C` | Bleu-ardoise |

### Encre — surfaces app (dark)
`#0F0B06` (fond carte) · `#171009` (base glass / device) · `#211A10` (surfaces) · `#2C2416` (bordures hautes)

### Parchemin — surfaces branding
`#F4ECD8` (crème clair) · `#E7DAB9` (parchemin) · `#D8C69B` (parchemin foncé) · `#6B5836` (encre brune, texte)

### Texte sur dark
Titres crème `#F4ECD8` · corps `#D7C8A6` · secondaire `#C9B78D` · discret `#8A7A56` · très discret `#7D6F52`

Accents saturés/vifs volontairement **écartés** au profit des versions mates.

---

## 4. Typographie

| Rôle | Police | Usage |
|---|---|---|
| Display | **Cormorant Garamond** (600/700) | Titres, nom de marque, titres de points |
| Sous-titre | **Cormorant Garamond** italic (500/600) | Titre dans l'autre langue, accroches |
| UI / corps | **Instrument Sans** (400/500/600) | Interface, descriptions |
| Mono | **Space Mono** (400/700) | Méta, coordonnées GPS, compteurs, kickers |

**Échelle :** corps 13–14 px sur les calques carte, 15–16 px dans le panneau détail. Titre point ~32 px. Kickers mono en `letter-spacing: .2–.34em` uppercase.

---

## 5. Formes, radius, ombres

- **Radius :** panels 22–24 px · chips & toggles `full` (999px) · cards 14 px · device 44 px.
- **Ombres :** douces mais présentes — le contenu flotte au-dessus de la carte. Ex. panel : `0 30px 70px -24px rgba(0,0,0,.9)`.
- **Glassmorphism :** `background: rgba(17,12,7,.72)` + `backdrop-filter: blur(18px)` + bordure `1px rgba(224,207,168,.14)`.
- **Marqueur :** cercle photo, **contour 3 px couleur catégorie**, halo diffus + ombre douce (`box-shadow: 0 8-10px 18-22px rgba(0,0,0,.8), 0 0 0 4-5px <couleur>/.14-.28`).

---

## 6. Composants

### Barre flottante (haut)
Glass rounded sur fond ink. Contient : lockup **AV** (médaillon rond serif) + « Atlas du Voyageur » ; chip **Tout · 430** (indigo actif) ; 4 chips catégories (pastille couleur + label + compteur mono) ; barre de recherche (nom, région, tag) ; toggle **FR / EN** (pill segmented).

### Chips filtres — 3 états
- **Idle :** fond `rgba(255,255,255,.03)`, bordure discrète, texte `#C9B78D`, pastille couleur.
- **Hover :** fond teinté catégorie `~.12`, bordure catégorie `.5`, texte crème.
- **Active :** fond plein couleur catégorie, texte encre `#160F07`, ombre colorée.

### Marqueurs & clusters
- **Marqueur idle :** cercle photo 46 px, contour 3 px.
- **Marqueur hover :** grossit (~56 px), halo renforcé (double ring).
- **Clusters (dézoom) :** cercles indigo `#5B608C` avec compteur, taille variable (S 40 / M 52 / L 66 px), halo indigo.

### Panel détail (slide-in droite, 420–450 px)
Header photo (184 px) avec dégradé teinté catégorie + bouton close rond + chip catégorie (label uppercase tracking). Corps : titre (Cormorant 32) + titre autre langue (italique discret) ; ligne méta (tag pays mono + Pays · Région) ; description langue active (`#D7C8A6`) ; description autre langue (encadré filet, italique, `#93866A`) ; tags en pills ; coordonnées GPS mono ; CTA **Google Maps** + **Wikipédia**.

### Bottom-sheet (mobile)
Le panel devient bottom-sheet plein largeur (poignée, coins arrondis 26 px). La barre de filtres devient un carousel horizontal scrollable.

### États edge
- **Loading :** spinner ambre centré, label mono « CHARGEMENT DE LA CARTE… ».
- **Aucun résultat :** état vide + suggestion « élargis tes filtres ou dézoome ».
- **Recherche active :** highlight des résultats correspondants.

---

## 7. Écrans à livrer

1. Vue carte desktop **1440 × 900** — barre flottante + 3-4 marqueurs + clusters + panel ouvert.
2. Vue carte mobile **390 × 844** — bottom-sheet ouvert + carousel de filtres.
3. Détails composants — chips (idle/hover/active), marqueurs (idle/hover), clusters (S/M/L), états loading/empty.
4. Style guide compact — couleurs, typo, radius, ombres, anatomie marqueur.

---

## 8. Contraintes techniques

- **Stack :** Next.js 14 + Tailwind + react-leaflet, tiles **CARTO dark**.
- **Marqueurs = `<div>` HTML custom** (pas d'icônes SVG lourdes) : le rond photo + contour couleur se fait en CSS pur.
- **Bilingue FR/EN** : toggle fluide qui ne casse pas la mise en page ; chaque point porte titre + description dans les deux langues.
- **Densité maîtrisée** : 430 points ; le clustering doit respirer, les filtres être un réflexe.
- **Hiérarchie** : la carte reste la reine ; l'UI = calques flottants.
- **Photos** : cadrées en rond côté marqueur, en bandeau côté panel. Prévoir un fallback/placeholder sépia tant que la photo n'est pas fournie.

---

_Maquette de référence : `Atlas du Voyageur.dc.html` (canvas navigable — style guide + mockups desktop/mobile + planche composants)._
