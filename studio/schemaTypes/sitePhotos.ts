import { defineField, defineType } from 'sanity';
import { ImageIcon } from '@sanity/icons';

// Chaque emplacement correspond à une photo précise du site. Laisser un champ vide
// garde la photo d'origine : le site ne reste jamais sans image.
const slot = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    description: `${description} Format conseillé : horizontal, 1920 px de large minimum.`,
    type: 'image',
    options: { hotspot: true },
  });

export const sitePhotos = defineType({
  name: 'sitePhotos',
  title: 'Photos du site',
  type: 'document',
  icon: ImageIcon,
  fields: [
    slot('homeHero1', 'Ouverture 1', 'Première photo qui défile en plein écran sur l’accueil.'),
    slot('homeHero2', 'Ouverture 2', 'Deuxième photo de l’ouverture de l’accueil.'),
    slot('homeHero3', 'Ouverture 3', 'Troisième photo de l’ouverture de l’accueil.'),
    slot('homeGesture', 'Le geste', 'Grande photo verticale à côté du titre « Premier visage à l’arrivée… ». Format portrait conseillé.'),
    slot('homeCardHotel', 'Carte Hôtels', 'Photo portrait de la carte « Hôtels » de l’accueil.'),
    slot('homeCardRestaurant', 'Carte Restaurants', 'Photo portrait de la carte « Restaurants » de l’accueil.'),
    slot('homeCardEvent', 'Carte Événements privés', 'Photo portrait de la carte « Événements privés » de l’accueil.'),
    slot('ctaImage', 'Bandeau « Demander un devis »', 'Photo en bas de l’accueil, sous le bandeau bleu.'),
    slot('servicesHero', 'Ouverture Nos services', 'Photo en plein écran en haut de la page Nos services.'),
    slot('servicesHotel', 'Service Hôtels', 'Grande photo de la prestation Hôtels.'),
    slot('servicesRestaurant', 'Service Restaurants', 'Grande photo de la prestation Restaurants.'),
    slot('servicesEvent', 'Service Événements privés', 'Grande photo de la prestation Événements privés.'),
    slot('aboutHero', 'Ouverture Qui sommes-nous', 'Photo en plein écran en haut de la page Qui sommes-nous.'),
    slot('aboutTeams', 'Nos équipes', 'Photo à côté du texte « Nos équipes ».'),
    slot('quoteHero', 'Ouverture Demande de devis', 'Photo en plein écran en haut de la page Demande de devis.'),
  ],
  preview: { prepare: () => ({ title: 'Photos du site' }) },
});
