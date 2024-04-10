-- DropForeignKey
ALTER TABLE "adresses" DROP CONSTRAINT "adresses_recipient_id_fkey";

-- AlterTable
ALTER TABLE "adresses" ALTER COLUMN "recipient_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "adresses" ADD CONSTRAINT "adresses_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
