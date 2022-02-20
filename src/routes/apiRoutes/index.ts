import express from 'express';
import dailychartRoutes from './dailychartRoutes';
import { DAILYCHART } from '../../constants/routes';

const apiRouter = express.Router();
apiRouter.use(DAILYCHART, dailychartRoutes);

export default apiRouter;