-- CreateTable
CREATE TABLE "ChatsBannedUsers" (
    "banned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minutes" INTEGER NOT NULL DEFAULT 1,
    "userId" INTEGER NOT NULL,
    "chatId" UUID NOT NULL,

    PRIMARY KEY ("userId","chatId")
);

-- AddForeignKey
ALTER TABLE "ChatsBannedUsers" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatsBannedUsers" ADD FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
