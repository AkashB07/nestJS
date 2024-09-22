/*
  Warnings:

  - The values [reset_passwordss] on the enum `AuthCodeVerificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuthCodeVerificationType_new" AS ENUM ('set_password', 'reset_password');
ALTER TABLE "auth_code_verification" ALTER COLUMN "type" TYPE "AuthCodeVerificationType_new" USING ("type"::text::"AuthCodeVerificationType_new");
ALTER TYPE "AuthCodeVerificationType" RENAME TO "AuthCodeVerificationType_old";
ALTER TYPE "AuthCodeVerificationType_new" RENAME TO "AuthCodeVerificationType";
DROP TYPE "AuthCodeVerificationType_old";
COMMIT;

-- CreateTable
CREATE TABLE "ListGroup" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "ListGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListItem" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "ListItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListGroup_code_key" ON "ListGroup"("code");

-- AddForeignKey
ALTER TABLE "ListGroup" ADD CONSTRAINT "ListGroup_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListGroup" ADD CONSTRAINT "ListGroup_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "ListGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
