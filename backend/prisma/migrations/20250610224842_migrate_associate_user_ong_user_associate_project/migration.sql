-- CreateEnum
CREATE TYPE "AssociateStatus" AS ENUM ('INVITE_PENDING_ONG_TO_USER', 'REQUEST_PENDING_USER_TO_ONG', 'ACCEPTED', 'REJECTED_BY_USER', 'REJECTED_BY_ONG');

-- CreateTable
CREATE TABLE "AssociateUserONG" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ongId" INTEGER NOT NULL,
    "status" "AssociateStatus" NOT NULL,

    CONSTRAINT "AssociateUserONG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssociateProject" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "status" "AssociateStatus" NOT NULL,

    CONSTRAINT "UserAssociateProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssociateUserONG_userId_idx" ON "AssociateUserONG"("userId");

-- CreateIndex
CREATE INDEX "AssociateUserONG_ongId_idx" ON "AssociateUserONG"("ongId");

-- CreateIndex
CREATE UNIQUE INDEX "AssociateUserONG_userId_ongId_key" ON "AssociateUserONG"("userId", "ongId");

-- CreateIndex
CREATE INDEX "UserAssociateProject_userId_idx" ON "UserAssociateProject"("userId");

-- CreateIndex
CREATE INDEX "UserAssociateProject_projectId_idx" ON "UserAssociateProject"("projectId");

-- AddForeignKey
ALTER TABLE "AssociateUserONG" ADD CONSTRAINT "AssociateUserONG_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssociateUserONG" ADD CONSTRAINT "AssociateUserONG_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "Ongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssociateProject" ADD CONSTRAINT "UserAssociateProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssociateProject" ADD CONSTRAINT "UserAssociateProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
