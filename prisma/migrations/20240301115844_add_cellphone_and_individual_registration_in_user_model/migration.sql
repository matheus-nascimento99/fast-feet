/*
  Warnings:

  - A unique constraint covering the columns `[individual_registration]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cellphone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cellphone" TEXT,
ADD COLUMN     "individual_registration" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_individual_registration_key" ON "users"("individual_registration");

-- CreateIndex
CREATE UNIQUE INDEX "users_cellphone_key" ON "users"("cellphone");
