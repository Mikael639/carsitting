// Bilingue français / anglais. Le français reste la langue principale (adresses sans préfixe) ;
// l'anglais vit sous /en/. Chaque page a son équivalent dans l'autre langue (voir `routes`).

export type Lang = 'fr' | 'en';
export const langs: Lang[] = ['fr', 'en'];

/** Adresses de chaque page dans les deux langues. */
export const routes = {
  home: { fr: '/', en: '/en/' },
  about: { fr: '/qui-sommes-nous', en: '/en/about' },
  services: { fr: '/nos-services', en: '/en/services' },
  quote: { fr: '/demander-un-devis', en: '/en/request-a-quote' },
  houses: { fr: '/#les-maisons', en: '/en/#les-maisons' },
} as const;
export type RouteKey = keyof typeof routes;

/** Chemin normalisé : sans barre finale (sauf la racine), pour comparer deux adresses. */
export const norm = (path: string) => path.replace(/\/$/, '') || '/';

export function getLang(url: URL): Lang {
  return url.pathname === '/en' || url.pathname.startsWith('/en/') ? 'en' : 'fr';
}

/** Équivalents de l'adresse courante dans chaque langue (pour le sélecteur et les balises hreflang). */
export function alternates(url: URL): Record<Lang, string> {
  const p = norm(url.pathname);
  for (const r of Object.values(routes)) {
    if (norm(r.fr) === p || norm(r.en) === p) return { fr: r.fr, en: r.en };
  }
  return { fr: routes.home.fr, en: routes.home.en };
}

export const path = (key: RouteKey, lang: Lang) => routes[key][lang];

/** Textes communs à toutes les pages (en-tête, menu, pied de page, formulaires). */
export const ui = {
  fr: {
    nav: [
      { key: 'about', label: 'qui sommes nous ?' },
      { key: 'services', label: 'nos services' },
      { key: 'houses', label: 'Les maisons' },
    ],
    home: 'Accueil',
    quoteCta: 'demander un devis',
    quote: 'Demander un devis',
    logoLabel: 'Car Sitting — Service voiturier, accueil',
    tagline: 'Service voiturier',
    mainNav: 'Navigation principale',
    menu: 'Menu',
    menuNav: 'Menu principal',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    language: 'Langue',
    switchTo: 'English version',
    signature: 'La juste impression, à chaque fois.',
    footerNav: 'Pied de page',
    house: 'La maison',
    contact: 'Contact',
    follow: 'Suivre',
    legal: 'Mentions légales',
    rights: 'Service voiturier · Paris',
    scroll: 'Défiler',
    scrollLabel: 'Découvrir la suite de la page',
    partnersLabel: 'Maisons partenaires',
    select: 'Sélectionnez',
    honeypot: 'Ne pas remplir',
    ctaLabel: 'Demander un devis',
    ctaTitle: 'Parlons du seuil de votre établissement.',
    ctaButton: 'Demander une proposition',
    ctaNote: 'Réponse sous 48 h · Échange confidentiel · Sans engagement',
    stats: [['MMXVI', 'Maison fondée'], ['12 000+', 'Prestations réalisées'], ['40+', 'Établissements servis']],
  },
  en: {
    nav: [
      { key: 'about', label: 'about us' },
      { key: 'services', label: 'our services' },
      { key: 'houses', label: 'The houses' },
    ],
    home: 'Home',
    quoteCta: 'request a quote',
    quote: 'Request a quote',
    logoLabel: 'Car Sitting — Valet service, home',
    tagline: 'Valet service',
    mainNav: 'Main navigation',
    menu: 'Menu',
    menuNav: 'Main menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    switchTo: 'Version française',
    signature: 'The right impression, every time.',
    footerNav: 'Footer',
    house: 'The house',
    contact: 'Contact',
    follow: 'Follow',
    legal: 'Legal notice',
    rights: 'Valet service · Paris',
    scroll: 'Scroll',
    scrollLabel: 'Discover the rest of the page',
    partnersLabel: 'Partner houses',
    select: 'Select',
    honeypot: 'Leave empty',
    ctaLabel: 'Request a quote',
    ctaTitle: 'Let’s talk about the threshold of your establishment.',
    ctaButton: 'Request a proposal',
    ctaNote: 'Reply within 48 hours · Confidential exchange · No obligation',
    stats: [['MMXVI', 'Founded'], ['12,000+', 'Services delivered'], ['40+', 'Establishments served']],
  },
} as const;

export const t = (lang: Lang) => ui[lang];
