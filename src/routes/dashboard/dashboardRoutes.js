import express from "express";
import DaOverviewRoutes from "./overview/DaOverviewRoutes.js";
import productStaticsRoutes from './productStatics/productStaticsRoutes.js';

const DashboardRoutes = express.Router();
DashboardRoutes.use('/overview', DaOverviewRoutes)
DashboardRoutes.use('/productStatics', productStaticsRoutes)

export default DashboardRoutes;