//* Libraries imports
import { Elysia, t } from 'elysia';
import { eq, ilike } from 'drizzle-orm';

//* Local imports
import { db, schema } from '@/database';

const productsRoutes = new Elysia();

productsRoutes.group('/products', (app) => {
  return app
    .get(
      '/',
      async (req) => {
        const { page, limit, search } = req.query;
        const products = await db
          .select()
          .from(schema.productsTable)
          .where(
            search ? ilike(schema.productsTable.name, `%${search}%`) : undefined
          )
          .limit(limit)
          .offset((page - 1) * limit)
          .orderBy(schema.productsTable.createdAt);

        return products;
      },
      {
        detail: {
          tags: ['Products'],
          description: 'Get all products',
        },
        query: t.Object({
          page: t.Number({ default: 1, description: 'The page number' }),
          limit: t.Number({ default: 10, description: 'The number of products per page' }),
          search: t.Optional(t.String({ description: 'The search query' })),
        }),
        response: {
          200: t.Array(
            t.Object({
              id: t.Number({ description: 'The id of the product' }),
              name: t.String({ description: 'The name of the product' }),
              description: t.String({ description: 'The description of the product' }),
              brand: t.String({ description: 'The brand of the product' }),
            }),
          ),
        },
      }
    )
    .post(
      '/',
      async (req) => {
        const product = await db
          .insert(schema.productsTable)
          .values({
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return product[0];
      },
      {
        detail: {
          tags: ['Products'],
          description: 'Create a new product',
        },
        body: t.Object({
          name: t.String({ description: 'The name of the product' }),
          description: t.String({ description: 'The description of the product' }),
          brand: t.String({ description: 'The brand of the product' }),
        }),
        response: {
          200: t.Object({
            id: t.Number({ description: 'The id of the product' }),
            name: t.String({ description: 'The name of the product' }),
            description: t.String({ description: 'The description of the product' }),
            brand: t.String({ description: 'The brand of the product' }),
          }),
        },
      }
    )
    .put(
      '/:productId',
      async (req) => {
        const product = await db
          .update(schema.productsTable)
          .set({
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            updatedAt: new Date(),
          })
          .where(eq(schema.productsTable.id, req.params.productId))
          .returning();

        return product[0];
      },
      {
        detail: {
          tags: ['Products'],
          description: 'Update a product',
        },
        body: t.Object({
          name: t.String({ description: 'The name of the product' }),
          description: t.String({ description: 'The description of the product' }),
          brand: t.String({ description: 'The brand of the product' }),
        }),
        response: {
          200: t.Object({
            id: t.Number({ description: 'The id of the product' }),
            name: t.String({ description: 'The name of the product' }),
            description: t.String({ description: 'The description of the product' }),
            brand: t.String({ description: 'The brand of the product' }),
          }),
        },
        params: t.Object({
          productId: t.Number({ description: 'The id of the product' }),
        }),
      }
    )
});

export { productsRoutes };