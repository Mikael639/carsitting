import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

// Un seul document « Photos du site » (singleton), sans liste ni bouton « créer ».
const singletons = ['sitePhotos'];

export default defineConfig({
  name: 'carsitting',
  title: 'CarSitting',
  projectId: '4oguvfri',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu du site')
          .items([
            S.listItem().title('Photos du site').id('sitePhotos').child(S.document().schemaType('sitePhotos').documentId('sitePhotos')),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((t) => !singletons.includes(t.schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) => (singletons.includes(schemaType) ? prev.filter((a) => a.action !== 'duplicate' && a.action !== 'delete') : prev),
    newDocumentOptions: (prev) => prev.filter((o) => !singletons.includes(o.templateId)),
  },
});
