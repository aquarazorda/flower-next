CREATE TABLE `blockedDate` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`dates` text,
	`roomId` integer,
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
	`id` text,
	`email` text(200),
	`phoneNumber` text(20),
	`firstName` text(200),
	`lastName` text(200),
	`status` text,
	`price` integer DEFAULT 0,
	`roomId` integer,
	`dateFrom` integer,
	`dateTo` integer,
	`error` text(2000),
	`type` text,
	`paymentId` text(200),
	`confirmationSent` integer DEFAULT false,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`roomId`) REFERENCES `room`(`roomId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `room` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`roomId` integer,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`name` text,
	`order` integer DEFAULT 0,
	`type` text
);
--> statement-breakpoint
CREATE TABLE `roomInfo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`msId` integer,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP,
	`roomId` integer,
	`description` text(2000),
	`pictures` text,
	`persons` integer DEFAULT 3,
	`extraPerson` integer DEFAULT true,
	FOREIGN KEY (`roomId`) REFERENCES `room`(`roomId`) ON UPDATE no action ON DELETE no action
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
CREATE TABLE `verifiedEmail` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text(200),
	`status` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
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
CREATE UNIQUE INDEX `verifiedEmail_email_unique` ON `verifiedEmail` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `verifiedEmailIdx` ON `verifiedEmail` (`email`);