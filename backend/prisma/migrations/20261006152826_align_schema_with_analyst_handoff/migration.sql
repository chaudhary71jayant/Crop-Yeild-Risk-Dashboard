/*
  Warnings:

  - You are about to drop the column `yield_tonnes` on the `district_data` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[state,district,crop,year]` on the table `district_data` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `drivers_available` to the `risk_scores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "district_data" DROP COLUMN "yield_tonnes",
ADD COLUMN     "production" DOUBLE PRECISION,
ADD COLUMN     "yield_kg_per_hectare" DOUBLE PRECISION,
ALTER COLUMN "year" SET DATA TYPE TEXT,
ALTER COLUMN "rainfall_mm" DROP NOT NULL,
ALTER COLUMN "avg_price" DROP NOT NULL,
ALTER COLUMN "area_hectateres" DROP NOT NULL;

-- AlterTable
ALTER TABLE "risk_scores" ADD COLUMN     "drivers_available" INTEGER NOT NULL,
ADD COLUMN     "risk_data_quality" DOUBLE PRECISION,
ALTER COLUMN "risk_score" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "district_data_state_district_crop_year_key" ON "district_data"("state", "district", "crop", "year");
