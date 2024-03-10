import { relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const room = sqliteTable(
  "room",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    roomId: integer("roomId", { mode: "number" }).unique().notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    name: text("name").notNull(),
    order: integer("order").default(0),
    type: text("type"),
  },
  (table) => ({
    roomIdIdx: uniqueIndex("roomIdIdx").on(table.roomId),
  }),
);

export const roomRelations = relations(room, ({ one }) => ({
  info: one(roomInfo),
  prices: one(price),
  blockedDate: one(blockedDate),
}));

export const roomInfo = sqliteTable("roomInfo", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  msId: integer("msId", { mode: "number" }).unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  roomId: integer("roomId", { mode: "number" })
    .unique()
    .references(() => room.roomId)
    .notNull(),
  description: text("description", { mode: "text", length: 2000 }),
  pictures: text("pictures", { mode: "json" }).$type<string[]>(),
  persons: integer("persons").default(3),
  extraPerson: integer("extraPerson", { mode: "boolean" })
    .default(true)
    .notNull(),
});

export const roomInfoRelations = relations(roomInfo, ({ one }) => ({
  room: one(room, {
    fields: [roomInfo.roomId],
    references: [room.roomId],
  }),
}));

export const blockedDate = sqliteTable("blockedDate", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  dates: text("dates", { mode: "json" }).$type<
    { from: string; to: string }[]
  >(),
  roomId: integer("roomId", { mode: "number" })
    .unique()
    .references(() => room.roomId)
    .notNull(),
});

export const blockedDateRelations = relations(blockedDate, ({ one }) => ({
  room: one(room, {
    fields: [blockedDate.roomId],
    references: [room.roomId],
  }),
}));

export const price = sqliteTable("price", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  list: text("list", { mode: "json" }).$type<Record<string, number>>(),
  roomId: integer("roomId", { mode: "number" })
    .unique()
    .references(() => room.roomId),
});

export const priceRelations = relations(price, ({ one }) => ({
  room: one(room, {
    fields: [price.roomId],
    references: [room.roomId],
  }),
}));

export const transaction = sqliteTable("transaction", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  roomId: integer("roomId", { mode: "number" })
    .unique()
    .references(() => room.roomId),
  status: text("status", { enum: ["PAID", "PENDING", "FAILED", "REFUNDED"] }),
  dateFrom: integer("dateFrom", { mode: "timestamp" }),
  dateTo: integer("dateTo", { mode: "timestamp" }),
  amount: integer("amount", { mode: "number" }),
  transactionId: text("transactionId"),
});

export const verifiedEmail = sqliteTable(
  "verifiedEmail",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    email: text("email", { mode: "text", length: 200 }).unique(),
    status: text("status", { enum: ["SUCCESS", "PENDING", "FAILED"] }),
    createdAt: integer("createdAt", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    verificationCode: text("verificationCode", { mode: "text", length: 200 }),
  },
  (table) => ({
    verifiedEmailIdx: uniqueIndex("verifiedEmailIdx").on(table.email),
  }),
);

export const reservation = sqliteTable(
  "reservation",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .notNull(),
    email: text("email", { mode: "text", length: 200 }),
    phoneNumber: text("phoneNumber", { mode: "text", length: 20 }),
    firstName: text("firstName", { mode: "text", length: 200 }),
    lastName: text("lastName", { mode: "text", length: 200 }),
    status: text("status", { enum: ["PENDING", "CONFIRMED", "CANCELLED"] }),
    price: integer("price", { mode: "number" }).default(0),
    roomId: integer("roomId", { mode: "number" }).references(() => room.roomId),
    dateFrom: integer("dateFrom", { mode: "timestamp" }).notNull(),
    dateTo: integer("dateTo", { mode: "timestamp" }).notNull(),
    error: text("error", { mode: "text", length: 2000 }),
    type: text("type", { enum: ["RESERVATION", "PAYMENT"] }),
    paymentId: text("paymentId", { mode: "text", length: 200 }),
    confirmationSent: integer("confirmationSent", { mode: "boolean" }).default(
      false,
    ),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    reservationRoomIdIdx: uniqueIndex("reservationRoomIdIdx").on(table.roomId),
  }),
);

export const reservationRelations = relations(reservation, ({ one }) => ({
  room: one(room, {
    fields: [reservation.roomId],
    references: [room.roomId],
  }),
}));

export const user = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username").notNull().unique(),
  hashed_password: text("hashed_password").notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: integer("expires_at").notNull(),
});
