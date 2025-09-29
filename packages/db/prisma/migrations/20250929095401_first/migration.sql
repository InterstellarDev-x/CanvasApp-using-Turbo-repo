-- CreateTable
CREATE TABLE "public"."User" (
    "User_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("User_id")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "Chat_id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("Chat_id")
);

-- CreateTable
CREATE TABLE "public"."Room" (
    "Room_id" SERIAL NOT NULL,
    "User_id" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("Room_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_User_id_key" ON "public"."Room"("User_id");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "public"."Room"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;
