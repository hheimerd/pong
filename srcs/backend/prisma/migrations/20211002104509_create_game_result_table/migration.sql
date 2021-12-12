-- CreateTable
CREATE TABLE "GameResult" (
    "id" UUID NOT NULL,
    "score" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameResultToUser" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameResultToUser_AB_unique" ON "_GameResultToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GameResultToUser_B_index" ON "_GameResultToUser"("B");

-- AddForeignKey
ALTER TABLE "_GameResultToUser" ADD FOREIGN KEY ("A") REFERENCES "GameResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameResultToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
