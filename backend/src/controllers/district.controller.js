import { prisma } from "../config/db.js";

const formatDistrict = (d) => {
  const latestScore = d.riskScores?.[0];
  return {
    id: d.id,
    district: d.district,
    state: d.state,
    crop: d.crop,
    year: d.year,
    rainfall_mm: d.rainfallMm,
    avg_price: d.avgPrice,
    area_hectares: d.areaHectares,
    production: d.production,
    production_tonnes: d.production,
    yield_kg_per_hectare: d.yieldKgPerHectare,
    risk_score: latestScore?.riskScore ?? null,
    risk_data_quality: latestScore?.riskDataQuality ?? null,
    drivers_available: latestScore?.driversAvailable ?? null,
    top_driver_1: latestScore?.topDriver1 ?? null,
    top_driver_2: latestScore?.topDriver2 ?? null,
    top_driver_3: latestScore?.topDriver3 ?? null
  };
};

const getAllDistricts = async (req, res, next) => {
  try {
    const { state, crop, year, page = 1, limit = 20 } = req.query;

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const where = {};
    if (state) where.state = state;
    if (crop) where.crop = crop;
    if (year) {
      where.year = year;
    } else {
      const latest = await prisma.districtData.aggregate({ _max: { year: true } });
      where.year = latest._max.year;
    }

    const skip = (parsedPage - 1) * parsedLimit;

    const [districts, total] = await Promise.all([
      prisma.districtData.findMany({
        where,
        include: { riskScores: true },
        orderBy: [
          { state: "asc" },
          { district: "asc" },
          { id: "asc" }
        ],
        skip,
        take: parsedLimit
      }),
      prisma.districtData.count({ where })
    ]);

    res.json({
      data: districts.map(formatDistrict),
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getDistrictById = async (req, res, next) => {
  try {
    const districtId = parseInt(req.params.id, 10);
    if (Number.isNaN(districtId)) {
      const error = new Error("Invalid district id.");
      error.statusCode = 400;
      return next(error);
    }

    const district = await prisma.districtData.findUnique({
      where: { id: districtId },
      include: { riskScores: true }
    });

    if (!district) {
      const error = new Error("District not found.");
      error.statusCode = 404;
      return next(error);
    }

    const history = await prisma.districtData.findMany({
      where: {
        state: district.state,
        district: district.district,
        crop: district.crop
      },
      include: { riskScores: true },
      orderBy: { year: "asc" }
    });

    res.json({
      ...formatDistrict(district),
      trend: history.map(formatDistrict)
    });
  } catch (error) {
    next(error);
  }
};

const compareDistricts = async (req, res, next) => {
  try {
    const idString = req.query.ids;
    if (!idString) {
      const error = new Error("Id is not provided.");
      error.statusCode = 400;
      return next(error);
    }

    const idArray = String(idString)
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));

    if (idArray.length < 2) {
      const error = new Error("Please provide two or more ids to compare.");
      error.statusCode = 400;
      return next(error);
    }

    const districts = await prisma.districtData.findMany({
      where: { id: { in: idArray } },
      include: { riskScores: true },
      orderBy: { id: "asc" }
    });

    res.json(districts.map(formatDistrict));
  } catch (error) {
    next(error);
  }
};

const healthCheck = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Server is Healthy",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

const getFilterOption = async (req, res, next) => {
  try {
    const [states, crops, years] = await Promise.all([
      prisma.districtData.findMany({
        select: { state: true },
        distinct: ["state"],
        orderBy: { state: "asc" }
      }),
      prisma.districtData.findMany({
        select: { crop: true },
        distinct: ["crop"],
        orderBy: { crop: "asc" }
      }),
      prisma.districtData.findMany({
        select: { year: true },
        distinct: ["year"],
        orderBy: { year: "desc" }
      })
    ]);

    res.json({
      states: states.map((s) => s.state),
      crops: crops.map((c) => c.crop),
      years: years.map((y) => y.year)
    });
  } catch (error) {
    next(error);
  }
};

export { getAllDistricts, getDistrictById, compareDistricts, healthCheck, getFilterOption };