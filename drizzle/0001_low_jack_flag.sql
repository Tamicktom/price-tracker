PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_prices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`store_id` integer NOT NULL,
	`price` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_prices`("id", "product_id", "store_id", "price", "created_at", "updated_at") SELECT "id", "product_id", "store_id", "price", "created_at", "updated_at" FROM `prices`;--> statement-breakpoint
DROP TABLE `prices`;--> statement-breakpoint
ALTER TABLE `__new_prices` RENAME TO `prices`;--> statement-breakpoint
PRAGMA foreign_keys=ON;