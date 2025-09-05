//* Libraries imports
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

//* Local imports
import * as schema from './schema';

const sqlite = new Database(process.env.DB_FILE_NAME!);
const db = drizzle({
  client: sqlite,
  schema,
});