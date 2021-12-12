/*
  Warnings:

  - You are about to drop the `ChatsBannedUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PunishmentDegree" AS ENUM ('BAN', 'MUTE', 'SELF_MUTE');

-- DropForeignKey
ALTER TABLE "ChatsBannedUsers" DROP CONSTRAINT "ChatsBannedUsers_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatsBannedUsers" DROP CONSTRAINT "ChatsBannedUsers_userId_fkey";

-- DropTable
DROP TABLE "ChatsBannedUsers";

-- CreateTable
CREATE TABLE "ChatPunishment" (
    "id" UUID NOT NULL,
    "chatId" UUID NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "degree" "PunishmentDegree" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minutes" INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatPunishment.chatId_fromUserId_toUserId_degree_unique" ON "ChatPunishment"("chatId", "fromUserId", "toUserId", "degree");

-- AddForeignKey
ALTER TABLE "ChatPunishment" ADD FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatPunishment" ADD FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatPunishment" ADD FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
