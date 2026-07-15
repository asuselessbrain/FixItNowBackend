// config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config = {
  node_env: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  port: process.env.PORT || 3e3,
  salt_rounds: process.env.SALT_ROUNDS || 10,
  client_local_url: process.env.CLIENT_LOCAL_URL || "http://localhost:3000",
  client_prod_url: process.env.CLIENT_PROD_URL || "https://assignment-4-arfan.vercel.app",
  jwt: {
    token_secret: process.env.JWT_TOKEN_SECRET || "default_secret",
    token_expires_in: process.env.JWT_TOKEN_EXPIRES_IN || "1h",
    refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET || "default_refresh_secret",
    refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d"
  },
  email: {
    host: process.env.EMAIL_HOST || "",
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || ""
  },
  seedAdminData: {
    email: process.env.SEED_ADMIN_EMAIL || "admin@gmail.com",
    password: process.env.SEED_ADMIN_PASSWORD || "123456"
  },
  payment: {
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
  }
};

// lib/seedAdmin.ts
import bcrypt from "bcrypt";

// lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// prisma/generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// prisma/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum BookingStatus {\n  REQUESTED\n  REJECTED\n  CONFIRMED\n  PAID\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nmodel Bookings {\n  id         String @id @default(uuid())\n  customerId String\n  customer   User   @relation(fields: [customerId], references: [id])\n\n  serviceId String\n  service   Service @relation(fields: [serviceId], references: [id])\n\n  technicianId String\n  technician   TechnicianProfiles @relation(fields: [technicianId], references: [id])\n\n  slotId String          @unique\n  slot   TechnicianSlots @relation(fields: [slotId], references: [id], onDelete: Restrict)\n\n  totalAmount Float\n  status      BookingStatus @default(REQUESTED)\n\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  payments  Payments[]\n  review    Review?\n\n  @@index([customerId])\n  @@index([technicianId])\n  @@map("bookings")\n}\n\nmodel Categories {\n  id          String    @id @default(uuid())\n  name        String    @db.VarChar(50)\n  description String?\n  slug        String    @unique @db.VarChar(50)\n  image_url   String?\n  isActive    Boolean   @default(true)\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n  services    Service[]\n\n  @@index([slug], name: "slug_index")\n  @@map("categories")\n}\n\nmodel Payments {\n  id            String        @id @default(uuid())\n  bookingId     String        @unique\n  booking       Bookings      @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n  transactionId String        @unique\n  amount        Float\n  paymentDate   DateTime      @default(now())\n  status        PaymentStatus @default(PENDING)\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime      @updatedAt\n\n  @@map("payments")\n}\n\nenum PaymentStatus {\n  PENDING\n  SUCCESS\n  FAILED\n}\n\nmodel Review {\n  id           String             @id @default(uuid())\n  customerId   String\n  customer     User               @relation(fields: [customerId], references: [id])\n  serviceId    String\n  service      Service            @relation(fields: [serviceId], references: [id])\n  technicianId String\n  technician   TechnicianProfiles @relation(fields: [technicianId], references: [id])\n  bookingId    String             @unique\n  booking      Bookings           @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n  rating       Int\n  comment      String?            @db.Text\n  createdAt    DateTime           @default(now())\n  updatedAt    DateTime           @updatedAt\n\n  @@map("reviews")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Service {\n  id           String             @id @default(uuid())\n  name         String             @db.VarChar(100)\n  description  String?            @db.Text\n  price        Float\n  image_url    String?\n  location     String             @db.VarChar(100)\n  rating       Float              @default(0.0)\n  categoryId   String\n  category     Categories         @relation(fields: [categoryId], references: [id])\n  technicianId String\n  technician   TechnicianProfiles @relation(fields: [technicianId], references: [id])\n  createdAt    DateTime           @default(now())\n  updatedAt    DateTime           @updatedAt\n  bookings     Bookings[]\n  reviews      Review[]\n\n  @@index([categoryId], name: "category_id_index")\n  @@index([technicianId], name: "technician_id_index")\n  @@map("services")\n}\n\nmodel TechnicianProfiles {\n  id              String            @id @default(uuid())\n  userId          String            @unique\n  user            User              @relation(fields: [userId], references: [id])\n  bio             String?           @db.Text\n  experience_year Int?              @db.SmallInt\n  location        String?           @db.VarChar(100)\n  skills          String?           @db.VarChar(200)\n  average_rating  Float?            @default(0.0)\n  isAvailable     Boolean           @default(true)\n  services        Service[]\n  technicianSlots TechnicianSlots[]\n  bookings        Bookings[]\n  reviews         Review[]\n\n  @@index([userId], name: "user_id_index")\n  @@map("technician_profiles")\n}\n\nenum SlotStatus {\n  AVAILABLE\n  HOLD\n  BOOKED\n}\n\nmodel TechnicianSlots {\n  id           String             @id @default(uuid())\n  technicianId String\n  technician   TechnicianProfiles @relation(fields: [technicianId], references: [id])\n\n  date     String\n  slotTime String\n\n  status SlotStatus @default(AVAILABLE)\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  bookings  Bookings?\n\n  @@unique([technicianId, date, slotTime])\n  @@index([technicianId, status])\n  @@map("technician_slots")\n}\n\nmodel User {\n  id       String  @id @default(uuid())\n  email    String  @unique\n  name     String  @db.VarChar(50)\n  password String  @db.VarChar(100)\n  phone    String  @db.VarChar(20)\n  role     Role    @default(customer)\n  status   Status  @default(active)\n  avatar   String?\n  address  String?\n\n  passwordChangeAt DateTime @default(now())\n  createdAt        DateTime @default(now())\n  updatedAt        DateTime @updatedAt\n\n  technicianProfiles TechnicianProfiles?\n  bookings           Bookings[]\n  reviews            Review[]\n\n  @@index([email], name: "email_index")\n  @@map("users")\n}\n\nenum Role {\n  customer\n  technician\n  admin\n}\n\nenum Status {\n  active\n  banned\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"Bookings":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"BookingsToUser"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"service","kind":"object","type":"Service","relationName":"BookingsToService"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfiles","relationName":"BookingsToTechnicianProfiles"},{"name":"slotId","kind":"scalar","type":"String"},{"name":"slot","kind":"object","type":"TechnicianSlots","relationName":"BookingsToTechnicianSlots"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payments","relationName":"BookingsToPayments"},{"name":"review","kind":"object","type":"Review","relationName":"BookingsToReview"}],"dbName":"bookings"},"Categories":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"image_url","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"services","kind":"object","type":"Service","relationName":"CategoriesToService"}],"dbName":"categories"},"Payments":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Bookings","relationName":"BookingsToPayments"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"paymentDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"service","kind":"object","type":"Service","relationName":"ReviewToService"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfiles","relationName":"ReviewToTechnicianProfiles"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Bookings","relationName":"BookingsToReview"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"image_url","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Categories","relationName":"CategoriesToService"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfiles","relationName":"ServiceToTechnicianProfiles"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Bookings","relationName":"BookingsToService"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToService"}],"dbName":"services"},"TechnicianProfiles":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TechnicianProfilesToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"experience_year","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"average_rating","kind":"scalar","type":"Float"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToTechnicianProfiles"},{"name":"technicianSlots","kind":"object","type":"TechnicianSlots","relationName":"TechnicianProfilesToTechnicianSlots"},{"name":"bookings","kind":"object","type":"Bookings","relationName":"BookingsToTechnicianProfiles"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTechnicianProfiles"}],"dbName":"technician_profiles"},"TechnicianSlots":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfiles","relationName":"TechnicianProfilesToTechnicianSlots"},{"name":"date","kind":"scalar","type":"String"},{"name":"slotTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SlotStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Bookings","relationName":"BookingsToTechnicianSlots"}],"dbName":"technician_slots"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"avatar","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"passwordChangeAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technicianProfiles","kind":"object","type":"TechnicianProfiles","relationName":"TechnicianProfilesToUser"},{"name":"bookings","kind":"object","type":"Bookings","relationName":"BookingsToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"users"}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","user","orderBy","cursor","services","_count","category","technician","bookings","customer","service","booking","reviews","technicianSlots","technicianProfiles","slot","payments","review","Bookings.findUnique","Bookings.findUniqueOrThrow","Bookings.findFirst","Bookings.findFirstOrThrow","Bookings.findMany","data","Bookings.createOne","Bookings.createMany","Bookings.createManyAndReturn","Bookings.updateOne","Bookings.updateMany","Bookings.updateManyAndReturn","create","update","Bookings.upsertOne","Bookings.deleteOne","Bookings.deleteMany","having","_avg","_sum","_min","_max","Bookings.groupBy","Bookings.aggregate","Categories.findUnique","Categories.findUniqueOrThrow","Categories.findFirst","Categories.findFirstOrThrow","Categories.findMany","Categories.createOne","Categories.createMany","Categories.createManyAndReturn","Categories.updateOne","Categories.updateMany","Categories.updateManyAndReturn","Categories.upsertOne","Categories.deleteOne","Categories.deleteMany","Categories.groupBy","Categories.aggregate","Payments.findUnique","Payments.findUniqueOrThrow","Payments.findFirst","Payments.findFirstOrThrow","Payments.findMany","Payments.createOne","Payments.createMany","Payments.createManyAndReturn","Payments.updateOne","Payments.updateMany","Payments.updateManyAndReturn","Payments.upsertOne","Payments.deleteOne","Payments.deleteMany","Payments.groupBy","Payments.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","TechnicianProfiles.findUnique","TechnicianProfiles.findUniqueOrThrow","TechnicianProfiles.findFirst","TechnicianProfiles.findFirstOrThrow","TechnicianProfiles.findMany","TechnicianProfiles.createOne","TechnicianProfiles.createMany","TechnicianProfiles.createManyAndReturn","TechnicianProfiles.updateOne","TechnicianProfiles.updateMany","TechnicianProfiles.updateManyAndReturn","TechnicianProfiles.upsertOne","TechnicianProfiles.deleteOne","TechnicianProfiles.deleteMany","TechnicianProfiles.groupBy","TechnicianProfiles.aggregate","TechnicianSlots.findUnique","TechnicianSlots.findUniqueOrThrow","TechnicianSlots.findFirst","TechnicianSlots.findFirstOrThrow","TechnicianSlots.findMany","TechnicianSlots.createOne","TechnicianSlots.createMany","TechnicianSlots.createManyAndReturn","TechnicianSlots.updateOne","TechnicianSlots.updateMany","TechnicianSlots.updateManyAndReturn","TechnicianSlots.upsertOne","TechnicianSlots.deleteOne","TechnicianSlots.deleteMany","TechnicianSlots.groupBy","TechnicianSlots.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","email","name","password","phone","Role","role","Status","status","avatar","address","passwordChangeAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","technicianId","date","slotTime","SlotStatus","userId","bio","experience_year","location","skills","average_rating","isAvailable","description","price","image_url","rating","categoryId","customerId","serviceId","bookingId","comment","transactionId","amount","paymentDate","PaymentStatus","slug","isActive","slotId","totalAmount","BookingStatus","technicianId_date_slotTime","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "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-QIAIA8AAPsCACAQAAD8AgAgEQAA_QIAIJ0BAQAAAAGlAQAAANYBAqkBQAAAAAGqAUAAAAABuQEBAAAAAckBAQAAAAHKAQEAAAAB0wEBAAAAAdQBCAAAAAEBFwAALQAgCZ0BAQAAAAGlAQAAANYBAqkBQAAAAAGqAUAAAAABuQEBAAAAAckBAQAAAAHKAQEAAAAB0wEBAAAAAdQBCAAAAAEBFwAALwAwARcAAC8AMA8HAADgAgAgCQAAmwMAIAoAAN8CACAPAADhAgAgEAAA4gIAIBEAAOMCACCdAQEAtwIAIaUBAADdAtYBIqkBQAC7AgAhqgFAALsCACG5AQEAtwIAIckBAQC3AgAhygEBALcCACHTAQEAtwIAIdQBCADcAgAhAgAAAAEAIBcAADIAIAmdAQEAtwIAIaUBAADdAtYBIqkBQAC7AgAhqgFAALsCACG5AQEAtwIAIckBAQC3AgAhygEBALcCACHTAQEAtwIAIdQBCADcAgAhAgAAAAsAIBcAADQAIAIAAAALACAXAAA0ACADAAAAAQAgHgAALQAgHwAAMgAgAQAAAAEAIAEAAAALACAFBQAAkAQAICQAAJEEACAlAACUBAAgJgAAkwQAICcAAJIEACAMmgEAAJwCADCbAQAAOwAQnAEAAJwCADCdAQEA4QEAIaUBAACdAtYBIqkBQADlAQAhqgFAAOUBACG5AQEA4QEAIckBAQDhAQAhygEBAOEBACHTAQEA4QEAIdQBCACQAgAhAwAAAAsAIAIAADoAMCMAADsAIAMAAAALACACAAAMADADAAABACAMBAAAjQIAIJoBAACbAgAwmwEAAEEAEJwBAACbAgAwnQEBAAAAAZ8BAQDzAQAhqQFAAPcBACGqAUAA9wEAIcQBAQD2AQAhxgEBAPYBACHRAQEAAAAB0gEgAIsCACEBAAAAPgAgAQAAAD4AIAwEAACNAgAgmgEAAJsCADCbAQAAQQAQnAEAAJsCADCdAQEA8wEAIZ8BAQDzAQAhqQFAAPcBACGqAUAA9wEAIcQBAQD2AQAhxgEBAPYBACHRAQEA8wEAIdIBIACLAgAhAwQAAO0DACDEAQAAswIAIMYBAACzAgAgAwAAAEEAIAIAAEIAMAMAAD4AIAMAAABBACACAABCADADAAA-ACADAAAAQQAgAgAAQgAwAwAAPgAgCQQAAI8EACCdAQEAAAABnwEBAAAAAakBQAAAAAGqAUAAAAABxAEBAAAAAcYBAQAAAAHRAQEAAAAB0gEgAAAAAQEXAABGACAInQEBAAAAAZ8BAQAAAAGpAUAAAAABqgFAAAAAAcQBAQAAAAHGAQEAAAAB0QEBAAAAAdIBIAAAAAEBFwAASAAwARcAAEgAMAkEAACFBAAgnQEBALcCACGfAQEAtwIAIakBQAC7AgAhqgFAALsCACHEAQEAugIAIcYBAQC6AgAh0QEBALcCACHSASAAhQMAIQIAAAA-ACAXAABLACAInQEBALcCACGfAQEAtwIAIakBQAC7AgAhqgFAALsCACHEAQEAugIAIcYBAQC6AgAh0QEBALcCACHSASAAhQMAIQIAAABBACAXAABNACACAAAAQQAgFwAATQAgAwAAAD4AIB4AAEYAIB8AAEsAIAEAAAA-ACABAAAAQQAgBQUAAIIEACAmAACEBAAgJwAAgwQAIMQBAACzAgAgxgEAALMCACALmgEAAJoCADCbAQAAVAAQnAEAAJoCADCdAQEA4QEAIZ8BAQDhAQAhqQFAAOUBACGqAUAA5QEAIcQBAQDkAQAhxgEBAOQBACHRAQEA4QEAIdIBIACCAgAhAwAAAEEAIAIAAFMAMCMAAFQAIAMAAABBACACAABCADADAAA-ACABAAAAJQAgAQAAACUAIAMAAAAjACACAAAkADADAAAlACADAAAAIwAgAgAAJAAwAwAAJQAgAwAAACMAIAIAACQAMAMAACUAIAkLAACBBAAgnQEBAAAAAaUBAAAA0QECqQFAAAAAAaoBQAAAAAHLAQEAAAABzQEBAAAAAc4BCAAAAAHPAUAAAAABARcAAFwAIAidAQEAAAABpQEAAADRAQKpAUAAAAABqgFAAAAAAcsBAQAAAAHNAQEAAAABzgEIAAAAAc8BQAAAAAEBFwAAXgAwARcAAF4AMAkLAACABAAgnQEBALcCACGlAQAA9QLRASKpAUAAuwIAIaoBQAC7AgAhywEBALcCACHNAQEAtwIAIc4BCADcAgAhzwFAALsCACECAAAAJQAgFwAAYQAgCJ0BAQC3AgAhpQEAAPUC0QEiqQFAALsCACGqAUAAuwIAIcsBAQC3AgAhzQEBALcCACHOAQgA3AIAIc8BQAC7AgAhAgAAACMAIBcAAGMAIAIAAAAjACAXAABjACADAAAAJQAgHgAAXAAgHwAAYQAgAQAAACUAIAEAAAAjACAFBQAA-wMAICQAAPwDACAlAAD_AwAgJgAA_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_AQAAswIAIMABAACzAgAgwQEAALMCACDCAQAAswIAIAMAAAADACACAACcAQAwAwAAmQEAIAMAAAADACACAACcAQAwAwAAmQEAIAMAAAADACACAACcAQAwAwAAmQEAIA0BAADrAwAgBAAA1gMAIAgAANgDACAMAADZAwAgDQAA1wMAIJ0BAQAAAAG9AQEAAAABvgEBAAAAAb8BAgAAAAHAAQEAAAABwQEBAAAAAcIBCAAAAAHDASAAAAABARcAAKABACAInQEBAAAAAb0BAQAAAAG-AQEAAAABvwECAAAAAcABAQAAAAHBAQEAAAABwgEIAAAAAcMBIAAAAAEBFwAAogEAMAEXAACiAQAwDQEAAOoDACAEAACGAwAgCAAAiAMAIAwAAIkDACANAACHAwAgnQEBALcCACG9AQEAtwIAIb4BAQC6AgAhvwECAIMDACHAAQEAugIAIcEBAQC6AgAhwgEIAIQDACHDASAAhQMAIQIAAACZAQAgFwAApQEAIAidAQEAtwIAIb0BAQC3AgAhvgEBALoCACG_AQIAgwMAIcABAQC6AgAhwQEBALoCACHCAQgAhAMAIcMBIACFAwAhAgAAAAMAIBcAAKcBACACAAAAAwAgFwAApwEAIAMAAACZAQAgHgAAoAEAIB8AAKUBACABAAAAmQEAIAEAAAADACAKBQAA5QMAICQAAOYDACAlAADpAwAgJgAA6AMAICcAAOcDACC-AQAAswIAIL8BAACzAgAgwAEAALMCACDBAQAAswIAIMIBAACzAgAgC5oBAAD_AQAwmwEAAK4BABCcAQAA_wEAMJ0BAQDhAQAhvQEBAOEBACG-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_gEAICcAAP4BACCrAQAAAL0BAqwBAAAAvQEIrQEAAAC9AQiyAQAA_QG9ASIHBQAA5wEAICYAAP4BACAnAAD-AQAgqwEAAAC9AQKsAQAAAL0BCK0BAAAAvQEIsgEAAP0BvQEiBKsBAAAAvQECrAEAAAC9AQitAQAAAL0BCLIBAAD-Ab0BIguaAQAA_wEAMJsBAACuAQAQnAEAAP8BADCdAQEA4QEAIb0BAQDhAQAhvgEBAOQBACG_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_gG9ASISAQAAjAIAIAQAAI0CACAIAAD5AQAgDAAA-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-QIAIA8AAPsCACAQAAD8AgAgEQAA_QIAIJ0BAQAAAAGlAQAAANYBAqkBQAAAAAGqAUAAAAABuQEBAAAAAcoBAQAAAAHTAQEAAAAB1AEIAAAAAQMeAADEBAAg2QEAAMUEACDfAQAABwAgAx4AAMIEACDZAQAAwwQAIN8BAACZAQAgAx4AAMAEACDZAQAAwQQAIN8BAAAWACAEHgAA6wIAMNkBAADsAgAw2wEAAO4CACDfAQAA7wIAMAMeAADkAgAg2QEAAOUCACDfAQAAEAAgCwQAANYDACAIAADYAwAgDAAA2QMAIA0AANcDACCdAQEAAAABvgEBAAAAAb8BAgAAAAHAAQEAAAABwQEBAAAAAcIBCAAAAAHDASAAAAABAgAAAJkBACAeAAD-AgAgAwAAAAMAIB4AAP4CACAfAACCAwAgDQAAAAMAIAQAAIYDACAIAACIAwAgDAAAiQMAIA0AAIcDACAXAACCAwAgnQEBALcCACG-AQEAugIAIb8BAgCDAwAhwAEBALoCACHBAQEAugIAIcIBCACEAwAhwwEgAIUDACELBAAAhgMAIAgAAIgDACAMAACJAwAgDQAAhwMAIJ0BAQC3AgAhvgEBALoCACG_AQIAgwMAIcABAQC6AgAhwQEBALoCACHCAQgAhAMAIcMBIACFAwAhBdwBAgAAAAHiAQIAAAAB4wECAAAAAeQBAgAAAAHlAQIAAAABBdwBCAAAAAHiAQgAAAAB4wEIAAAAAeQBCAAAAAHlAQgAAAABAdwBIAAAAAELHgAAsgMAMB8AALcDADDZAQAAswMAMNoBAAC0AwAw2wEAALUDACDcAQAAtgMAMN0BAAC2AwAw3gEAALYDADDfAQAAtgMAMOABAAC4AwAw4QEAALkDADALHgAAngMAMB8AAKMDADDZAQAAnwMAMNoBAACgAwAw2wEAAKEDACDcAQAAogMAMN0BAACiAwAw3gEAAKIDADDfAQAAogMAMOABAACkAwAw4QEAAKUDADALHgAAkwMAMB8AAJcDADDZAQAAlAMAMNoBAACVAwAw2wEAAJYDACDcAQAA1gIAMN0BAADWAgAw3gEAANYCADDfAQAA1gIAMOABAACYAwAw4QEAANkCADALHgAAigMAMB8AAI4DADDZAQAAiwMAMNoBAACMAwAw2wEAAI0DACDcAQAAwwIAMN0BAADDAgAw3gEAAMMCADDfAQAAwwIAMOABAACPAwAw4QEAAMYCADALCQAA6gIAIAoAAM8CACALAADRAgAgnQEBAAAAAakBQAAAAAGqAUAAAAABxwECAAAAAckBAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAECAAAAEAAgHgAAkgMAIAMAAAAQACAeAACSAwAgHwAAkQMAIAEXAAC_BAAwAgAAABAAIBcAAJEDACACAAAAxwIAIBcAAJADACAInQEBALcCACGpAUAAuwIAIaoBQAC7AgAhxwECAMkCACHJAQEAtwIAIcoBAQC3AgAhywEBALcCACHMAQEAugIAIQsJAADpAgAgCgAAywIAIAsAAM0CACCdAQEAtwIAIakBQAC7AgAhqgFAALsCACHHAQIAyQIAIckBAQC3AgAhygEBALcCACHLAQEAtwIAIcwBAQC6AgAhCwkAAOoCACAKAADPAgAgCwAA0QIAIJ0BAQAAAAGpAUAAAAABqgFAAAAAAccBAgAAAAHJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABDQkAAJ0DACAKAAD5AgAgDwAA-wIAIBAAAPwCACARAAD9AgAgnQEBAAAAAaUBAAAA1gECqQFAAAAAAaoBQAAAAAHJAQEAAAABygEBAAAAAdMBAQAAAAHUAQgAAAABAgAAAAEAIB4AAJwDACADAAAAAQAgHgAAnAMAIB8AAJoDACABFwAAvgQAMAIAAAABACAXAACaAwAgAgAAANoCACAXAACZAwAgCJ0BAQC3AgAhpQEAAN0C1gEiqQFAALsCACGqAUAAuwIAIckBAQC3AgAhygEBALcCACHTAQEAtwIAIdQBCADcAgAhDQkAAJsDACAKAADfAgAgDwAA4QIAIBAAAOICACARAADjAgAgnQEBALcCACGlAQAA3QLWASKpAUAAuwIAIaoBQAC7AgAhyQEBALcCACHKAQEAtwIAIdMBAQC3AgAh1AEIANwCACEFHgAAuQQAIB8AALwEACDZAQAAugQAINoBAAC7BAAg3wEAAMcBACANCQAAnQMAIAoAAPkCACAPAAD7AgAgEAAA_AIAIBEAAP0CACCdAQEAAAABpQEAAADWAQKpAUAAAAABqgFAAAAAAckBAQAAAAHKAQEAAAAB0wEBAAAAAdQBCAAAAAEDHgAAuQQAINkBAAC6BAAg3wEAAMcBACAHCAAAsQMAIJ0BAQAAAAGlAQAAAL0BAqkBQAAAAAGqAUAAAAABugEBAAAAAbsBAQAAAAECAAAAFgAgHgAAsAMAIAMAAAAWACAeAACwAwAgHwAAqQMAIAEXAAC4BAAwDQcAAKcCACAIAACoAgAgmgEAAKUCADCbAQAAFAAQnAEAAKUCADCdAQEAAAABpQEAAKYCvQEiqQFAAPcBACGqAUAA9wEAIbkBAQDzAQAhugEBAPMBACG7AQEA8wEAIdYBAACkAgAgAgAAABYAIBcAAKkDACACAAAApgMAIBcAAKcDACAKmgEAAKUDADCbAQAApgMAEJwBAAClAwAwnQEBAPMBACGlAQAApgK9ASKpAUAA9wEAIaoBQAD3AQAhuQEBAPMBACG6AQEA8wEAIbsBAQDzAQAhCpoBAAClAwAwmwEAAKYDABCcAQAApQMAMJ0BAQDzAQAhpQEAAKYCvQEiqQFAAPcBACGqAUAA9wEAIbkBAQDzAQAhugEBAPMBACG7AQEA8wEAIQadAQEAtwIAIaUBAACoA70BIqkBQAC7AgAhqgFAALsCACG6AQEAtwIAIbsBAQC3AgAhAdwBAAAAvQECBwgAAKoDACCdAQEAtwIAIaUBAACoA70BIqkBQAC7AgAhqgFAALsCACG6AQEAtwIAIbsBAQC3AgAhBx4AAKsDACAfAACuAwAg2QEAAKwDACDaAQAArQMAIN0BAAALACDeAQAACwAg3wEAAAEAIA0HAAD6AgAgCQAAnQMAIAoAAPkCACAQAAD8AgAgEQAA_QIAIJ0BAQAAAAGlAQAAANYBAqkBQAAAAAGqAUAAAAABuQEBAAAAAckBAQAAAAHKAQEAAAAB1AEIAAAAAQIAAAABACAeAACrAwAgAwAAAAsAIB4AAKsDACAfAACvAwAgDwAAAAsAIAcAAOACACAJAACbAwAgCgAA3wIAIBAAAOICACARAADjAgAgFwAArwMAIJ0BAQC3AgAhpQEAAN0C1gEiqQFAALsCACGqAUAAuwIAIbkBAQC3AgAhyQEBALcCACHKAQEAtwIAIdQBCADcAgAhDQcAAOACACAJAACbAwAgCgAA3wIAIBAAAOICACARAADjAgAgnQEBALcCACGlAQAA3QLWASKpAUAAuwIAIaoBQAC7AgAhuQEBALcCACHJAQEAtwIAIcoBAQC3AgAh1AEIANwCACEHCAAAsQMAIJ0BAQAAAAGlAQAAAL0BAqkBQAAAAAGqAUAAAAABugEBAAAAAbsBAQAAAAEDHgAAqwMAINkBAACsAwAg3wEAAAEAIA0GAADTAwAgCAAA1AMAIAwAANUDACCdAQEAAAABnwEBAAAAAakBQAAAAAGqAUAAAAABwAEBAAAAAcQBAQAAAAHFAQgAAAABxgEBAAAAAccBCAAAAAHIAQEAAAABAgAAAAcAIB4AANIDACADAAAABwAgHgAA0gMAIB8AALwDACABFwAAtwQAMBIGAACyAgAgBwAApwIAIAgAAPkBACAMAAD6AQAgmgEAALECADCbAQAABQAQnAEAALECADCdAQEAAAABnwEBAPMBACGpAUAA9wEAIaoBQAD3AQAhuQEBAPMBACHAAQEA8wEAIcQBAQD2AQAhxQEIAKECACHGAQEA9gEAIccBCAChAgAhyAEBAPMBACECAAAABwAgFwAAvAMAIAIAAAC6AwAgFwAAuwMAIA6aAQAAuQMAMJsBAAC6AwAQnAEAALkDADCdAQEA8wEAIZ8BAQDzAQAhqQFAAPcBACGqAUAA9wEAIbkBAQDzAQAhwAEBAPMBACHEAQEA9gEAIcUBCAChAgAhxgEBAPYBACHHAQgAoQIAIcgBAQDzAQAhDpoBAAC5AwAwmwEAALoDABCcAQAAuQMAMJ0BAQDzAQAhnwEBAPMBACGpAUAA9wEAIaoBQAD3AQAhuQEBAPMBACHAAQEA8wEAIcQBAQD2AQAhxQEIAKECACHGAQEA9gEAIccBCAChAgAhyAEBAPMBACEKnQEBALcCACGfAQEAtwIAIakBQAC7AgAhqgFAALsCACHAAQEAtwIAIcQBAQC6AgAhxQEIANwCACHGAQEAugIAIccBCADcAgAhyAEBALcCACENBgAAvQMAIAgAAL4DACAMAAC_AwAgnQEBALcCACGfAQEAtwIAIakBQAC7AgAhqgFAALsCACHAAQEAtwIAIcQBAQC6AgAhxQEIANwCACHGAQEAugIAIccBCADcAgAhyAEBALcCACEFHgAAsAQAIB8AALUEACDZAQAAsQQAINoBAAC0BAAg3wEAAD4AIAseAADJAwAwHwAAzQMAMNkBAADKAwAw2gEAAMsDADDbAQAAzAMAINwBAADWAgAw3QEAANYCADDeAQAA1gIAMN8BAADWAgAw4AEAAM4DADDhAQAA2QIAMAseAADAAwAwHwAAxAMAMNkBAADBAwAw2gEAAMIDADDbAQAAwwMAINwBAADDAgAw3QEAAMMCADDeAQAAwwIAMN8BAADDAgAw4AEAAMUDADDhAQAAxgIAMAsHAADQAgAgCQAA6gIAIAsAANECACCdAQEAAAABqQFAAAAAAaoBQAAAAAG5AQEAAAABxwECAAAAAckBAQAAAAHLAQEAAAABzAEBAAAAAQIAAAAQACAeAADIAwAgAwAAABAAIB4AAMgDACAfAADHAwAgARcAALMEADACAAAAEAAgFwAAxwMAIAIAAADHAgAgFwAAxgMAIAidAQEAtwIAIakBQAC7AgAhqgFAALsCACG5AQEAtwIAIccBAgDJAgAhyQEBALcCACHLAQEAtwIAIcwBAQC6AgAhCwcAAMwCACAJAADpAgAgCwAAzQIAIJ0BAQC3AgAhqQFAALsCACGqAUAAuwIAIbkBAQC3AgAhxwECAMkCACHJAQEAtwIAIcsBAQC3AgAhzAEBALoCACELBwAA0AIAIAkAAOoCACALAADRAgAgnQEBAAAAAakBQAAAAAGqAUAAAAABuQEBAAAAAccBAgAAAAHJAQEAAAABywEBAAAAAcwBAQAAAAENBwAA-gIAIAkAAJ0DACAPAAD7AgAgEAAA_AIAIBEAAP0CACCdAQEAAAABpQEAAADWAQKpAUAAAAABqgFAAAAAAbkBAQAAAAHJAQEAAAAB0wEBAAAAAdQBCAAAAAECAAAAAQAgHgAA0QMAIAMAAAABACAeAADRAwAgHwAA0AMAIAEXAACyBAAwAgAAAAEAIBcAANADACACAAAA2gIAIBcAAM8DACAInQEBALcCACGlAQAA3QLWASKpAUAAuwIAIaoBQAC7AgAhuQEBALcCACHJAQEAtwIAIdMBAQC3AgAh1AEIANwCACENBwAA4AIAIAkAAJsDACAPAADhAgAgEAAA4gIAIBEAAOMCACCdAQEAtwIAIaUBAADdAtYBIqkBQAC7AgAhqgFAALsCACG5AQEAtwIAIckBAQC3AgAh0wEBALcCACHUAQgA3AIAIQ0HAAD6AgAgCQAAnQMAIA8AAPsCACAQAAD8AgAgEQAA_QIAIJ0BAQAAAAGlAQAAANYBAqkBQAAAAAGqAUAAAAABuQEBAAAAAckBAQAAAAHTAQEAAAAB1AEIAAAAAQ0GAADTAwAgCAAA1AMAIAwAANUDACCdAQEAAAABnwEBAAAAAakBQAAAAAGqAUAAAAABwAEBAAAAAcQBAQAAAAHFAQgAAAABxgEBAAAAAccBCAAAAAHIAQEAAAABAx4AALAEACDZAQAAsQQAIN8BAAA-ACAEHgAAyQMAMNkBAADKAwAw2wEAAMwDACDfAQAA1gIAMAQeAADAAwAw2QEAAMEDADDbAQAAwwMAIN8BAADDAgAwBB4AALIDADDZAQAAswMAMNsBAAC1AwAg3wEAALYDADAEHgAAngMAMNkBAACfAwAw2wEAAKEDACDfAQAAogMAMAQeAACTAwAw2QEAAJQDADDbAQAAlgMAIN8BAADWAgAwBB4AAIoDADDZAQAAiwMAMNsBAACNAwAg3wEAAMMCADADHgAA_gIAINkBAAD_AgAg3wEAAJkBACAEHgAA0gIAMNkBAADTAgAw2wEAANUCACDfAQAA1gIAMAQeAAC_AgAw2QEAAMACADDbAQAAwgIAIN8BAADDAgAwCgEAAOwDACAEAADtAwAgCAAA3gMAIAwAAN8DACANAADuAwAgvgEAALMCACC_AQAAswIAIMABAACzAgAgwQEAALMCACDCAQAAswIAIAAAAAAABR4AAKsEACAfAACuBAAg2QEAAKwEACDaAQAArQQAIN8BAACZAQAgAx4AAKsEACDZAQAArAQAIN8BAACZAQAgAAAAAAAFHgAApgQAIB8AAKkEACDZAQAApwQAINoBAACoBAAg3wEAAMcBACADHgAApgQAINkBAACnBAAg3wEAAMcBACAFCAAA3gMAIAwAAN8DACAOAADdAwAgpgEAALMCACCnAQAAswIAIAAAAAAAAAAFHgAAoQQAIB8AAKQEACDZAQAAogQAINoBAACjBAAg3wEAAJkBACADHgAAoQQAINkBAACiBAAg3wEAAJkBACAAAAAAAAAAAAAABR4AAJwEACAfAACfBAAg2QEAAJ0EACDaAQAAngQAIN8BAAABACADHgAAnAQAINkBAACdBAAg3wEAAAEAIAAAAAseAACGBAAwHwAAigQAMNkBAACHBAAw2gEAAIgEADDbAQAAiQQAINwBAAC2AwAw3QEAALYDADDeAQAAtgMAMN8BAAC2AwAw4AEAAIsEADDhAQAAuQMAMA0HAAD1AwAgCAAA1AMAIAwAANUDACCdAQEAAAABnwEBAAAAAakBQAAAAAGqAUAAAAABuQEBAAAAAcABAQAAAAHEAQEAAAABxQEIAAAAAcYBAQAAAAHHAQgAAAABAgAAAAcAIB4AAI4EACADAAAABwAgHgAAjgQAIB8AAI0EACABFwAAmwQAMAIAAAAHACAXAACNBAAgAgAAALoDACAXAACMBAAgCp0BAQC3AgAhnwEBALcCACGpAUAAuwIAIaoBQAC7AgAhuQEBALcCACHAAQEAtwIAIcQBAQC6AgAhxQEIANwCACHGAQEAugIAIccBCADcAgAhDQcAAPQDACAIAAC-AwAgDAAAvwMAIJ0BAQC3AgAhnwEBALcCACGpAUAAuwIAIaoBQAC7AgAhuQEBALcCACHAAQEAtwIAIcQBAQC6AgAhxQEIANwCACHGAQEAugIAIccBCADcAgAhDQcAAPUDACAIAADUAwAgDAAA1QMAIJ0BAQAAAAGfAQEAAAABqQFAAAAAAaoBQAAAAAG5AQEAAAABwAEBAAAAAcQBAQAAAAHFAQgAAAABxgEBAAAAAccBCAAAAAEEHgAAhgQAMNkBAACHBAAw2wEAAIkEACDfAQAAtgMAMAAAAAAABgcAAN0DACAJAADsAwAgCgAAlgQAIA8AAJcEACAQAACYBAAgEQAAmQQAIAYGAACaBAAgBwAA3QMAIAgAAN4DACAMAADfAwAgxAEAALMCACDGAQAAswIAIAIHAADdAwAgCAAAlQQAIAAFBwAA3QMAIAkAAOwDACAKAACWBAAgCwAAlQQAIMwBAACzAgAgAwQAAO0DACDEAQAAswIAIMYBAACzAgAgCp0BAQAAAAGfAQEAAAABqQFAAAAAAaoBQAAAAAG5AQEAAAABwAEBAAAAAcQBAQAAAAHFAQgAAAABxgEBAAAAAccBCAAAAAEOBwAA-gIAIAkAAJ0DACAKAAD5AgAgDwAA-wIAIBEAAP0CACCdAQEAAAABpQEAAADWAQKpAUAAAAABqgFAAAAAAbkBAQAAAAHJAQEAAAABygEBAAAAAdMBAQAAAAHUAQgAAAABAgAAAAEAIB4AAJwEACADAAAACwAgHgAAnAQAIB8AAKAEACAQAAAACwAgBwAA4AIAIAkAAJsDACAKAADfAgAgDwAA4QIAIBEAAOMCACAXAACgBAAgnQEBALcCACGlAQAA3QLWASKpAUAAuwIAIaoBQAC7AgAhuQEBALcCACHJAQEAtwIAIcoBAQC3AgAh0wEBALcCACHUAQgA3AIAIQ4HAADgAgAgCQAAmwMAIAoAAN8CACAPAADhAgAgEQAA4wIAIJ0BAQC3AgAhpQEAAN0C1gEiqQFAALsCACGqAUAAuwIAIbkBAQC3AgAhyQEBALcCACHKAQEAtwIAIdMBAQC3AgAh1AEIANwCACEMAQAA6wMAIAgAANgDACAMAADZAwAgDQAA1wMAIJ0BAQAAAAG9AQEAAAABvgEBAAAAAb8BAgAAAAHAAQEAAAABwQEBAAAAAcIBCAAAAAHDASAAAAABAgAAAJkBACAeAAChBAAgAwAAAAMAIB4AAKEEACAfAAClBAAgDgAAAAMAIAEAAOoDACAIAACIAwAgDAAAiQMAIA0AAIcDACAXAAClBAAgnQEBALcCACG9AQEAtwIAIb4BAQC6AgAhvwECAIMDACHAAQEAugIAIcEBAQC6AgAhwgEIAIQDACHDASAAhQMAIQwBAADqAwAgCAAAiAMAIAwAAIkDACANAACHAwAgnQEBALcCACG9AQEAtwIAIb4BAQC6AgAhvwECAIMDACHAAQEAugIAIcEBAQC6AgAhwgEIAIQDACHDASAAhQMAIQ4IAADbAwAgDAAA3AMAIJ0BAQAAAAGeAQEAAAABnwEBAAAAAaABAQAAAAGhAQEAAAABowEAAACjAQKlAQAAAKUBAqYBAQAAAAGnAQEAAAABqAFAAAAAAakBQAAAAAGqAUAAAAABAgAAAMcBACAeAACmBAAgAwAAAMoBACAeAACmBAAgHwAAqgQAIBAAAADKAQAgCAAAvQIAIAwAAL4CACAXAACqBAAgnQEBALcCACGeAQEAtwIAIZ8BAQC3AgAhoAEBALcCACGhAQEAtwIAIaMBAAC4AqMBIqUBAAC5AqUBIqYBAQC6AgAhpwEBALoCACGoAUAAuwIAIakBQAC7AgAhqgFAALsCACEOCAAAvQIAIAwAAL4CACCdAQEAtwIAIZ4BAQC3AgAhnwEBALcCACGgAQEAtwIAIaEBAQC3AgAhowEAALgCowEipQEAALkCpQEipgEBALoCACGnAQEAugIAIagBQAC7AgAhqQFAALsCACGqAUAAuwIAIQwBAADrAwAgBAAA1gMAIAgAANgDACAMAADZAwAgnQEBAAAAAb0BAQAAAAG-AQEAAAABvwECAAAAAcABAQAAAAHBAQEAAAABwgEIAAAAAcMBIAAAAAECAAAAmQEAIB4AAKsEACADAAAAAwAgHgAAqwQAIB8AAK8EACAOAAAAAwAgAQAA6gMAIAQAAIYDACAIAACIAwAgDAAAiQMAIBcAAK8EACCdAQEAtwIAIb0BAQC3AgAhvgEBALoCACG_AQIAgwMAIcABAQC6AgAhwQEBALoCACHCAQgAhAMAIcMBIACFAwAhDAEAAOoDACAEAACGAwAgCAAAiAMAIAwAAIkDACCdAQEAtwIAIb0BAQC3AgAhvgEBALoCACG_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_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-tQEJf7cBCYABuQEOgQG6AUOCAbwBCYMBvgEOhAG_AUSFAcABCYYBwQEJhwHCAQ6IAcUBRYkBxgFJigHIAQKLAckBAowBzAECjQHNAQKOAc4BAo8B0AECkAHSAQ6RAdMBSpIB1QECkwHXAQ6UAdgBS5UB2QEClgHaAQKXAdsBDpgB3gFMmQHfAVA"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// prisma/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/prisma/enums.ts
var BookingStatus = {
  REQUESTED: "REQUESTED",
  REJECTED: "REJECTED",
  CONFIRMED: "CONFIRMED",
  PAID: "PAID",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
};
var SlotStatus = {
  AVAILABLE: "AVAILABLE",
  HOLD: "HOLD",
  BOOKED: "BOOKED"
};
var Role = {
  customer: "customer",
  technician: "technician",
  admin: "admin"
};
var Status = {
  active: "active",
  banned: "banned"
};

