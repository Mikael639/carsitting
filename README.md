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
| `/` | `src/pages/index.astro` | Ouverture, manifeste, photo, le service (hôtels, restaurants, événements), partenaires, approche, repères chiffrés |
| `/qui-sommes-nous` | `src/pages/qui-sommes-nous.astro` | La maison, conviction, valeurs, équipes, repères, formulaire partenaire |
| `/nos-services` | `src/pages/nos-services.astro` | Prestations, modalités d'intervention, ce qui nous distingue, partenaires |
| `/demander-un-devis` | `src/pages/demander-un-devis.astro` | Parcours de devis (solution ponctuelle ou service régulier) |

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
- Ajouter un menu pour mobile : sous 768 px, seul le bouton « demander un devis » reste dans l'en-tête.
- Remplacer les photos qui s'éloignent de la charte (lumière basse, gros plans sur le geste), notamment celle de l'hôtel.
- Ajouter les logos des partenaires (affichés en texte pour l'instant).
