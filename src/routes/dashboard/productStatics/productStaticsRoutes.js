import Express from 'express';
import { getFileServiceChart } from '../../../controllers/dashboard/productStatics/DaProductStaticsController.js';

const productStaticsRoutes = Express.Router();

productStaticsRoutes.get('/services/:id/charts', getFileServiceChart)

export default productStaticsRoutes;