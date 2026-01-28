/*
  Warnings:

  - You are about to drop the column `address` on the `SiteConfig` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `SiteConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SiteConfig" DROP COLUMN "address",
DROP COLUMN "facebook",
ADD COLUMN     "heroTagline" TEXT NOT NULL DEFAULT 'Atención Podológica Profesional';

-- CreateTable
CREATE TABLE "AboutCard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "details" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "siteConfigId" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AboutCard" ADD CONSTRAINT "AboutCard_siteConfigId_fkey" FOREIGN KEY ("siteConfigId") REFERENCES "SiteConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
