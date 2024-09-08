-- CreateEnum
CREATE TYPE "AuthCodeVerificationType" AS ENUM ('set_password', 'reset_passwordss');

-- CreateTable
CREATE TABLE "auth_code_verification" (
    "id" SERIAL NOT NULL,
    "type" "AuthCodeVerificationType" NOT NULL,
    "code_hash" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_code_verification_pkey" PRIMARY KEY ("id")
);
