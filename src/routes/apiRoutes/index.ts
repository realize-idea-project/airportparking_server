import express from 'express';
import { DAILYCHART, DAILYPARKING } from '../../constants/routes';

import dailychartRoutes from './dailychartRoutes';
import dailyparkingRoutes from './dailyparkingRoutes';

const apiRouter = express.Router();
apiRouter.use(DAILYCHART, dailychartRoutes);
apiRouter.use(DAILYPARKING, dailyparkingRoutes);

export default apiRouter;
