/*
  Warnings:

  - You are about to alter the column `name` on the `Chat` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(32)`.
  - You are about to alter the column `password` on the `Chat` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `message` on the `ChatMessage` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(32)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `login` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(24)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "name" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(64);

-- AlterTable
ALTER TABLE "ChatMessage" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "message" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "login" SET DATA TYPE VARCHAR(24),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
