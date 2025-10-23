import express from "express";
import { getFileChartData, getFileDiscountChart, getFilePurchaseByCompany, getSellerSales } from '../../../controllers/dashboard/overview/DaOverviewController.js';

const DaOverviewRoutes = express.Router();

DaOverviewRoutes.get("/totalSales/:id/charts", getFileChartData);
DaOverviewRoutes.get("/bookingCount/:id/charts", getFilePurchaseByCompany);
DaOverviewRoutes.get("/discounts/:id/charts", getFileDiscountChart);
DaOverviewRoutes.get("/sellerSales/:id", getSellerSales);

export default DaOverviewRoutes;
