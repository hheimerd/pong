/*
  Warnings:

  - Added the required column `TwoFactorAuth` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "TwoFactorAuth" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "AuthCode" (
    "code" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "AuthCode" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
