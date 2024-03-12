-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DELIVERY_MAN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('WAITING', 'RETIRED', 'DELIVERED', 'RETURNED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "delivery_man_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'WAITING',
    "attachment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "posted_at" TIMESTAMP(3),
    "retired_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "returnedAt" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "recipients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "individual_registration" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "street_number" INTEGER NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_id_key" ON "recipients"("id");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_individual_registration_key" ON "recipients"("individual_registration");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_cellphone_key" ON "recipients"("cellphone");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_email_key" ON "recipients"("email");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_man_id_fkey" FOREIGN KEY ("delivery_man_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
