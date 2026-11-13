import "dotenv/config";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { prisma } from "../src/config/db.js";

const csvPath = path.resolve(
  process.cwd(),
  "../data/backend_handoff_2021_2025.csv"
);
const fileContent = fs.readFileSync(csvPath, "utf-8");

const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true
});

const toFloatOrNull = (value) => {
  if (!value || value.trim() === "") return null;
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
};

const main = async () => {
  let count = 0;
  for (const [i, row] of records.entries()) {
    try {
      const districtRecord = await prisma.districtData.upsert({
        where: {
          state_district_crop_year: {
            state: row.state,
            district: row.district,
            crop: row.crop,
            year: row.year
          }
        },
        update: {
          rainfallMm: toFloatOrNull(row.rainfall_mm),
          avgPrice: toFloatOrNull(row.avg_price),
          areaHectares: toFloatOrNull(row.area_hectares),
          production: toFloatOrNull(row.production),
          yieldKgPerHectare: toFloatOrNull(row.yield_kg_per_hectare)
        },
        create: {
          state: row.state,
          district: row.district,
          crop: row.crop,
          year: row.year,
          rainfallMm: toFloatOrNull(row.rainfall_mm),
          avgPrice: toFloatOrNull(row.avg_price),
          areaHectares: toFloatOrNull(row.area_hectares),
          production: toFloatOrNull(row.production),
          yieldKgPerHectare: toFloatOrNull(row.yield_kg_per_hectare)
        }
      });

      const existingScore = await prisma.riskScore.findFirst({
        where: { districtId: districtRecord.id }
      });

      const scoreData = {
        riskScore: toFloatOrNull(row.risk_score),
        riskDataQuality: row.risk_data_quality,
        driversAvailable: parseInt(row.drivers_available, 10) || 0,
        topDriver1: row.top_driver_1 || null,
        topDriver2: row.top_driver_2 || null,
        topDriver3: row.top_driver_3 || null
      };

      if (existingScore) {
        await prisma.riskScore.update({
          where: { id: existingScore.id },
          data: scoreData
        });
      } else {
        await prisma.riskScore.create({
          data: {
            ...scoreData,
            districtId: districtRecord.id
          }
        });
      }

      count++;
      if (count % 200 === 0) console.log(`${count} processed...`);
    } catch (error) {
      console.error(
        `Failed at data row ${i + 1}: ${row.state} / ${row.district} / ${row.crop} / ${row.year}`,
        error
      );
      throw error;
    }
  }
  console.log(`Successfully processed ${count} district-crop-year records.`);
};

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
