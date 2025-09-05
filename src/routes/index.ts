//* Libraries imports
import { Elysia } from 'elysia';

//* Local imports
import { storesRoutes } from './stores';
import { productsRoutes } from './products';
import { pricesRoutes } from './prices';

const routes = new Elysia();

routes
  .use(storesRoutes)
  .use(productsRoutes)
  .use(pricesRoutes);

export { routes };