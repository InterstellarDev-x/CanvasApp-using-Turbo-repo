-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "roomId" INTEGER NOT NULL DEFAULT -1;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("Room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
