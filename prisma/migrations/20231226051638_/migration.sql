/*
  Warnings:

  - You are about to drop the column `userId` on the `Whiteboard` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Whiteboard" DROP CONSTRAINT "Whiteboard_userId_fkey";

-- AlterTable
ALTER TABLE "Whiteboard" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "WhiteboardUsers" (
    "id" STRING NOT NULL,
    "owner" BOOL NOT NULL DEFAULT false,
    "whiteboardId" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "WhiteboardUsers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WhiteboardUsers" ADD CONSTRAINT "WhiteboardUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhiteboardUsers" ADD CONSTRAINT "WhiteboardUsers_whiteboardId_fkey" FOREIGN KEY ("whiteboardId") REFERENCES "Whiteboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