// prisma/generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// lib/seedAdmin.ts
var seedAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash(config.seedAdminData.password, Number(config.salt_rounds));
    if (!config.seedAdminData.email || !config.seedAdminData.password) {
      console.warn("Admin email or password not provided. Skipping admin seeding.");
      return;
    }
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: config.seedAdminData.email
      }
    });
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: config.seedAdminData.email,
          name: "Mahmudul Hasan",
          password: hashedPassword,
          phone: "+8801712345678",
          role: Role.admin,
          status: Status.active,
          avatar: "https://api.yourdomain.com/uploads/avatars/admin-profile.png",
          address: "Dhaka, Bangladesh"
        }
      });
      if (process.env.NODE_ENV === "development") {
        console.log("Admin user seeded successfully.");
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error seeding admin user:", error);
    }
  }
};

// src/app.ts
import express2 from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// src/middlewares/notFound.ts
var notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    data: null
  });
};

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    errorMessage: message,
    error: err,
    data: null
  });
};

// src/routes/router.ts
import express from "express";

// src/app/modules/user/user.route.ts
import { Router } from "express";

// lib/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/modules/user/user.service.ts
import bcrypt2 from "bcrypt";

// src/helpers/filterHelper.ts
var filterHelper = (whereCondition, filters, allowedFilterFields) => {
  const filterKeys = Object.keys(filters);
  if (filterKeys.length > 0) {
    filterKeys.forEach((key) => {
      const value = filters[key];
      if (allowedFilterFields.includes(key) && value !== void 0 && value !== null && value !== "") {
        if (key.includes(".")) {
          const parts = key.split(".");
          const nestedFilterObj = {};
          let current = nestedFilterObj;
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
              current[part] = value === "true" ? true : value === "false" ? false : value;
            } else {
              current[part] = {};
              current = current[part];
            }
          }
          whereCondition.push(nestedFilterObj);
        } else {
          whereCondition.push({
            [key]: value === "true" ? true : value === "false" ? false : value
          });
        }
      }
    });
  }
  return whereCondition;
};

