-- CreateTable
CREATE TABLE "UserOngToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER,
    "ongId" INTEGER,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOngToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserOngToken_userId_idx" ON "UserOngToken"("userId");

-- AddForeignKey
ALTER TABLE "UserOngToken" ADD CONSTRAINT "UserOngToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOngToken" ADD CONSTRAINT "UserOngToken_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "Ongs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
