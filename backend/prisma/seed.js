import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({ connectionString : process.env.DATABASE_URL })
const prisma = new PrismaClient({adapter});

const districts = [
  {
    district: "Nashik",
    state: "Maharashtra",
    crop: "Onion",
    year: 2024,
    rainfallMm: 620.5,
    avgPrice: 1850.0,
    areaHectares: 45000,
    yieldTonnes: 380000,
    riskScores: {
      create: {
        riskScore: 72,
        topDriver1: "Low rainfall",
        topDriver2: "High price volatility",
        topDriver3: "Shrinking area"
      }
    }
  },
  {
    district: "Ludhiana",
    state: "Punjab",
    crop: "Wheat",
    year: 2024,
    rainfallMm: 780.0,
    avgPrice: 2200.0,
    areaHectares: 300000,
    yieldTonnes: 1650000,
    riskScores: {
      create: {
        riskScore: 35,
        topDriver1: "Stable rainfall",
        topDriver2: "Consistent yield"
      }
    }
  },
  {
    district: "Guntur",
    state: "Andhra Pradesh",
    crop: "Chilli",
    year: 2024,
    rainfallMm: 900.0,
    avgPrice: 12000.0,
    areaHectares: 25000,
    yieldTonnes: 45000,
    riskScores: {
      create: {
        riskScore: 58,
        topDriver1: "Price drop",
        topDriver2: "Moderate rainfall deficit"
      }
    }
  }
];

const main = async () => {
  for (const d of districts) {
    await prisma.districtData.create({ data: d });
  }
  console.log("Seeded", districts.length, "districts.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());