// src/helpers/paginationHelper.ts
var paginationHelper = (page, limit) => {
  const take = limit ? parseInt(limit) : 10;
  const skip = page ? (parseInt(page) - 1) * take : 0;
  return { take, skip };
};

// src/helpers/searchingHelper.ts
var searchingHelper = (whereCondition, allowedSearchFields, searchTerm) => {
  if (searchTerm) {
    const orCondition = allowedSearchFields.map((field) => {
      if (field.includes(".")) {
        const parts = field.split(".");
        const condition = {};
        let currentLevel = condition;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (i === parts.length - 1) {
            currentLevel[part] = { contains: searchTerm, mode: "insensitive" };
          } else {
            currentLevel[part] = {};
            currentLevel = currentLevel[part];
          }
        }
        return condition;
      }
      return { [field]: { contains: searchTerm, mode: "insensitive" } };
    });
    whereCondition.push({ OR: orCondition });
  }
  return whereCondition;
};

// src/helpers/sortingHelper.ts
var sortingHelper = (allowedSortFields, sortBy, sort) => {
  const sortCondition = {};
  if (sortBy && allowedSortFields.includes(sortBy)) {
    const sortOrder = sort === "asc" ? "asc" : "desc";
    if (sortBy.includes(".")) {
      const fields = sortBy.split(".");
      let currentLevel = sortCondition;
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (i === fields.length - 1) {
          currentLevel[field] = sortOrder;
        } else {
          currentLevel = currentLevel[field] = {};
        }
      }
    } else {
      sortCondition[sortBy] = sortOrder;
    }
  } else {
    sortCondition["createdAt"] = "desc";
  }
  return sortCondition;
};

