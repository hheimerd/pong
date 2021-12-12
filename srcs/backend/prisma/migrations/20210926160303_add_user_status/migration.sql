-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Online', 'Offline', 'InGame');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT E'Offline';
