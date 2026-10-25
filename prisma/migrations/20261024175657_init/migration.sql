/*
  Warnings:

  - Added the required column `ip_address` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "ip_address" TEXT NOT NULL;