// lib/jwt.ts
import jwt from "jsonwebtoken";
var jwtGenerator = ({ userInfo, createSecretKey, expiresIn }) => {
  const token = jwt.sign({ email: userInfo.email, role: userInfo.role }, createSecretKey, { expiresIn });
  return token;
};
var jwtVerifier = ({ token, secretKey }) => {
  const decoded = jwt.verify(token, secretKey);
  return decoded;
};

// src/middlewares/appError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack) {
    super(message);
    this.statusCode = statusCode;
    this.stack = stack || new Error().stack;
  }
};

// src/app/modules/user/user.service.ts
var createUser = async (payload) => {
  const hashedPassword = await bcrypt2.hash(payload.password, Number(config.salt_rounds));
  if (payload.role && payload.role === Role.admin) {
    throw new AppError(403, "You are not allowed to create an admin user");
  }
  const userData = {
    ...payload,
    password: hashedPassword
  };
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData
    });
    if (payload.role === Role.technician) {
      await tx.technicianProfiles.create({
        data: {
          userId: user.id
        }
      });
    }
    return user;
  });
  const accessToken = jwtGenerator({
    userInfo: { email: result.email, role: result.role },
    createSecretKey: config.jwt.token_secret,
    expiresIn: config.jwt.token_expires_in
  });
  const refreshToken = jwtGenerator({
    userInfo: { email: result.email, role: result.role },
    createSecretKey: config.jwt.refresh_token_secret,
    expiresIn: config.jwt.refresh_token_expires_in
  });
  return { ...result, accessToken, refreshToken };
};
var getAllUsers = async (query) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = query;
  const whereConditions = [];
  const allowedSearchFields = ["name", "email", "phone"];
  const allowedFilterFields = ["role", "status"];
  const allowedSortFields = ["name", "email", "createdAt", "updatedAt", "role", "status"];
  searchingHelper(whereConditions, allowedSearchFields, searchTerm);
  filterHelper(whereConditions, filters, allowedFilterFields);
  const { take, skip } = paginationHelper(page, limit);
  const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);
  const result = await prisma.user.findMany({
    where: {
      AND: whereConditions
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      avatar: true,
      address: true,
      createdAt: true,
      updatedAt: true
    },
    take,
    skip,
    orderBy: sortCondition
  });
  const total = await prisma.user.count({
    where: {
      AND: whereConditions
    }
  });
  const totalPages = Math.ceil(total / take);
  const meta = {
    total,
    totalPages,
    currentPage: query.page ? parseInt(query.page) : 1,
    limit: take
  };
  return { meta, result };
};
var updateUserStatus = async (userId, payload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  if (isUserExist.role === Role.admin) {
    throw new AppError(400, "Cannot change the status of an admin user");
  }
  const result = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: payload.status
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      avatar: true,
      address: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return result;
};
var userService = {
  createUser,
  getAllUsers,
  updateUserStatus
};

// lib/response.ts
var sendResponse = (res, json) => {
  res.status(json?.statusCode).json({
    success: true,
    message: json?.message,
    meta: json?.meta,
    data: json?.data
  });
};
var response_default = sendResponse;

// src/app/modules/user/user.controller.ts
var createUser2 = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  res.cookie("accessToken", result.accessToken, { secure: false, httpOnly: true });
  res.cookie("refreshToken", result.refreshToken, { secure: false, httpOnly: true });
  response_default(res, {
    statusCode: 201,
    message: "User created successfully!",
    data: result
  });
});
var getAllUsers2 = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
  response_default(res, {
    statusCode: 200,
    message: "Users retrieved successfully!",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userService.updateUserStatus(userId, req.body);
  response_default(res, {
    statusCode: 200,
    message: "User status updated successfully!",
    data: result
  });
});
var userController = {
  createUser: createUser2,
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2
};

// src/middlewares/auth.ts
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(401, "Invalid signature");
      }
      const bearerToken = token.split(" ")[1];
      let decoded;
      try {
        decoded = jwtVerifier({
          token: bearerToken,
          secretKey: config.jwt.token_secret
        });
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          throw new AppError(401, "Access token expired");
        }
        if (err.name === "JsonWebTokenError") {
          throw new AppError(401, "Invalid token");
        }
        throw new AppError(401, "Unauthorized");
      }
      console.log(decoded);
      const user = await prisma.user.findUnique({
        where: {
          email: decoded.email,
          status: Status.active
        }
      });
      if (!user) {
        throw new AppError(404, "User not found");
      }
      if (roles.length && !roles.includes(user.role)) {
        throw new AppError(403, "Unauthorized to access this resource");
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/app/modules/user/user.route.ts
var router = Router();
router.post("/", userController.createUser);
router.get("/", auth_default(Role.admin), userController.getAllUsers);
router.patch("/:userId/status", auth_default(Role.admin), userController.updateUserStatus);
var userRouter = router;

// src/app/modules/auth/auth.router.ts
import { Router as Router2 } from "express";

// src/app/modules/auth/auth.service.ts
import bcrypt3 from "bcrypt";

// lib/emailSender.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: config.email.host,
  port: parseInt(config.email.port),
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});
var sendEmail = async (to, subject, text, html) => {
  const info = await transporter.sendMail({
    from: `"FixItNow" <${config.email.user}>`,
    to,
    subject,
    text,
    html
  });
  console.log("Message sent:", info.messageId);
};

// lib/emailTempletes/resetPasswordTemplete.ts
var resetPasswordHtml = (url) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #fff7ed; font-family: Arial, sans-serif; color: #1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%); padding: 32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #fed7aa; box-shadow: 0 18px 45px rgba(194, 65, 12, 0.12);">
            <tr>
              <td style="padding: 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #ea580c 0%, #f97316 58%, #fb923c 100%);">
                  <tr>
                    <td style="padding: 28px 24px 24px; text-align: center;">
                      <p style="margin: 0 0 10px; font-size: 12px; line-height: 18px; letter-spacing: 0.18em; text-transform: uppercase; color: #ffedd5;">CraveDash Security</p>
                      <h1 style="margin: 0; font-size: 28px; line-height: 34px; color: #ffffff;">Reset your password</h1>
                      <p style="margin: 12px 0 0; font-size: 14px; line-height: 22px; color: #ffedd5;">Secure access to your account with a fresh password.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #fff7ed; border: 1px solid #fdba74; border-radius: 18px;">
                  <tr>
                    <td style="padding: 18px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 14px; line-height: 22px; color: #9a3412; font-weight: 600;">This reset link stays active for 5 minutes.</p>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0 0 12px; font-size: 15px; line-height: 24px; color: #1e293b;">Hi,</p>
                <p style="margin: 0 0 22px; font-size: 15px; line-height: 24px; color: #475569;">
                  We received a request to reset your password. Click the button below to set a new password.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                  <tr>
                    <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); box-shadow: 0 10px 24px rgba(234, 88, 12, 0.24);">
                      <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; letter-spacing: 0.02em;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0 0 8px; font-size: 14px; line-height: 22px; color: #475569;">
                  If you did not request a password reset, you can safely ignore this email.
                </p>
                <p style="margin: 0 0 10px; font-size: 14px; line-height: 22px; color: #475569;">
                  If the button does not work, copy and paste this URL into your browser:
                </p>
                <p style="margin: 0 0 24px; padding: 14px 16px; font-size: 13px; line-height: 21px; word-break: break-all; background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 14px;">
                  <a href="${url}" target="_blank" style="color: #c2410c; text-decoration: underline;">${url}</a>
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 21px; color: #64748b;">
                  For security reasons, this link can only be used once and expires automatically.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 24px; background-color: #fff7ed; border-top: 1px solid #fed7aa; text-align: center;">
                <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9a3412;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} CraveDash. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

