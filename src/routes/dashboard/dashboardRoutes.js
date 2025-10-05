import express from "express";
import DaOverviewRoutes from "./overview/DaOverviewRoutes.js";

const DashboardRoutes = express.Router();
DashboardRoutes.use('/overview', DaOverviewRoutes)

export default DashboardRoutes;