//* Libraries imports
import { Elysia, t } from 'elysia';

//* Local imports
import { db, schema } from '@/database';

const storesRoutes = new Elysia();

storesRoutes.group('/stores', (app) => {
  return app
    .get(
      "/",
      async () => {
        const stores = await db.select().from(schema.storesTable);
        return stores;
      },
      {
        detail: {
          tags: ['Stores'],
          description: 'Get all stores',
          response: t.Array(
            t.Object({
              id: t.Number(),
              name: t.String(),
              domain: t.String(),
            })),
        },
      }
    );
});

export { storesRoutes };