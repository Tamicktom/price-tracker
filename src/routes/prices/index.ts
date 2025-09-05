//* Libraries imports
import { Elysia, t } from 'elysia';
import { eq, inArray } from 'drizzle-orm';

//* Local imports
import { db, schema } from '@/database';

const pricesRoutes = new Elysia();

pricesRoutes.group('/prices', (app) => {
  return app
    .get(
      '/:productId',
      async (req) => {
        const { productId } = req.params;

        const result = await db
          .select({
            date: schema.pricesTable.createdAt,
            price: schema.pricesTable.price,
            storeId: schema.pricesTable.storeId,
            storeName: schema.storesTable.name,
          })
          .from(schema.pricesTable)
          .leftJoin(schema.storesTable, eq(schema.pricesTable.storeId, schema.storesTable.id))
          .where(eq(schema.pricesTable.productId, productId))
          .groupBy(schema.pricesTable.createdAt, schema.pricesTable.storeId)
          .orderBy(schema.pricesTable.createdAt);

        type PricesByStore = {
          [storeId: `${number}`]: {
            date: Date;
            price: number;
          }[];
        }

        const stores: { id: number, name: string }[] = [];
        const pricesByStore: PricesByStore = {};

        for (const price of result) {
          //* Add store to stores array if it's not already in it
          if (!stores.some((store) => store.id === price.storeId) && price.storeName) {
            stores.push({ id: price.storeId, name: price.storeName });
          }

          //* Add price to pricesByStore object
          if (!pricesByStore[`${price.storeId}`]) {
            pricesByStore[`${price.storeId}`] = [];
          }

          pricesByStore[`${price.storeId}`].push({
            date: price.date,
            price: price.price,
          });
        }

        return {
          stores,
          pricesByStore,
        };
      },
      {
        detail: {
          tags: ['Prices'],
          description: 'Get a price by product id',
        },
        params: t.Object({
          productId: t.Number({ description: 'The id of the product' }),
        }),
      }
    )
    .post(
      "/:productId",
      async (req) => {
        const { productId } = req.params;
        const { prices } = req.body;

        const stores = await db
          .select({ id: schema.storesTable.id })
          .from(schema.storesTable)
          .where(inArray(schema.storesTable.id, prices.map((price) => price.storeId)));

        if (stores.length !== prices.length) {
          req.set.status = 400;
          return {
            error: 'Some stores do not exist',
          };
        }

        const result = await db
          .insert(schema.pricesTable)
          .values(prices.map((price) => ({
            productId,
            storeId: price.storeId,
            price: price.price,
            createdAt: new Date(),
            updatedAt: new Date(),
          })))
          .returning({
            id: schema.pricesTable.id,
            productId: schema.pricesTable.productId,
            storeId: schema.pricesTable.storeId,
            price: schema.pricesTable.price,
          });

        return {
          prices: result,
        };
      },
      {
        detail: {
          tags: ['Prices'],
          description: 'Create a price for a product',
        },
        params: t.Object({
          productId: t.Number({ description: 'The id of the product' }),
        }),
        body: t.Object({
          prices: t.Array(
            t.Object({
              storeId: t.Number({ description: 'The id of the store' }),
              price: t.Number({ description: 'The price of the product' }),
            })
          )
        }),
        response: {
          200: t.Object({
            prices: t.Array(
              t.Object({
                id: t.Number({ description: 'The id of the price' }),
                productId: t.Number({ description: 'The id of the product' }),
                storeId: t.Number({ description: 'The id of the store' }),
                price: t.Number({ description: 'The price of the product' }),
              })
            )
          }),
          400: t.Object({
            error: t.String({ description: 'The error message' }),
          }),
        }
      }
    )
});

export { pricesRoutes };