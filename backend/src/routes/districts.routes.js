import { getAllDistricts,getDistrictById,compareDistricts,healthCheck, getFilterOption } from "../controllers/district.controller.js";
import express from "express";

const router = express.Router();

router.get('/health', healthCheck)
router.get('/districts',getAllDistricts);
router.get('/district/:id',getDistrictById);
router.get('/compare', compareDistricts);
router.get('/filters', getFilterOption);

export default router;