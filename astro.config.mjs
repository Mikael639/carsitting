import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// URL publique du site : sert aux liens canoniques, aux aperçus de partage et au sitemap.
// À définir dans Vercel (SITE_URL) quand le domaine définitif est connu.
const site = process.env.SITE_URL || 'https://carsitting.fr';

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
