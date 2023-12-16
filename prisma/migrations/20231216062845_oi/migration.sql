/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Whiteboard` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Whiteboard" ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Whiteboard" ADD COLUMN     "dateUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Whiteboard" ADD COLUMN     "previewUrl" STRING NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "WhiteboardSnapshot" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "whiteboardId" STRING NOT NULL,
    "previewUrl" STRING NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhiteboardSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Whiteboard_name_key" ON "Whiteboard"("name");

-- AddForeignKey
ALTER TABLE "WhiteboardSnapshot" ADD CONSTRAINT "WhiteboardSnapshot_whiteboardId_fkey" FOREIGN KEY ("whiteboardId") REFERENCES "Whiteboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
