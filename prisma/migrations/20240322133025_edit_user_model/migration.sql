/*
  Warnings:

  - You are about to drop the column `city` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `complement` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `street_number` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'RECIPIENT';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "city",
DROP COLUMN "complement",
DROP COLUMN "neighborhood",
DROP COLUMN "postalCode",
DROP COLUMN "state",
DROP COLUMN "street",
DROP COLUMN "street_number";
