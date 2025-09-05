//* Libraries imports
import { Elysia } from 'elysia';

//* Local imports
import { storesRoutes } from './stores';
import { productsRoutes } from './products';

const routes = new Elysia();

routes
  .use(storesRoutes)
  .use(productsRoutes);

export { routes };