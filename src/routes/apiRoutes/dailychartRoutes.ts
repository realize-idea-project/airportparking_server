import express, { Request, Response, NextFunction } from 'express';
import { fileUploader } from '../../middlewares';
import { dailychartControllers } from '../../controllers';
import { ENTRY, FILE_UPLOAD_KEY } from '../../constants';

const { createDailychart: postDailychart, getDailychart, updateOneColumnInDailychart } = dailychartControllers;

const dailychartRoutes = express.Router();

dailychartRoutes.post(ENTRY, fileUploader.array(FILE_UPLOAD_KEY), postDailychart);

dailychartRoutes.get(ENTRY, getDailychart);
dailychartRoutes.put(ENTRY, updateOneColumnInDailychart);

export default dailychartRoutes;
