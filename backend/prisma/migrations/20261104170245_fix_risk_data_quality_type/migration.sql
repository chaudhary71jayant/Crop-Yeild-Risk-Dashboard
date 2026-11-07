/*
  Warnings:

  - You are about to drop the column `area_hectateres` on the `district_data` table. All the data in the column will be lost.
  - Made the column `risk_data_quality` on table `risk_scores` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "district_data" DROP COLUMN "area_hectateres",
ADD COLUMN     "area_hectares" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "risk_scores" ALTER COLUMN "risk_data_quality" SET NOT NULL,
ALTER COLUMN "risk_data_quality" SET DATA TYPE TEXT;