// src/app/modules/auth/auth.service.ts
var loginUser = async (payload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: Status.active
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found!");
  }
  const isPasswordMarched = await bcrypt3.compare(payload.password, isUserExist.password);
  if (!isPasswordMarched) {
    throw new AppError(401, "Invalid credentials!");
  }
  const accessToken = jwtGenerator({
    userInfo: { email: isUserExist.email, role: isUserExist.role },
    createSecretKey: config.jwt.token_secret,
    expiresIn: config.jwt.token_expires_in
  });
  const refreshToken = jwtGenerator({
    userInfo: { email: isUserExist.email, role: isUserExist.role },
    createSecretKey: config.jwt.refresh_token_secret,
    expiresIn: config.jwt.refresh_token_expires_in
  });
  return {
    accessToken,
    refreshToken,
    user: {
      email: isUserExist.email,
      role: isUserExist.role
    }
  };
};
var generateAccessTokenUsingRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError(401, "Unauthorized");
  }
  let decoded;
  try {
    decoded = jwtVerifier({
      token: refreshToken,
      secretKey: config.jwt.refresh_token_secret
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError(401, "Refresh token expired");
    }
    if (err.name === "JsonWebTokenError") {
      throw new AppError(401, "Invalid refresh token");
    }
    throw new AppError(401, "Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: {
      email: decoded.email,
      status: Status.active
    }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const newAccessToken = jwtGenerator({
    userInfo: { email: user.email, role: user.role },
    createSecretKey: config.jwt.token_secret,
    expiresIn: config.jwt.token_expires_in
  });
  return {
    accessToken: newAccessToken
  };
};
var forgetPassword = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      status: Status.active
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found!");
  }
  if (isUserExist.updatedAt && isUserExist.updatedAt.getTime() > Date.now() - 5 * 60 * 1e3) {
    throw new AppError(429, "You can only request a password reset once every 5 minutes.");
  }
  const token = jwtGenerator({
    userInfo: { email: isUserExist.email, role: isUserExist.role },
    createSecretKey: config.jwt.token_secret,
    expiresIn: "5m"
  });
  let resetPasswordLink;
  if (config.node_env === "production") {
    resetPasswordLink = `${config.client_prod_url}/reset-password?token=${token}`;
  } else {
    resetPasswordLink = `${config.client_local_url}/reset-password?token=${token}`;
  }
  await sendEmail(
    isUserExist.email,
    "Password Reset Request",
    `You requested a password reset. Click the link to reset your password: ${resetPasswordLink}`,
    resetPasswordHtml(resetPasswordLink)
  );
};
var resetPassword = async (payload) => {
  const decoded = jwtVerifier({
    token: payload.token,
    secretKey: config.jwt.token_secret
  });
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: decoded.email
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  const hashedPassword = await bcrypt3.hash(
    payload.newPassword,
    Number(config.salt_rounds)
  );
  await prisma.user.update({
    where: {
      email: decoded.email
    },
    data: {
      password: hashedPassword
    }
  });
};
var changePassword = async (email, oldPassword, newPassword) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      status: Status.active
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found!");
  }
  const isPasswordMarched = await bcrypt3.compare(oldPassword, isUserExist.password);
  if (!isPasswordMarched) {
    throw new AppError(401, "Invalid credentials!");
  }
  if (isUserExist.passwordChangeAt && isUserExist.passwordChangeAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1e3) {
    throw new AppError(429, "You can only change your password once every 7 days.");
  }
  const hashedPassword = await bcrypt3.hash(
    newPassword,
    Number(config.salt_rounds)
  );
  await prisma.user.update({
    where: {
      email
    },
    data: {
      password: hashedPassword
    }
  });
};
var currentAuthenticatedUser = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      status: Status.active
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      avatar: true,
      address: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found!");
  }
  return isUserExist;
};
var updateProfile = async (email, payload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      status: Status.active
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found!");
  }
  const updatedData = {};
  if (payload.name !== void 0) updatedData.name = payload.name;
  if (payload.phone !== void 0) updatedData.phone = payload.phone;
  if (payload.avatar !== void 0) updatedData.avatar = payload.avatar;
  if (payload.address !== void 0) updatedData.address = payload.address;
  const result = await prisma.user.update({
    where: {
      email
    },
    data: updatedData,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      avatar: true,
      address: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return result;
};
var authService = {
  loginUser,
  generateAccessTokenUsingRefreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
  currentAuthenticatedUser,
  updateProfile
};

// src/app/modules/auth/auth.controller.ts
var login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  res.cookie("accessToken", result.accessToken, { secure: false, httpOnly: true });
  res.cookie("refreshToken", result.refreshToken, { secure: false, httpOnly: true });
  response_default(res, {
    statusCode: 200,
    message: "User logged in successfully!",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user
    }
  });
});
var generateAccessTokenUsingRefreshToken2 = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await authService.generateAccessTokenUsingRefreshToken(refreshToken);
  response_default(res, {
    statusCode: 200,
    message: "Access token generated successfully!",
    data: result
  });
});
var forgetPassword2 = catchAsync(async (req, res) => {
  await authService.forgetPassword(req.body.email);
  res.status(200).json({
    success: true,
    message: "Password reset link sent to your email if the email is registered with us"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body);
  res.status(200).json({
    success: true,
    message: "Password reset successfully"
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const email = req.user?.email;
  await authService.changePassword(email, oldPassword, newPassword);
  res.status(200).json({
    success: true,
    message: "Password changed successfully"
  });
});
var currentAuthenticatedUser2 = catchAsync(async (req, res) => {
  const user = req.user;
  const authenticatedUser = await authService.currentAuthenticatedUser(user?.email);
  response_default(res, {
    statusCode: 200,
    message: "Authenticated user retrieved successfully!",
    data: authenticatedUser
  });
});
var updateProfile2 = catchAsync(async (req, res) => {
  const email = req.user?.email;
  const result = await authService.updateProfile(email, req.body);
  response_default(res, {
    statusCode: 200,
    message: "Profile updated successfully!",
    data: result
  });
});
var authController = {
  login,
  generateAccessTokenUsingRefreshToken: generateAccessTokenUsingRefreshToken2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  changePassword: changePassword2,
  currentAuthenticatedUser: currentAuthenticatedUser2,
  updateProfile: updateProfile2
};

// src/app/modules/auth/auth.router.ts
var router2 = Router2();
router2.post("/login", authController.login);
router2.get("/refresh-token", authController.generateAccessTokenUsingRefreshToken);
router2.post("/forget-password", authController.forgetPassword);
router2.post("/reset-password", authController.resetPassword);
router2.post("/change-password", auth_default(Role.admin, Role.customer, Role.technician), authController.changePassword);
router2.patch("/update-profile", auth_default(Role.admin, Role.customer, Role.technician), authController.updateProfile);
router2.get("/me", auth_default(Role.admin, Role.customer, Role.technician), authController.currentAuthenticatedUser);
var authRouter = router2;

// src/app/modules/categorie/categorie.router.ts
import { Router as Router3 } from "express";

// src/app/modules/categorie/categorie.service.ts
var createCategory = async (payload) => {
  const result = await prisma.categories.create({
    data: payload
  });
  return result;
};
var getAllCategories = async (query) => {
  const whereCondition = [];
  const allowedSortFields = ["name", "createdAt", "updatedAt"];
  const allowedSearchFields = ["name", "description", "slug"];
  searchingHelper(whereCondition, allowedSearchFields, query.searchTerm);
  const { take, skip } = paginationHelper(query.page, query.limit);
  const sortCondition = sortingHelper(allowedSortFields, query.sortBy, query.sortOrder);
  const result = await prisma.categories.findMany({
    where: {
      AND: whereCondition
    },
    take,
    skip,
    orderBy: sortCondition
  });
  const total = await prisma.categories.count({
    where: {
      AND: whereCondition
    }
  });
  const totalPages = Math.ceil(total / take);
  const meta = {
    total,
    totalPages,
    currentPage: query.page ? parseInt(query.page) : 1,
    limit: take
  };
  return { meta, result };
};
var getSingleCategory = async (id) => {
  const result = await prisma.categories.findUnique({
    where: {
      id
    }
  });
  if (!result) {
    throw new AppError(404, "Category not found");
  }
  return result;
};
var updateCategory = async (id, payload) => {
  const existingCategory = await prisma.categories.findUnique({
    where: {
      id
    }
  });
  if (!existingCategory) {
    throw new AppError(404, "Category not found");
  }
  const result = await prisma.categories.update({
    where: {
      id
    },
    data: payload
  });
  return result;
};
var toggleActiveStatus = async (id) => {
  const existingCategory = await prisma.categories.findUnique({
    where: {
      id
    }
  });
  if (!existingCategory) {
    throw new AppError(404, "Category not found");
  }
  const result = await prisma.categories.update({
    where: {
      id
    },
    data: {
      isActive: !existingCategory.isActive
    }
  });
  return result;
};
var categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  toggleActiveStatus
};

// src/app/modules/categorie/categorie.controller.ts
var createCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.createCategory(req.body);
  response_default(res, {
    statusCode: 201,
    message: "Category created successfully!",
    data: result
  });
});
var getAllCategories2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await categoryService.getAllCategories(query);
  response_default(res, {
    statusCode: 200,
    message: "Categories retrieved successfully!",
    data: result
  });
});
var getSingleCategory2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.getSingleCategory(id);
  response_default(res, {
    statusCode: 200,
    message: "Category retrieved successfully!",
    data: result
  });
});
var updateCategory2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.updateCategory(id, req.body);
  response_default(res, {
    statusCode: 200,
    message: "Category updated successfully!",
    data: result
  });
});
var toggleActiveStatus2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.toggleActiveStatus(id);
  response_default(res, {
    statusCode: 200,
    message: "Category status toggled successfully!",
    data: result
  });
});
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getSingleCategory: getSingleCategory2,
  updateCategory: updateCategory2,
  toggleActiveStatus: toggleActiveStatus2
};

// src/app/modules/categorie/categorie.router.ts
var router3 = Router3();
router3.post("/", auth_default(Role.admin), categoryController.createCategory);
router3.get("/", categoryController.getAllCategories);
router3.get("/:id", categoryController.getSingleCategory);
router3.patch("/:id", auth_default(Role.admin), categoryController.updateCategory);
router3.patch("/:id/toggle-status", auth_default(Role.admin), categoryController.toggleActiveStatus);
var categoryRouter = router3;

// src/app/modules/technicianProfiles/technicianProfiles.router.ts
import { Router as Router4 } from "express";

