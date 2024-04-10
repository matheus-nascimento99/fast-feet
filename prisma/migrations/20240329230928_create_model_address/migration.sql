/*
  Warnings:

  - You are about to drop the column `recipientId` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `recipient_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_recipientId_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "recipientId",
ADD COLUMN     "recipient_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "adresses" (
    "id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "street_number" INTEGER NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "adresses_id_key" ON "adresses"("id");

-- AddForeignKey
ALTER TABLE "adresses" ADD CONSTRAINT "adresses_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
