/*
  Warnings:

  - Made the column `cellphone` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `individual_registration` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "cellphone" SET NOT NULL,
ALTER COLUMN "individual_registration" SET NOT NULL;