// src/app/modules/technicianProfiles/technicianProfiles.service.ts
var getAllTechnician = async (payload) => {
  const whereCondition = [];
  let { page, limit, sortBy, sortOrder, searchTerm, ...filters } = payload;
  const allowedSearchFields = ["name", "email", "phone", "address", "technicianProfiles.skills", "technicianProfiles.location", "technicianProfiles.bio"];
  const allowedSortFields = ["name", "technicianProfiles.average_rating", "createdAt", "updatedAt"];
  const allowedFilterFields = ["status"];
  if (sortBy && sortBy === "average_rating") {
    sortBy = "technicianProfiles.average_rating";
  }
  searchingHelper(whereCondition, allowedSearchFields, searchTerm);
  filterHelper(whereCondition, filters, allowedFilterFields);
  const { take, skip } = paginationHelper(page, limit);
  const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);
  const result = await prisma.user.findMany({
    where: {
      AND: whereCondition,
      role: "technician"
    },
    include: {
      technicianProfiles: true
    },
    take,
    skip,
    orderBy: sortCondition
  });
  const total = await prisma.user.count({
    where: {
      AND: whereCondition,
      role: "technician"
    }
  });
  const totalPages = Math.ceil(total / take);
  const meta = {
    total,
    totalPages,
    currentPage: payload.page ? parseInt(payload.page) : 1,
    limit: take
  };
  return { meta, result };
};
var getSingleTechnician = async (id) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
      status: "active",
      role: "technician"
    },
    include: {
      technicianProfiles: true
    }
  });
  if (!result) {
    throw new AppError(404, "Technician not found");
  }
  return result;
};
var updateTechnicianProfile = async (email, payload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      status: "active",
      role: "technician"
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "Technician not found");
  }
  const { technicianProfiles, ...userData } = payload;
  const result = await prisma.user.update({
    where: {
      email,
      role: "technician"
    },
    data: {
      ...userData,
      ...technicianProfiles && {
        technicianProfiles: {
          update: {
            ...technicianProfiles
          }
        }
      }
    },
    include: {
      technicianProfiles: true
    }
  });
  return result;
};
var generateTimeSlots = async () => {
  const startTime = 9;
  const endTime = 20;
  const generatedSlots = [];
  const formatHour = (hour) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${ampm}`;
  };
  for (let hour = startTime; hour < endTime; hour++) {
    const startStr = formatHour(hour);
    const endStr = formatHour(hour + 1);
    const slotRange = `${startStr} to ${endStr}`;
    generatedSlots.push(slotRange);
  }
  return generatedSlots;
};
var technicianProfilesService = {
  getAllTechnician,
  getSingleTechnician,
  updateTechnicianProfile,
  generateTimeSlots
};

// src/app/modules/technicianProfiles/technicianProfiles.controller.ts
var getAllTechnicianProfiles = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await technicianProfilesService.getAllTechnician(query);
  response_default(res, {
    statusCode: 200,
    message: "Technician retrieved successfully!",
    data: result
  });
});
var getSingleTechnicianProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await technicianProfilesService.getSingleTechnician(id);
  response_default(res, {
    statusCode: 200,
    message: "Technician retrieved successfully!",
    data: result
  });
});
var updateTechnicianProfile2 = catchAsync(async (req, res) => {
  const email = req.user?.email;
  const result = await technicianProfilesService.updateTechnicianProfile(email, req.body);
  response_default(res, {
    statusCode: 200,
    message: "Technician profile updated successfully!",
    data: result
  });
});
var generateTimeSlots2 = catchAsync(async (req, res) => {
  const result = await technicianProfilesService.generateTimeSlots();
  response_default(res, {
    statusCode: 200,
    message: "Time slots generated successfully!",
    data: result
  });
});
var technicianProfilesController = {
  getAllTechnicianProfiles,
  getSingleTechnicianProfile,
  updateTechnicianProfile: updateTechnicianProfile2,
  generateTimeSlots: generateTimeSlots2
};

// src/app/modules/technicianProfiles/technicianProfiles.router.ts
var router4 = Router4();
router4.get("/", technicianProfilesController.getAllTechnicianProfiles);
router4.get("/generate-time-slots", auth_default(Role.technician), technicianProfilesController.generateTimeSlots);
router4.get("/:id", technicianProfilesController.getSingleTechnicianProfile);
router4.patch("/", auth_default(Role.technician), technicianProfilesController.updateTechnicianProfile);
var technicianRouter = router4;

// src/app/modules/service/service.router.ts
import { Router as Router5 } from "express";

// src/app/modules/service/service.service.ts
var createService = async (technicianEmail, payload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: technicianEmail
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  const isTechnicianExist = await prisma.technicianProfiles.findUnique({
    where: {
      userId: isUserExist.id
    }
  });
  if (!isTechnicianExist) {
    throw new AppError(404, "Technician not found");
  }
  const isServiceExist = await prisma.service.findFirst({
    where: {
      name: payload.name,
      location: payload.location,
      technicianId: isTechnicianExist.id,
      categoryId: payload.categoryId
    }
  });
  if (isServiceExist) {
    throw new AppError(400, "Service already exists");
  }
  const result = await prisma.service.create({
    data: {
      ...payload,
      technicianId: isTechnicianExist.id
    }
  });
  return result;
};
var getAllServices = async (payload) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = payload;
  const whereConditions = [];
  const allowedSearchFields = ["name", "description", "location", "category.name", "technician.user.name"];
  const allowedFilterFields = ["location", "category.name", "rating"];
  const allowedSortFields = ["name", "price", "location", "rating", "createdAt", "updatedAt", "technician.average_rating"];
  if (filters.category) {
    filters["category.name"] = filters.category;
    delete filters.category;
  }
  if (filters.rating) {
    filters["rating"] = parseFloat(filters.rating);
  }
  const ratingRange = {};
  if (filters.ratingGt !== void 0 && filters.ratingGt !== null && filters.ratingGt !== "") {
    ratingRange.gt = parseFloat(filters.ratingGt);
    delete filters.ratingGt;
  }
  if (filters.ratingGte !== void 0 && filters.ratingGte !== null && filters.ratingGte !== "") {
    ratingRange.gte = parseFloat(filters.ratingGte);
    delete filters.ratingGte;
  }
  if (filters.ratingLt !== void 0 && filters.ratingLt !== null && filters.ratingLt !== "") {
    ratingRange.lt = parseFloat(filters.ratingLt);
    delete filters.ratingLt;
  }
  if (filters.ratingLte !== void 0 && filters.ratingLte !== null && filters.ratingLte !== "") {
    ratingRange.lte = parseFloat(filters.ratingLte);
    delete filters.ratingLte;
  }
  if (Object.keys(ratingRange).length > 0) {
    whereConditions.push({ rating: ratingRange });
  }
  searchingHelper(whereConditions, allowedSearchFields, searchTerm);
  filterHelper(whereConditions, filters, allowedFilterFields);
  const { take, skip } = paginationHelper(page, limit);
  const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);
  const result = await prisma.service.findMany({
    where: {
      AND: whereConditions
    },
    include: {
      category: true,
      technician: {
        include: {
          user: {
            omit: {
              password: true,
              createdAt: true,
              updatedAt: true,
              passwordChangeAt: true
            }
          }
        }
      },
      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      }
    },
    take,
    skip,
    orderBy: sortCondition
  });
  const total = await prisma.service.count({
    where: {
      AND: whereConditions
    }
  });
  const totalPages = Math.ceil(total / take);
  const meta = {
    total,
    totalPages,
    currentPage: payload.page ? parseInt(payload.page) : 1,
    limit: take
  };
  return { meta, result };
};
var getSingleService = async (id) => {
  const result = await prisma.service.findUnique({
    where: {
      id
    },
    include: {
      category: true,
      technician: {
        include: {
          user: {
            omit: {
              password: true,
              createdAt: true,
              updatedAt: true,
              passwordChangeAt: true
            }
          }
        }
      },
      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      }
    }
  });
  return result;
};
var updateService = async (email, id, payload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  const isTechnicianExist = await prisma.technicianProfiles.findUnique({
    where: {
      userId: isUserExist.id
    }
  });
  if (!isTechnicianExist) {
    throw new AppError(404, "Technician not found");
  }
  const existingService = await prisma.service.findUnique({
    where: {
      id
    }
  });
  if (!existingService) {
    throw new AppError(404, "Service not found");
  }
  if (existingService.technicianId !== isTechnicianExist.id) {
    throw new AppError(403, "You are not authorized to update this service");
  }
  const result = await prisma.service.update({
    where: {
      id
    },
    data: payload
  });
  return result;
};
var getMyAddedServices = async (email, query) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = query;
  const whereConditions = [];
  const allowedSearchFields = ["name", "description", "location", "category.name", "technician.user.name"];
  const allowedFilterFields = ["location", "category.name", "rating"];
  const allowedSortFields = ["name", "price", "location", "rating", "createdAt", "updatedAt", "technician.average_rating"];
  if (filters.category) {
    filters["category.name"] = filters.category;
    delete filters.category;
  }
  if (filters.rating) {
    filters["rating"] = parseFloat(filters.rating);
  }
  const ratingRange = {};
  if (filters.ratingGt !== void 0 && filters.ratingGt !== null && filters.ratingGt !== "") {
    ratingRange.gt = parseFloat(filters.ratingGt);
    delete filters.ratingGt;
  }
  if (filters.ratingGte !== void 0 && filters.ratingGte !== null && filters.ratingGte !== "") {
    ratingRange.gte = parseFloat(filters.ratingGte);
    delete filters.ratingGte;
  }
  if (filters.ratingLt !== void 0 && filters.ratingLt !== null && filters.ratingLt !== "") {
    ratingRange.lt = parseFloat(filters.ratingLt);
    delete filters.ratingLt;
  }
  if (filters.ratingLte !== void 0 && filters.ratingLte !== null && filters.ratingLte !== "") {
    ratingRange.lte = parseFloat(filters.ratingLte);
    delete filters.ratingLte;
  }
  if (Object.keys(ratingRange).length > 0) {
    whereConditions.push({ rating: ratingRange });
  }
  searchingHelper(whereConditions, allowedSearchFields, searchTerm);
  filterHelper(whereConditions, filters, allowedFilterFields);
  const { take, skip } = paginationHelper(page, limit);
  const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  const isTechnicianExist = await prisma.technicianProfiles.findUnique({
    where: {
      userId: isUserExist.id
    }
  });
  if (!isTechnicianExist) {
    throw new AppError(404, "Technician not found");
  }
  const result = await prisma.service.findMany({
    where: {
      technicianId: isTechnicianExist.id,
      AND: whereConditions
    },
    skip,
    take,
    orderBy: sortCondition,
    include: {
      category: true,
      technician: {
        include: {
          user: {
            omit: {
              password: true,
              createdAt: true,
              updatedAt: true,
              passwordChangeAt: true
            }
          }
        }
      }
    }
  });
  const total = await prisma.service.count({
    where: {
      technicianId: isTechnicianExist.id,
      AND: whereConditions
    }
  });
  const totalPages = Math.ceil(total / take);
  const meta = {
    total,
    totalPages,
    currentPage: query.page ? parseInt(query.page) : 1,
    limit: take
  };
  return { meta, result };
};
var serviceService = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  getMyAddedServices
};

// src/app/modules/service/service.controller.ts
var createService2 = catchAsync(async (req, res) => {
  const technicianEmail = req.user?.email;
  const result = await serviceService.createService(technicianEmail, req.body);
  response_default(res, {
    statusCode: 201,
    message: "Service created successfully!",
    data: result
  });
});
var getAllServices2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await serviceService.getAllServices(query);
  response_default(res, {
    statusCode: 200,
    message: "Services retrieved successfully!",
    data: result
  });
});
var getSingleService2 = catchAsync(async (req, res) => {
  const serviceId = req.params.id;
  const result = await serviceService.getSingleService(serviceId);
  response_default(res, {
    statusCode: 200,
    message: "Service retrieved successfully!",
    data: result
  });
});
var updateService2 = catchAsync(async (req, res) => {
  const technicianEmail = req.user?.email;
  const serviceId = req.params.id;
  const payload = req.body;
  const result = await serviceService.updateService(technicianEmail, serviceId, payload);
  response_default(res, {
    statusCode: 200,
    message: "Service updated successfully!",
    data: result
  });
});
var getMyAddedServices2 = catchAsync(async (req, res) => {
  const technicianEmail = req.user?.email;
  const result = await serviceService.getMyAddedServices(technicianEmail, req.query);
  response_default(res, {
    statusCode: 200,
    message: "My added services retrieved successfully!",
    data: result
  });
});
var serviceController = {
  createService: createService2,
  getAllServices: getAllServices2,
  getSingleService: getSingleService2,
  updateService: updateService2,
  getMyAddedServices: getMyAddedServices2
};

// src/app/modules/service/service.router.ts
var router5 = Router5();
router5.post("/", auth_default(Role.technician), serviceController.createService);
router5.get("/", serviceController.getAllServices);
router5.get("/my-added-services", auth_default(Role.technician), serviceController.getMyAddedServices);
router5.get("/:id", serviceController.getSingleService);
router5.patch("/:id", auth_default(Role.technician), serviceController.updateService);
var serviceRouter = router5;

// src/app/modules/technicianTimeSlot/technicianTimeSlot.router.ts
import { Router as Router6 } from "express";

// src/app/modules/technicianTimeSlot/technicianTimeSlot.service.ts
var createTechnicianTimeSlots = async (email, date, selectedSlots) => {
  const inputDate = new Date(date);
  const currentDate = /* @__PURE__ */ new Date();
  currentDate.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  if (inputDate < currentDate) {
    throw new AppError(400, "Cannot create time slots for a past date");
  }
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      status: "active",
      role: "technician"
    },
    omit: {
      "password": true,
      "createdAt": true,
      "updatedAt": true,
      "status": true,
      "role": true
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "Technician not found");
  }
  const isTechnicianExist = await prisma.technicianProfiles.findFirst({
    where: {
      userId: isUserExist.id
    }
  });
  if (!isTechnicianExist) {
    throw new AppError(404, "Technician profile not found");
  }
  const slotData = selectedSlots.map((slot) => ({
    slotTime: slot,
    date,
    technicianId: isTechnicianExist.id
  }));
  const result = await prisma.technicianSlots.createMany({
    data: slotData,
    skipDuplicates: true
  });
  return result;
};
var updateTechnicianTimeSlots = async (email, date, selectedSlots) => {
  const inputDate = new Date(date);
  const currentDate = /* @__PURE__ */ new Date();
  currentDate.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  if (inputDate < currentDate) {
    throw new AppError(400, "Cannot update time slots for a past date");
  }
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      status: "active",
      role: "technician"
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "Technician not found");
  }
  const isTechnicianExist = await prisma.technicianProfiles.findUnique({
    where: {
      userId: isUserExist.id
    }
  });
  if (!isTechnicianExist) {
    throw new AppError(404, "Technician profile not found");
  }
  const technicianId = isTechnicianExist.id;
  const existingSlots = await prisma.technicianSlots.findMany({
    where: {
      technicianId,
      date
    }
  });
  const existingSlotTimes = existingSlots.map((slot) => slot.slotTime);
  const slotsToDelete = existingSlots.filter((slot) => !selectedSlots.includes(slot.slotTime));
  const bookedSlotsToDelete = slotsToDelete.filter((slot) => slot.status === SlotStatus.BOOKED);
  if (bookedSlotsToDelete.length > 0) {
    const bookedSlotTimes = bookedSlotsToDelete.map((slot) => slot.slotTime).join(", ");
    throw new AppError(400, `Cannot delete slots that have active bookings: ${bookedSlotTimes}`);
  }
  const slotsToCreate = selectedSlots.filter((slot) => !existingSlotTimes.includes(slot));
  const result = await prisma.$transaction(async (tx) => {
    if (slotsToDelete.length > 0) {
      await tx.technicianSlots.deleteMany({
        where: {
          technicianId,
          date,
          slotTime: {
            in: slotsToDelete.map((slot) => slot.slotTime)
          }
        }
      });
    }
    if (slotsToCreate.length > 0) {
      const slotData = slotsToCreate.map((slot) => ({
        slotTime: slot,
        date,
        technicianId
      }));
      await tx.technicianSlots.createMany({
        data: slotData
      });
    }
    const updatedSlots = await tx.technicianSlots.findMany({
      where: {
        technicianId,
        date
      },
      orderBy: {
        slotTime: "asc"
      }
    });
    return updatedSlots;
  });
  return result;
};
var technicianTimeSlotService = {
  createTechnicianTimeSlots,
  updateTechnicianTimeSlots
};

// src/app/modules/technicianTimeSlot/technicianTimeSlot.controller.ts
var createTechnicianTimeSlots2 = catchAsync(async (req, res) => {
  const email = req.user?.email;
  const { date, selectedSlots } = req.body;
  const result = await technicianTimeSlotService.createTechnicianTimeSlots(email, date, selectedSlots);
  response_default(res, {
    statusCode: 201,
    message: "Technician time slots created successfully!",
    data: result
  });
});
var updateTechnicianTimeSlots2 = catchAsync(async (req, res) => {
  const email = req.user?.email;
  const { date, selectedSlots } = req.body;
  const result = await technicianTimeSlotService.updateTechnicianTimeSlots(email, date, selectedSlots);
  response_default(res, {
    statusCode: 200,
    message: "Technician time slots updated successfully!",
    data: result
  });
});
var technicianTimeSlotController = {
  createTechnicianTimeSlots: createTechnicianTimeSlots2,
  updateTechnicianTimeSlots: updateTechnicianTimeSlots2
};

// src/app/modules/technicianTimeSlot/technicianTimeSlot.router.ts
var router6 = Router6();
router6.post("/", auth_default(Role.technician), technicianTimeSlotController.createTechnicianTimeSlots);
router6.put("/", auth_default(Role.technician), technicianTimeSlotController.updateTechnicianTimeSlots);
var technicianTimeSlotRouter = router6;

// src/app/modules/booking/booking.router.ts
import { Router as Router7 } from "express";

// src/app/modules/booking/booking.service.ts
var createBooking = async (email, payload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  const isSlotAvailable = await prisma.technicianSlots.findUnique({
    where: {
      id: payload.slotId
    }
  });
  if (!isSlotAvailable) {
    throw new AppError(404, "Slot not found");
  }
  const slotDate = new Date(isSlotAvailable.date);
  const currentDate = /* @__PURE__ */ new Date();
  currentDate.setHours(0, 0, 0, 0);
  slotDate.setHours(0, 0, 0, 0);
  if (slotDate < currentDate) {
    throw new AppError(400, "Cannot book a service for a past date");
  }
  if (isSlotAvailable.status === SlotStatus.BOOKED) {
    throw new AppError(400, "Slot is already booked");
  }
  const isServiceExist = await prisma.service.findUnique({
    where: {
      id: payload.serviceId
    },
    include: {
      category: true,
      technician: {
        include: {
          user: true
        }
      }
    }
  });
  if (!isServiceExist) {
    throw new AppError(404, "Service not found");
  }
  const technicianId = isServiceExist.technician.id;
  const totalAmount = isServiceExist.price;
  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.bookings.create({
      data: {
        customerId: isUserExist.id,
        technicianId,
        totalAmount,
        ...payload
      }
    });
    await tx.technicianSlots.update({
      where: {
        id: payload.slotId
      },
      data: {
        status: SlotStatus.BOOKED
      }
    });
    return booking;
  });
  return result;
};
var acceptBooking = async (bookingId) => {
  const booking = await prisma.bookings.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  if (booking.status === BookingStatus.CONFIRMED) {
    throw new AppError(400, "Booking is already confirmed");
  }
  if (booking.status === BookingStatus.CANCELLED) {
    throw new AppError(400, "Booking is cancelled");
  }
  if (booking.status === BookingStatus.COMPLETED) {
    throw new AppError(400, "Booking is already completed");
  }
  if (booking.status === BookingStatus.PAID) {
    throw new AppError(400, "Booking is already paid");
  }
  if (booking.status === BookingStatus.REJECTED) {
    throw new AppError(400, "Booking is rejected");
  }
  if (booking.status === BookingStatus.IN_PROGRESS) {
    throw new AppError(400, "Booking is already in progress");
  }
  const result = await prisma.bookings.update({
    where: {
      id: bookingId
    },
    data: {
      status: BookingStatus.CONFIRMED
    }
  });
  return result;
};
var rejectBooking = async (bookingId) => {
  const booking = await prisma.bookings.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  if (booking.status === BookingStatus.CANCELLED) {
    throw new AppError(400, "Booking is already cancelled");
  }
  if (booking.status === BookingStatus.CONFIRMED) {
    throw new AppError(400, "Booking is already confirmed");
  }
  if (booking.status === BookingStatus.COMPLETED) {
    throw new AppError(400, "Booking is already completed");
  }
  if (booking.status === BookingStatus.IN_PROGRESS) {
    throw new AppError(400, "Booking is already in progress");
  }
  if (booking.status === BookingStatus.PAID) {
    throw new AppError(400, "Booking is already paid");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.bookings.update({
      where: {
        id: bookingId
      },
      data: {
        status: BookingStatus.REJECTED
      }
    });
  });
  await prisma.technicianSlots.update({
    where: {
      id: booking.slotId
    },
    data: {
      status: SlotStatus.AVAILABLE
    }
  });
  return result;
};
var completeBooking = async (email, bookingId) => {
  const booking = await prisma.bookings.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  const isTechnician = await prisma.technicianProfiles.findUnique({
    where: {
      userId: isUserExist.id
    }
  });
  if (!isTechnician) {
    throw new AppError(403, "You are not authorized to complete this booking");
  }
  if (booking?.technicianId !== isTechnician.id) {
    throw new AppError(403, "You are not authorized to complete this booking");
  }
  if (booking.status === "CANCELLED") {
    throw new AppError(400, "Booking is cancelled");
  }
  if (booking.status === "COMPLETED") {
    throw new AppError(400, "Booking is already completed");
  }
  if (booking.status !== "IN_PROGRESS") {
    throw new AppError(400, "Booking must be in-progress before marking as completed");
  }
  const result = await prisma.bookings.update({
    where: {
      id: bookingId
    },
    data: {
      status: "COMPLETED"
    }
  });
  return result;
};
var cancelBookingByTechnician = async (email, bookingId) => {
  const booking = await prisma.bookings.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  if (booking.status === "CANCELLED") {
    throw new AppError(400, "Booking is already cancelled");
  }
  if (booking.status === "COMPLETED") {
    throw new AppError(400, "Booking is already completed");
  }
  if (booking.status === "PAID") {
    throw new AppError(400, "Booking is already paid");
  }
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  const isTechnician = await prisma.technicianProfiles.findUnique({
    where: {
      userId: isUserExist.id
    }
  });
  if (!isTechnician) {
    throw new AppError(404, "Technician not found");
  }
  if (booking.technicianId !== isTechnician.id) {
    throw new AppError(403, "You are not authorized to cancel this booking");
  }
  const result = await prisma.$transaction(
    async (tx) => {
      const booking2 = await tx.bookings.update({
        where: {
          id: bookingId
        },
        data: {
          status: "CANCELLED"
        }
      });
      await tx.technicianSlots.update({
        where: {
          id: booking2.slotId
        },
        data: {
          status: SlotStatus.AVAILABLE
        }
      });
      return booking2;
    }
  );
  return result;
};
var cancelBookingByCustomer = async (email, bookingId) => {
  const booking = await prisma.bookings.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  if (booking.status === "CANCELLED") {
    throw new AppError(400, "Booking is already cancelled");
  }
  if (booking.status === "COMPLETED") {
    throw new AppError(400, "Booking is already completed");
  }
  if (booking.status === "IN_PROGRESS") {
    throw new AppError(400, "Booking is already in-progress and cannot be cancelled");
  }
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  if (booking.customerId !== isUserExist.id) {
    throw new AppError(403, "You are not authorized to cancel this booking");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.bookings.update({
      where: {
        id: bookingId
      },
      data: {
        status: "CANCELLED"
      }
    });
    await tx.technicianSlots.update({
      where: {
        id: booking.slotId
      },
      data: {
        status: SlotStatus.AVAILABLE
      }
    });
    return updatedBooking;
  });
  return result;
};
var getMyBookings = async (email, query) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      status: "active"
    }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = query;
  const whereConditions = [
    {
      customerId: user.id
    }
  ];
  const allowedSearchFields = ["service.name", "service.description", "service.location", "technician.user.name"];
  const allowedFilterFields = ["status"];
  const allowedSortFields = ["createdAt", "updatedAt", "totalAmount", "status"];
  searchingHelper(whereConditions, allowedSearchFields, searchTerm);
  filterHelper(whereConditions, filters, allowedFilterFields);
  const { take, skip } = paginationHelper(page, limit);
  const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);
  const result = await prisma.bookings.findMany({
    where: {
      AND: whereConditions
    },
    include: {
      service: true,
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true
            }
          }
        }
      },
      slot: true,
      payments: true
    },
    take,
    skip,
    orderBy: sortCondition
  });
  const total = await prisma.bookings.count({
    where: {
      AND: whereConditions
    }
  });
  const totalPages = Math.ceil(total / take);
  const meta = {
    total,
    totalPages,
    currentPage: query.page ? parseInt(query.page) : 1,
    limit: take
  };
  return { meta, result };
};
var getTechnicianBookings = async (email, query) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      status: "active"
    },
    include: {
      technicianProfiles: true
    }
  });
  if (!user || !user.technicianProfiles) {
    throw new AppError(404, "Technician profile not found");
  }
  const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = query;
  const whereConditions = [
    {
      technicianId: user.technicianProfiles.id
    }
  ];
  const allowedSearchFields = ["service.name", "customer.name", "customer.phone", "customer.email"];
  const allowedFilterFields = ["status"];
  const allowedSortFields = ["createdAt", "updatedAt", "totalAmount", "status"];
  searchingHelper(whereConditions, allowedSearchFields, searchTerm);
  filterHelper(whereConditions, filters, allowedFilterFields);
  const { take, skip } = paginationHelper(page, limit);
  const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);
  const result = await prisma.bookings.findMany({
    where: {
      AND: whereConditions
    },
    include: {
      service: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          address: true
        }
      },
      slot: true,
      payments: true
    },
    take,
    skip,
    orderBy: sortCondition
  });
  const total = await prisma.bookings.count({
    where: {
      AND: whereConditions
    }
  });
  const totalPages = Math.ceil(total / take);
  const meta = {
    total,
    totalPages,
    currentPage: query.page ? parseInt(query.page) : 1,
    limit: take
  };
  return { meta, result };
};
var getAllBookings = async (query) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = query;
  const whereConditions = [];
  const allowedSearchFields = ["service.name", "customer.name", "customer.phone", "technician.user.name"];
  const allowedFilterFields = ["status"];
  const allowedSortFields = ["createdAt", "updatedAt", "totalAmount", "status"];
  searchingHelper(whereConditions, allowedSearchFields, searchTerm);
  filterHelper(whereConditions, filters, allowedFilterFields);
  const { take, skip } = paginationHelper(page, limit);
  const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);
  const result = await prisma.bookings.findMany({
    where: {
      AND: whereConditions
    },
    include: {
      service: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          address: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true
            }
          }
        }
      },
      slot: true,
      payments: true
    },
    take,
    skip,
    orderBy: sortCondition
  });
  const total = await prisma.bookings.count({
    where: {
      AND: whereConditions
    }
  });
  const totalPages = Math.ceil(total / take);
  const meta = {
    total,
    totalPages,
    currentPage: query.page ? parseInt(query.page) : 1,
    limit: take
  };
  return { meta, result };
};
var inProgressBooking = async (email, bookingId) => {
  const booking = await prisma.bookings.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  const isTechnician = await prisma.technicianProfiles.findUnique({
    where: {
      userId: isUserExist.id
    }
  });
  if (!isTechnician) {
    throw new AppError(403, "You are not authorized to start this booking");
  }
  if (booking.technicianId !== isTechnician.id) {
    throw new AppError(403, "You are not authorized to start this booking");
  }
  if (booking.status === "CANCELLED") {
    throw new AppError(400, "Booking is cancelled");
  }
  if (booking.status === "IN_PROGRESS") {
    throw new AppError(400, "Booking is already in-progress");
  }
  if (booking.status === "COMPLETED") {
    throw new AppError(400, "Booking is already completed");
  }
  if (booking.status !== "PAID") {
    throw new AppError(400, "Booking must be PAID before marking as in-progress");
  }
  const result = await prisma.bookings.update({
    where: {
      id: bookingId
    },
    data: {
      status: "IN_PROGRESS"
    }
  });
  return result;
};
var getSingleBooking = async (bookingId, email, role) => {
  const booking = await prisma.bookings.findUnique({
    where: {
      id: bookingId
    },
    include: {
      service: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          address: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true
            }
          }
        }
      },
      slot: true,
      payments: true
    }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (role === "customer" && booking.customerId !== user.id) {
    throw new AppError(403, "You are not authorized to view this booking");
  }
  if (role === "technician") {
    const technician = await prisma.technicianProfiles.findUnique({
      where: { userId: user.id }
    });
    if (!technician || booking.technicianId !== technician.id) {
      throw new AppError(403, "You are not authorized to view this booking");
    }
  }
  return booking;
};
var bookingService = {
  createBooking,
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBookingByTechnician,
  cancelBookingByCustomer,
  getMyBookings,
  getTechnicianBookings,
  getAllBookings,
  inProgressBooking,
  getSingleBooking
};

// src/app/modules/booking/booking.controller.ts
var createBooking2 = catchAsync(async (req, res) => {
  const userEmail = req.user?.email;
  const result = await bookingService.createBooking(userEmail, req.body);
  response_default(res, {
    statusCode: 201,
    message: "Booking created successfully!",
    data: result
  });
});
var acceptBooking2 = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const result = await bookingService.acceptBooking(bookingId);
  response_default(res, {
    statusCode: 200,
    message: "Booking accepted successfully!",
    data: result
  });
});
var rejectBooking2 = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const result = await bookingService.rejectBooking(bookingId);
  response_default(res, {
    statusCode: 200,
    message: "Booking rejected successfully!",
    data: result
  });
});
var completeBooking2 = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const userEmail = req.user?.email;
  const result = await bookingService.completeBooking(userEmail, bookingId);
  response_default(res, {
    statusCode: 200,
    message: "Booking completed successfully!",
    data: result
  });
});
var cancelBookingByTechnician2 = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const userEmail = req.user?.email;
  const result = await bookingService.cancelBookingByTechnician(userEmail, bookingId);
  response_default(res, {
    statusCode: 200,
    message: "Booking cancelled successfully!",
    data: result
  });
});
var cancelBookingByCustomer2 = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const userEmail = req.user?.email;
  const result = await bookingService.cancelBookingByCustomer(userEmail, bookingId);
  response_default(res, {
    statusCode: 200,
    message: "Booking cancelled successfully!",
    data: result
  });
});
var getMyBookings2 = catchAsync(async (req, res) => {
  const userEmail = req.user?.email;
  const result = await bookingService.getMyBookings(userEmail, req.query);
  response_default(res, {
    statusCode: 200,
    message: "Bookings retrieved successfully!",
    data: result
  });
});
var getTechnicianBookings2 = catchAsync(async (req, res) => {
  const userEmail = req.user?.email;
  const result = await bookingService.getTechnicianBookings(userEmail, req.query);
  response_default(res, {
    statusCode: 200,
    message: "Technician bookings retrieved successfully!",
    data: result
  });
});
var getAllBookings2 = catchAsync(async (req, res) => {
  const result = await bookingService.getAllBookings(req.query);
  response_default(res, {
    statusCode: 200,
    message: "Bookings retrieved successfully!",
    data: result
  });
});
var inProgressBooking2 = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const userEmail = req.user?.email;
  const result = await bookingService.inProgressBooking(userEmail, bookingId);
  response_default(res, {
    statusCode: 200,
    message: "Booking marked as in-progress successfully!",
    data: result
  });
});
var getSingleBooking2 = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const userEmail = req.user?.email;
  const userRole = req.user?.role;
  const result = await bookingService.getSingleBooking(bookingId, userEmail, userRole);
  response_default(res, {
    statusCode: 200,
    message: "Booking retrieved successfully!",
    data: result
  });
});
var bookingController = {
  createBooking: createBooking2,
  acceptBooking: acceptBooking2,
  rejectBooking: rejectBooking2,
  completeBooking: completeBooking2,
  cancelBookingByTechnician: cancelBookingByTechnician2,
  cancelBookingByCustomer: cancelBookingByCustomer2,
  getMyBookings: getMyBookings2,
  getTechnicianBookings: getTechnicianBookings2,
  getAllBookings: getAllBookings2,
  inProgressBooking: inProgressBooking2,
  getSingleBooking: getSingleBooking2
};

// src/app/modules/booking/booking.router.ts
var router7 = Router7();
router7.post("/", auth_default(Role.customer), bookingController.createBooking);
router7.get("/", auth_default(Role.admin), bookingController.getAllBookings);
router7.get("/my-bookings", auth_default(Role.customer), bookingController.getMyBookings);
router7.get("/technician-bookings", auth_default(Role.technician), bookingController.getTechnicianBookings);
router7.get("/:bookingId", auth_default(Role.customer, Role.technician, Role.admin), bookingController.getSingleBooking);
router7.patch("/:bookingId/accept", auth_default(Role.technician), bookingController.acceptBooking);
router7.patch("/:bookingId/reject", auth_default(Role.technician), bookingController.rejectBooking);
router7.patch("/:bookingId/in-progress", auth_default(Role.technician), bookingController.inProgressBooking);
router7.patch("/:bookingId/complete", auth_default(Role.technician), bookingController.completeBooking);
router7.patch("/:bookingId/cancel-by-technician", auth_default(Role.technician), bookingController.cancelBookingByTechnician);
router7.patch("/:bookingId/cancel-by-customer", auth_default(Role.customer), bookingController.cancelBookingByCustomer);
var bookingRouter = router7;

// src/app/modules/payment/payment.route.ts
import { Router as Router8 } from "express";

// src/app/modules/payment/payment.service.ts
import Stripe2 from "stripe";

// lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config.payment.stripe_secret_key);
var stripe_default = stripe;

// src/app/modules/payment/payment.service.ts
var createPayment = async (email, paymentData) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const booking = await prisma.bookings.findUnique({
    where: {
      id: paymentData.bookingId
    },
    include: {
      service: true
    }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  if (booking.customerId !== user.id) {
    throw new AppError(403, "You are not authorized to make payment for this booking");
  }
  if (booking.status !== "CONFIRMED") {
    throw new AppError(400, "Payment can only be made for confirmed bookings");
  }
  const existingPayment = await prisma.payments.findUnique({
    where: {
      bookingId: booking.id
    }
  });
  if (existingPayment) {
    throw new AppError(400, "Payment already exists for this booking");
  }
  try {
    const session = await stripe_default.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "BDT",
            product_data: {
              name: `Payment for ${booking.service.name}`,
              description: `Secure payment for ${booking.service.name}. Booking Ref: #${booking.id.slice(-6).toUpperCase()} ${booking.createdAt ? `| Date: ${booking.createdAt.toLocaleDateString()}` : ""}`,
              images: [booking.service.image_url]
            },
            unit_amount: booking.totalAmount * 100
          },
          quantity: 1
        }
      ],
      mode: "payment",
      payment_method_types: ["card"],
      payment_intent_data: {
        metadata: {
          bookingId: booking.id
        }
      },
      metadata: {
        bookingId: booking.id
      },
      customer_email: user.email,
      success_url: `${config.node_env === "development" ? config.client_local_url : config.client_prod_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.node_env === "development" ? config.client_local_url : config.client_prod_url}/payment-cancel`
    });
    await prisma.payments.create({
      data: {
        bookingId: booking.id,
        transactionId: session.id,
        amount: booking.totalAmount
      }
    });
    return session.url;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred while creating the payment session";
    console.log(error);
    throw new Error(message);
  }
};
var handleWebhook = async (payload, signature) => {
  const endpointSecret = config.payment.stripe_webhook_secret;
  const event = Stripe2.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata.bookingId;
      const payment = await prisma.payments.findUnique({
        where: {
          bookingId
        }
      });
      if (!payment) {
        throw new AppError(404, "Payment not found");
      }
      await prisma.$transaction(async (tx) => {
        await tx.payments.update({
          where: {
            bookingId
          },
          data: {
            status: PaymentStatus.SUCCESS,
            transactionId: paymentIntent.id
          }
        });
        const booking = await tx.bookings.findUnique({
          where: { id: bookingId }
        });
        if (booking && booking.status !== "CANCELLED" && booking.status !== "REJECTED") {
          await tx.bookings.update({
            where: {
              id: bookingId
            },
            data: {
              status: BookingStatus.PAID
            }
          });
        }
      });
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;
    case "payment_intent.payment_failed":
      const paymentMethod = event.data.object;
      const failedBookingId = paymentMethod.metadata.bookingId;
      const failedPayment = await prisma.payments.findUnique({
        where: {
          bookingId: failedBookingId
        }
      });
      if (!failedPayment) {
        throw new AppError(404, "Payment not found");
      }
      await prisma.payments.update({
        where: {
          bookingId: failedBookingId
        },
        data: {
          status: PaymentStatus.FAILED,
          transactionId: paymentMethod.id
        }
      });
      break;
    case "checkout.session.expired":
      const expiredSession = event.data.object;
      const expiredBookingId = expiredSession.metadata?.bookingId;
      const expiredPayment = await prisma.payments.findUnique({
        where: {
          bookingId: expiredBookingId
        }
      });
      if (!expiredPayment) {
        throw new AppError(404, "Payment not found");
      }
      await prisma.payments.update({
        where: {
          bookingId: expiredBookingId
        },
        data: {
          status: PaymentStatus.FAILED,
          transactionId: expiredSession.id
        }
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }
};
var getMyPaymentHistory = async (email, query) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      status: "active"
    }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = query;
  const whereConditions = [
    {
      booking: {
        customerId: user.id
      }
    }
  ];
  const allowedSearchFields = ["transactionId", "booking.service.name", "booking.technician.user.name"];
  const allowedFilterFields = ["status"];
  const allowedSortFields = ["paymentDate", "amount", "createdAt", "updatedAt", "status"];
  searchingHelper(whereConditions, allowedSearchFields, searchTerm);
  filterHelper(whereConditions, filters, allowedFilterFields);
  const { take, skip } = paginationHelper(page, limit);
  const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);
  const result = await prisma.payments.findMany({
    where: {
      AND: whereConditions
    },
    include: {
      booking: {
        include: {
          service: true,
          technician: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  avatar: true
                }
              }
            }
          }
        }
      }
    },
    take,
    skip,
    orderBy: sortCondition
  });
  const total = await prisma.payments.count({
    where: {
      AND: whereConditions
    }
  });
  const totalPages = Math.ceil(total / take);
  const meta = {
    total,
    totalPages,
    currentPage: query.page ? parseInt(query.page) : 1,
    limit: take
  };
  return { meta, result };
};
var getSinglePayment = async (paymentId, email, role) => {
  const payment = await prisma.payments.findUnique({
    where: {
      id: paymentId
    },
    include: {
      booking: {
        include: {
          service: true,
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true
            }
          },
          technician: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  avatar: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!payment) {
    throw new AppError(404, "Payment not found");
  }
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (role === "customer" && payment.booking.customerId !== user.id) {
    throw new AppError(403, "You are not authorized to view this payment details");
  }
  return payment;
};
var paymentService = {
  createPayment,
  handleWebhook,
  getMyPaymentHistory,
  getSinglePayment
};

// src/app/modules/payment/payment.controller.ts
var createPayment2 = catchAsync(async (req, res) => {
  const userEmail = req.user?.email;
  const result = await paymentService.createPayment(userEmail, req.body);
  response_default(res, {
    statusCode: 201,
    message: "Payment created successfully!",
    data: result
  });
});
var handleWebhook2 = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const payload = req.body;
  await paymentService.handleWebhook(payload, signature);
  response_default(res, {
    statusCode: 200,
    message: "Webhook handled successfully!",
    data: null
  });
});
var getMyPaymentHistory2 = catchAsync(async (req, res) => {
  const userEmail = req.user?.email;
  const result = await paymentService.getMyPaymentHistory(userEmail, req.query);
  response_default(res, {
    statusCode: 200,
    message: "Payment history retrieved successfully!",
    data: result
  });
});
var getSinglePayment2 = catchAsync(async (req, res) => {
  const paymentId = req.params.paymentId;
  const userEmail = req.user?.email;
  const userRole = req.user?.role;
  const result = await paymentService.getSinglePayment(paymentId, userEmail, userRole);
  response_default(res, {
    statusCode: 200,
    message: "Payment retrieved successfully!",
    data: result
  });
});
var paymentController = {
  createPayment: createPayment2,
  handleWebhook: handleWebhook2,
  getMyPaymentHistory: getMyPaymentHistory2,
  getSinglePayment: getSinglePayment2
};

