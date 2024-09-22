/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `list_group` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `list_group` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_id` on the `list_item` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `list_item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "list_group" DROP CONSTRAINT "list_group_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "list_group" DROP CONSTRAINT "list_group_updated_by_id_fkey";

-- DropForeignKey
ALTER TABLE "list_item" DROP CONSTRAINT "list_item_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "list_item" DROP CONSTRAINT "list_item_updated_by_id_fkey";

-- AlterTable
ALTER TABLE "list_group" DROP COLUMN "created_by_id",
DROP COLUMN "updated_by_id",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "list_item" DROP COLUMN "created_by_id",
DROP COLUMN "updated_by_id",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AddForeignKey
ALTER TABLE "list_group" ADD CONSTRAINT "list_group_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_group" ADD CONSTRAINT "list_group_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_item" ADD CONSTRAINT "list_item_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_item" ADD CONSTRAINT "list_item_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
