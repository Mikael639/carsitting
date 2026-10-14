import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://carsitting.fr',
  vite: { plugins: [tailwindcss()] },
});