// src/app/modules/payment/payment.route.ts
var router8 = Router8();
router8.post("/checkout-session", auth_default(Role.customer), paymentController.createPayment);
router8.get("/history", auth_default(Role.customer), paymentController.getMyPaymentHistory);
router8.get("/:paymentId", auth_default(Role.customer, Role.admin), paymentController.getSinglePayment);
router8.post("/webhook", paymentController.handleWebhook);
var paymentRouter = router8;

// src/app/modules/review/review.router.ts
import { Router as Router9 } from "express";

// src/app/modules/review/review.service.ts
var createReview = async (email, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      status: "active"
    }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  const booking = await prisma.bookings.findUnique({
    where: {
      id: payload.bookingId
    },
    include: {
      review: true
    }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  if (booking.customerId !== user.id) {
    throw new AppError(403, "You are not authorized to review this booking");
  }
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new AppError(400, "You can only leave a review for completed bookings");
  }
  if (booking.review) {
    throw new AppError(400, "You have already reviewed this booking");
  }
  if (payload.rating < 1 || payload.rating > 5) {
    throw new AppError(400, "Rating must be between 1 and 5");
  }
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        customerId: user.id,
        serviceId: booking.serviceId,
        technicianId: booking.technicianId,
        bookingId: booking.id,
        rating: payload.rating,
        comment: payload.comment
      }
    });
    const serviceAvg = await tx.review.aggregate({
      where: {
        serviceId: booking.serviceId
      },
      _avg: {
        rating: true
      }
    });
    const newServiceRating = serviceAvg._avg.rating || 0;
    await tx.service.update({
      where: {
        id: booking.serviceId
      },
      data: {
        rating: newServiceRating
      }
    });
    const technicianAvg = await tx.review.aggregate({
      where: {
        technicianId: booking.technicianId
      },
      _avg: {
        rating: true
      }
    });
    const newTechnicianRating = technicianAvg._avg.rating || 0;
    await tx.technicianProfiles.update({
      where: {
        id: booking.technicianId
      },
      data: {
        average_rating: newTechnicianRating
      }
    });
    return review;
  });
  return result;
};
var reviewService = {
  createReview
};

