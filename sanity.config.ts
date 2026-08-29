import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes, SINGLETON_TYPES } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
  name: 'zneako',
  title: 'Zneako',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    // Singletons are edited only through the fixed-_id list item in
    // structure.ts — hide them from the global "create new document" menu
    // so nobody accidentally spawns a second Hero/Footer/etc.
    templates: (templates) =>
      templates.filter((template) => !SINGLETON_TYPES.has(template.schemaType)),
  },
  document: {
    // Singletons also lose "duplicate" and "delete" from their own action
    // menu, for the same reason.
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
        : input,
  },
});
