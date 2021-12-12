/*
  Warnings:

  - The primary key for the `AuthCode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `AuthCode` table. All the data in the column will be lost.
  - Added the required column `codeHash` to the `AuthCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthCode" DROP CONSTRAINT "AuthCode_pkey",
DROP COLUMN "code",
ADD COLUMN     "codeHash" TEXT NOT NULL,
ADD PRIMARY KEY ("codeHash");
