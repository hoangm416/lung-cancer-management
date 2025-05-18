// src/routes/omics.routes.ts
import express, { RequestHandler } from "express";
import AnalyticsController from "../controllers/AnalyticsController";

const router = express.Router();

// 1. Bắt param :type ngay trong path
router.get("/:type/:id?", AnalyticsController.getOmics as RequestHandler);

export default router;
