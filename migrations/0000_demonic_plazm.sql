CREATE TABLE `blockedDate` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`dates` text,
	`roomId` integer NOT NULL,
	FOREIGN KEY (`roomId`) REFERENCES `room`(`roomId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `price` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`list` text,
	`roomId` integer,
	FOREIGN KEY (`roomId`) REFERENCES `room`(`roomId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reservation` (
	`id` text NOT NULL,
	`email` text(200),
	`phoneNumber` text(20),
	`firstName` text(200),
	`lastName` text(200),
	`status` text,
	`price` integer DEFAULT 0,
	`roomId` integer,
	`dateFrom` integer NOT NULL,
	`dateTo` integer NOT NULL,
	`error` text(2000),
	`type` text,
	`paymentId` text(200),
	`confirmationSent` integer DEFAULT false,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`roomId`) REFERENCES `room`(`roomId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `room` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`roomId` integer NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`name` text NOT NULL,
	`order` integer DEFAULT 0,
	`type` text
);
--> statement-breakpoint
CREATE TABLE `roomInfo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`msId` integer,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`roomId` integer NOT NULL,
	`description` text(2000),
	`pictures` text,
	`persons` integer DEFAULT 3,
	`extraPerson` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`roomId`) REFERENCES `room`(`roomId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transaction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`roomId` integer,
	`status` text,
	`dateFrom` integer,
	`dateTo` integer,
	`amount` integer,
	`transactionId` text,
	FOREIGN KEY (`roomId`) REFERENCES `room`(`roomId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`hashed_password` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verifiedEmail` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text(200),
	`status` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`verificationCode` text(200)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blockedDate_roomId_unique` ON `blockedDate` (`roomId`);--> statement-breakpoint
CREATE UNIQUE INDEX `price_roomId_unique` ON `price` (`roomId`);--> statement-breakpoint
CREATE UNIQUE INDEX `reservationRoomIdIdx` ON `reservation` (`roomId`);--> statement-breakpoint
CREATE UNIQUE INDEX `room_roomId_unique` ON `room` (`roomId`);--> statement-breakpoint
CREATE UNIQUE INDEX `roomIdIdx` ON `room` (`roomId`);--> statement-breakpoint
CREATE UNIQUE INDEX `roomInfo_msId_unique` ON `roomInfo` (`msId`);--> statement-breakpoint
CREATE UNIQUE INDEX `roomInfo_roomId_unique` ON `roomInfo` (`roomId`);--> statement-breakpoint
CREATE UNIQUE INDEX `transaction_roomId_unique` ON `transaction` (`roomId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `verifiedEmail_email_unique` ON `verifiedEmail` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `verifiedEmailIdx` ON `verifiedEmail` (`email`);