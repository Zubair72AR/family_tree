/*
  Warnings:

  - Made the column `secret` on table `twoFactor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `backupCodes` on table `twoFactor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "twoFactor" ALTER COLUMN "secret" SET NOT NULL,
ALTER COLUMN "backupCodes" SET NOT NULL;
