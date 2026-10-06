import { prisma } from "../config/db.js";

const formatDistrict = (d) => {
  const latestScore = d.riskScores[0];
  return {
    id: d.id,
    district: d.district,
    state: d.state,
    crop: d.crop,
    year: d.year,
    rainfall_mm: d.rainfallMm,
    avg_price: d.avgPrice,
    area_hectares: d.areaHectares,
    yield_tonnes: d.yieldTonnes,
    risk_score: latestScore?.riskScore ?? null,
    top_driver_1: latestScore?.topDriver1 ?? null,
    top_driver_2: latestScore?.topDriver2 ?? null,
    top_driver_3: latestScore?.topDriver3 ?? null
  };
};

const getAllDistricts = async (req, res, next) => {
  try {
    const { state, crop, year, page =1, limit = 20 } = req.query;

    const where = {};
    if(state) where.state = state;
    if(crop) where.crop = crop;
    if(year) where.year = parseInt(year);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [districts, total] = await Promise.all([
        prisma.districtData.findMany({
            where,
            include : { riskScores : true},
            skip,
            take : parseInt(limit)
        }),
        prisma.districtData.count({ where })
    ]);
    
    res.json({
        data : districts.map(formatDistrict),
        pagination : {
            total,
            page : parseInt(page),
            limit : parseInt(limit),
            totalPage : Math.ceil(total / parseInt(limit))
        }
    });
  } catch (error) {
    next(error);
  }
};

const getDistrictById = async (req, res, next) => {
  try {
    const districtId = parseInt(req.params.id);
    const district = await prisma.districtData.findUnique({
      where: { id: districtId },
      include: { riskScores: true }
    });

    if (!district) {
      const error = new Error("District not found.");
      error.statusCode = 404;
      return next(error);
    }

    res.json(formatDistrict(district));
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

    const idArray = idString.split(",").map(Number);

    if (idArray.length < 2) {
      const error = new Error("Please provide two or more ids to compare.");
      error.statusCode = 400;
      return next(error);
    }

    const districts = await prisma.districtData.findMany({
      where: { id: { in: idArray } },
      include: { riskScores: true }
    });

    res.json(districts.map(formatDistrict));
  } catch (error) {
    next(error);
  }
};

const healtCheck = async( req, res, next) => {
  try {
    res.status(200).json({success : true, message : "Server is Healthy", timestamp : new Date().toISOString()});
  } catch (error) {
    next(error);
  }
}

export { getAllDistricts, getDistrictById, compareDistricts, healtCheck };