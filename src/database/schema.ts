//* Libraries imports
import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

//* Tables
export const storesTable = sqliteTable('stores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  name: text('name').notNull().unique(),
  domain: text('domain').notNull().unique(),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const productsTable = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull(),
  description: text('description').notNull(),
  brand: text('brand').notNull(),

  //* Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const linksTable = sqliteTable('links', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  productId: integer('product_id').notNull().references(() => productsTable.id, { onDelete: 'cascade' }),
  storeId: integer('store_id').notNull().references(() => storesTable.id, { onDelete: 'cascade' }),

  link: text('link').notNull().unique(),

  //* Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const pricesTable = sqliteTable('prices', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  productId: integer('product_id').notNull().references(() => productsTable.id, { onDelete: 'cascade' }),
  storeId: integer('store_id').notNull().references(() => storesTable.id, { onDelete: 'cascade' }),
  linkId: integer('link_id').notNull().references(() => linksTable.id, { onDelete: 'cascade' }),

  price: real('price').notNull(),

  //* Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});