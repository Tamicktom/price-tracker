//* Libraries imports
import { Elysia, t } from 'elysia';
import { ilike, eq } from 'drizzle-orm';

//* Local imports
import { db, schema } from '@/database';

const storesRoutes = new Elysia();

storesRoutes.group('/stores', (app) => {
  return app
    .get(
      "/",
      async (req) => {
        const { page, limit, search } = req.query;
        const stores = await db
          .select()
          .from(schema.storesTable)
          .where(
            search ? ilike(schema.storesTable.name, `%${search}%`) : undefined
          )
          .limit(limit)
          .offset((page - 1) * limit);

        return stores;
      },
      {
        detail: {
          tags: ['Stores'],
          description: 'Get all stores',
        },
        query: t.Object({
          page: t.Number({ default: 1, description: 'The page number' }),
          limit: t.Number({ default: 10, description: 'The number of stores per page' }),
          search: t.Optional(t.String({ description: 'The search query' })),
        }),
        response: {
          200: t.Array(
            t.Object({
              id: t.Number({ description: 'The id of the store' }),
              name: t.String({ description: 'The name of the store' }),
              domain: t.String({ description: 'The domain of the store' }),
            }),
            {
              description: 'The list of stores',
            }
          )
        },
      }
    )
    .post(
      "/",
      async (req) => {
        const store = await db
          .insert(schema.storesTable)
          .values([
            {
              name: req.body.name,
              domain: req.body.domain,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ])
          .returning();
        return store[0];
      },
      {
        detail: {
          tags: ['Stores'],
          description: 'Create a new store',
        },
        body: t.Object({
          name: t.String({ description: 'The name of the store' }),
          domain: t.String({ description: 'The domain of the store' }),
        }),
        response: {
          200: t.Object({
            id: t.Number({ description: 'The id of the store' }),
            name: t.String({ description: 'The name of the store' }),
            domain: t.String({ description: 'The domain of the store' }),
          }),
        },
      }
    )
});

export { storesRoutes };