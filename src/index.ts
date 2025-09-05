//* Libraries imports
import { Elysia } from "elysia";
import swagger from '@elysiajs/swagger';
import cors from '@elysiajs/cors';
import { staticPlugin } from "@elysiajs/static";

//* Local imports
import { routes } from "./routes";

const server = new Elysia();

server
  .use(swagger())
  .use(cors())
  .use(staticPlugin())
  .use(routes)
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${server.server?.hostname}:${server.server?.port}`
);
