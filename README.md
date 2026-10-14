# CarSitting

Site vitrine de CarSitting (voituriers premium, Paris), reconstruit depuis le projet Framer.

- **Stack** : Astro 5 + Tailwind 4, GSAP + Lenis pour les animations, déploiement sur Vercel.
- **Charte** : voir [BRAND.md](BRAND.md) (choix de Jerry).

## Développement

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/
```

## Formulaires

Les formulaires de devis et de partenariat (`src/scripts/forms.ts`) postent en JSON vers `PUBLIC_FORM_ENDPOINT` si la variable est définie (Formspree, route API…). Sinon, ils ouvrent la messagerie du visiteur vers `contact@carsitting.fr`.
