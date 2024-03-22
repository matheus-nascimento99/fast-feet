/*
  Warnings:

  - You are about to drop the `recipients` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street_number` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_recipient_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "street_number" INTEGER NOT NULL;

-- DropTable
DROP TABLE "recipients";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
