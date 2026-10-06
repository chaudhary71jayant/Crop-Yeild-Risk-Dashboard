import { getAllDistricts,getDistrictById,compareDistricts,healtCheck } from "../controllers/district.controller.js";
import express from "express";

const router = express.Router();

router.get('/health', healtCheck)
router.get('/districts',getAllDistricts);
router.get('/district/:id',getDistrictById);
router.get('/compare', compareDistricts);

export default router;