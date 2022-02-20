import express, { Request, Response, NextFunction } from 'express';
import { fileUploader } from '../../middlewares'
import { dailychartControllers } from '../../controllers';
import { ENTRY, FILE_UPLOAD_KEY } from '../../constants';

const { postDailychart, getDailychart } = dailychartControllers;

const dailychartRoutes = express.Router();

dailychartRoutes.post(ENTRY, fileUploader.array(FILE_UPLOAD_KEY), postDailychart);

dailychartRoutes.get(ENTRY, getDailychart);

export default dailychartRoutes;