// src/app/modules/review/review.controller.ts
var createReview2 = catchAsync(async (req, res) => {
  const userEmail = req.user?.email;
  const result = await reviewService.createReview(userEmail, req.body);
  response_default(res, {
    statusCode: 201,
    message: "Review submitted successfully!",
    data: result
  });
});
var reviewController = {
  createReview: createReview2
};

// src/app/modules/review/review.router.ts
var router9 = Router9();
router9.post("/", auth_default(Role.customer), reviewController.createReview);
var reviewRouter = router9;

// src/routes/router.ts
var router10 = express.Router();
var routers = [
  {
    path: "/user",
    route: userRouter
  },
  {
    path: "/auth",
    route: authRouter
  },
  {
    path: "/categories",
    route: categoryRouter
  },
  {
    path: "/technician",
    route: technicianRouter
  },
  {
    path: "/services",
    route: serviceRouter
  },
  {
    path: "/technician-time-slot",
    route: technicianTimeSlotRouter
  },
  {
    path: "/booking",
    route: bookingRouter
  },
  {
    path: "/payment",
    route: paymentRouter
  },
  {
    path: "/reviews",
    route: reviewRouter
  }
];
routers.forEach((r) => {
  router10.use(r.path, r.route);
});
var router_default = router10;

// src/app.ts
var app = express2();
app.use("/api/v1/payment/webhook", express2.raw({ type: "application/json" }));
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/api/v1", router_default);
app.get("/", (req, res) => {
  res.send("Server is running .......");
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/server.ts
app_default.listen(config.port, async () => {
  await seedAdmin();
  console.log(`Server is running on port ${config.port}`);
});
