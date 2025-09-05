//* Libraries imports
import { Elysia } from 'elysia';

//* Local imports
import { storesRoutes } from './stores';

const routes = new Elysia();

routes.use(storesRoutes);

export { routes };