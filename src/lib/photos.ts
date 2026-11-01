// Photos du site gérées dans Sanity (document « Photos du site »).
// Un emplacement vide, ou Sanity injoignable, garde la photo d'origine : le site ne reste jamais sans image.
import { createClient } from '@sanity/client';

export const photoKeys = [
  'homeHero1', 'homeHero2', 'homeHero3', 'homeGesture', 'homeCardHotel', 'homeCardRestaurant', 'homeCardEvent', 'ctaImage',
  'servicesHero', 'servicesHotel', 'servicesRestaurant', 'servicesEvent', 'aboutHero', 'aboutTeams', 'quoteHero',
] as const;
export type PhotoKey = (typeof photoKeys)[number];

const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || '4oguvfri',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
});

// `homeHero1{ asset->{ url } }, …` : une entrée par emplacement.
const query = `*[_id == "sitePhotos"][0]{ ${photoKeys.map((k) => `${k}{ asset->{ url } }`).join(', ')} }`;

let cache: Promise<Partial<Record<PhotoKey, string>>> | undefined;

// Un seul appel par construction du site ; le résultat est partagé entre toutes les pages.
function load() {
  cache ??= client
    .fetch<Partial<Record<PhotoKey, { asset?: { url?: string } } | null>> | null>(query)
    .then((doc) => {
      const out: Partial<Record<PhotoKey, string>> = {};
      for (const key of photoKeys) {
        const url = doc?.[key]?.asset?.url;
        if (url) out[key] = `${url}?w=2000&auto=format&q=80`;
      }
      return out;
    })
    .catch(() => ({}));
  return cache;
}

/** Renvoie `photo(clé, photoParDéfaut)` : l'image Sanity si elle existe, sinon celle d'origine. */
export async function getPhotos() {
  const map = await load();
  return (key: PhotoKey, fallback: string) => map[key] ?? fallback;
}
