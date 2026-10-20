# CarSitting

Site vitrine de **CarSitting**, agence de voituriers premium à Paris. Reconstruit depuis le projet Framer d'origine, avec la charte graphique de Jerry.

- **Stack** : [Astro](https://astro.build) 5 · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis (défilement fluide)
- **Hébergement visé** : Vercel (site statique, pas encore déployé)
- **Charte** : [BRAND.md](BRAND.md)

## Démarrage

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # génère dist/
npm run preview   # prévisualise le build
```

## Pages

| Route | Fichier | Contenu |
|---|---|---|
| `/` · `/en/` | `src/views/Home.astro` | Ouverture, manifeste, photo, le service (hôtels, restaurants, événements), partenaires, approche, repères chiffrés |
| `/qui-sommes-nous` · `/en/about` | `src/views/About.astro` | La maison, conviction, valeurs, équipes, repères, formulaire partenaire |
| `/nos-services` · `/en/services` | `src/views/Services.astro` | Prestations, modalités d'intervention, ce qui nous distingue, partenaires |
| `/demander-un-devis` · `/en/request-a-quote` | `src/views/Quote.astro` | Parcours de devis (solution ponctuelle ou service régulier) |

## Français / anglais

- Le français est la langue principale (adresses sans préfixe), l'anglais vit sous `/en/`. Chaque page a une seule mise en page dans `src/views/`, avec ses textes dans les deux langues (objet `copy` en haut du fichier) ; `src/pages/` et `src/pages/en/` ne font que l'afficher.
- Les textes communs (menu, pied de page, conclusion, chiffres) et la correspondance des adresses sont dans `src/i18n.ts`. Les messages des formulaires sont dans `src/scripts/forms.ts` (`MSG`).
- Sélecteur FR / EN dans l'en-tête (à partir de 640 px) et dans le menu mobile : il mène à la même page dans l'autre langue. Balises `hreflang` pour Google, `og:locale` pour les aperçus de partage.
- **Les demandes de devis arrivent toujours en français** : seuls les libellés affichés changent ; une demande venue de la version anglaise porte « EN » dans l'objet et la ligne « Langue du visiteur ».
- La traduction anglaise est une première proposition, à faire relire par Jerry (notamment la signature « The right impression, every time. »).

## Structure

```
src/
  layouts/Base.astro        Page type : polices, en-tête persistant, transitions de page
  components/               Header, Footer, Partners (défilement), Stats, Cta, Ornament
  components/form/          Field (champ + erreur accessible) et Submit (bouton d'envoi)
  scripts/motion.ts         Animations : défilement fluide, apparitions, parallaxe, compteurs
  scripts/forms.ts          Validation en français, parcours conditionnel, envoi
  styles/global.css         Tokens de la charte, fonds de section, styles des formulaires
public/images/              Photos (récupérées du site Framer)
```

## Charte graphique

Définie dans `src/styles/global.css` (`@theme`) :

- **Couleurs** : bleu nuit `#1B2340`, ivoire `#F5F1E9`, or patiné `#A98B54`, encre `#1A1A1A`
- **Polices** : Cormorant Garamond (titres) et Jost (corps, libellés)
- **Fonds de section** : classes `s-nuit`, `s-ivoire`, `s-encre`, `s-or` (rythme repris de Framer)

Toutes les règles (sceau, photos, ton de voix) sont dans [BRAND.md](BRAND.md).

## Ouverture des pages et défilé des maisons

- **Ouverture plein écran** (`src/components/Hero.astro`) : photo pleine largeur sous un voile translucide (la photo reste visible, le texte lisible), texte qui apparaît en décalé, parallaxe, indicateur « Défiler ». L'accueil enchaîne 4 photos en fondu toutes les 6 s ; les autres pages en ont une. Inspiré de Les 3 Valets, avec plus d'espace (Madame Rêve). L'en-tête est transparent sur l'ouverture puis devient bleu nuit dès qu'on défile.
- **Photos de l'ouverture** : prévoir du 1920 px de large minimum, sinon elles paraissent floues en plein écran. Les listes sont dans chaque page (`slides`).
- **Défilé des logos** (`src/components/Partners.astro`) : les 12 logos (11 maisons et le groupe Paris Society) sont dans `public/logos/` (récupérés sur leurs sites officiels, provisoires : voir `public/logos/SOURCES.md`). Ils passent en ivoire uni. Pour en remplacer un, déposer un fichier du même nom (liste dans `LISEZ-MOI.md`) ; tant qu'un logo manque, le nom de la maison s'affiche à sa place.

## Responsive et mobile

Testé de 320 à 1280 px sur les 4 pages : aucun défilement horizontal.

- **Navigation** : liens dans l'en-tête à partir de 1024 px ; en dessous, bouton menu (`src/scripts/menu.ts`, `MobileMenu.astro`) qui ouvre un panneau plein écran. Le bouton « demander un devis » reste visible dès 640 px. Liens définis une seule fois dans `src/data/nav.ts`.
- **Accessibilité du menu** : `aria-expanded`, focus gardé dans le panneau, fermeture avec Échap ou au clic sur un lien, défilement figé derrière.
- **Formulaires** : champs à 16 px sur téléphone (évite le zoom automatique d'iOS Safari), hauteur de 48 px minimum.
- **Pièges CSS** : les classes maison qui fixent un `display` (`.btn`, `.menu-toggle`) sont dans `@layer components`, sinon elles écrasent `hidden` et les variantes responsive de Tailwind.

## Finitions premium

- **Typographie** : Cormorant Garamond en graisses fines (300 à 500) et en italique pour les citations (`.quote-xl`), jamais de gras appuyé, conformément à la charte.
- **Mise en page éditoriale** : grilles asymétriques, cartes en quinconce, prestations alternées, filets or fins entre les colonnes, grands espaces.
- **Grain photographique** très léger sur tout le site (`body::after`), curseur en anneau or sur ordinateur (`src/scripts/cursor.ts`, désactivé au tactile et en mode animations réduites).
- **Titres** révélés derrière un masque au défilement ; images qui s'approchent au survol des cartes.
- **Sur téléphone et tablette** (moins de 1024 px ou écran tactile), les photos s'affichent immédiatement, sans dévoilement ni fondu : on y défile vite au doigt (retour de Jerry).
- **Conclusion** sur photo avec parallaxe, **pied de page** avec grande signature « Car Sitting » en filigrane.
- Les chiffres clés sont sur bleu nuit (la charte proscrit l'or en aplat).

## Animations

Gérées par `src/scripts/motion.ts` : défilement fluide, apparition des blocs au scroll, parallaxe de l'ouverture, dévoilement des images, compteurs, défilement des partenaires, en-tête qui se cache en descendant. Les transitions entre pages utilisent le routeur client d'Astro. Tout est désactivé pour les visiteurs ayant demandé moins d'animations (`prefers-reduced-motion`).

## Formulaires

Deux formulaires (devis et partenaire) partagent `src/scripts/forms.ts` :

- validation côté navigateur, messages d'erreur en français sous chaque champ ;
- parcours conditionnel sur le devis : seuls les champs du parcours choisi sont validés et envoyés ;
- champ piège anti-spam.

**Envoi.** Si la variable `PUBLIC_FORM_ENDPOINT` est définie (Formspree, route API…), la demande y est postée en JSON. Sinon, le formulaire ouvre la messagerie du visiteur vers `contact@carsitting.fr`, ce qui n'est qu'un repli : **un service d'envoi reste à choisir avant la mise en ligne.**

```bash
# .env
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

## Métadonnées et partage

Gérées dans `src/layouts/Base.astro` : chaque page passe son `title` et sa `description`, le reste est généré.

- **Aperçus de partage** : Open Graph (Facebook, LinkedIn, WhatsApp, iMessage, Slack) et X / Twitter (`summary_large_image`), avec l'image `public/og-image.jpg` (1200×630).
- **Référencement** : lien canonique, `robots`, `sitemap-index.xml` généré au build (`@astrojs/sitemap`), `public/robots.txt`, données structurées JSON-LD (`LocalBusiness`).
- **Navigateur** : favicon SVG (`public/favicon.svg`), couleur de thème bleu nuit.
- **URL publique** : lue dans la variable `SITE_URL` (par défaut `https://carsitting.fr`). Les aperçus exigent des URL absolues : définir `SITE_URL` sur Vercel avec le domaine définitif, et mettre à jour la ligne `Sitemap:` de `public/robots.txt`.
- Une image dédiée à une page : `<Base title="…" image="/mon-image.jpg" imageAlt="…">`. `noindex` garde une page hors des moteurs de recherche.

Après une mise en ligne, forcer la mise à jour des aperçus déjà en cache avec le [débogueur Facebook](https://developers.facebook.com/tools/debug/) et le [Post Inspector LinkedIn](https://www.linkedin.com/post-inspector/).

## Déploiement (Vercel)

Pas encore fait. Le site est statique : il suffit de relier ce dépôt à un projet Vercel (preset Astro détecté automatiquement) et d'y définir `PUBLIC_FORM_ENDPOINT` et `SITE_URL`.

## À faire

- Choisir le service de réception des demandes (Formspree ou route Vercel + Resend).
- Remplacer le monogramme « CS » de substitution par le fichier de logo officiel.
- Renseigner les vraies coordonnées (téléphone, mentions légales, réseaux sociaux) dans `Footer.astro`.
- Remplacer les photos qui s'éloignent de la charte (lumière basse, gros plans sur le geste), notamment celle de l'hôtel.
- Obtenir l'accord des maisons pour afficher leurs logos et les remplacer par les versions officielles (kit presse, ou Paris Society pour ses adresses).
