-- CreateTable
CREATE TABLE "district_data" (
    "id" SERIAL NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "rainfall_mm" DOUBLE PRECISION NOT NULL,
    "avg_price" DOUBLE PRECISION NOT NULL,
    "area_hectateres" DOUBLE PRECISION NOT NULL,
    "yield_tonnes" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "district_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_scores" (
    "id" SERIAL NOT NULL,
    "district_id" INTEGER NOT NULL,
    "risk_score" DOUBLE PRECISION NOT NULL,
    "top_driver_1" TEXT,
    "top_driver_2" TEXT,
    "top_driver_3" TEXT,
    "model_version" TEXT,

    CONSTRAINT "risk_scores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "risk_scores" ADD CONSTRAINT "risk_scores_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
