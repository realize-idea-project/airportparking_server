import express, { Request, Response, NextFunction } from 'express';
import { ENTRY } from '../../constants';
import { dailyparkingControllers } from '../../controllers';

const { createDailyParking, getParkingListByDate } = dailyparkingControllers;
const dailyparkingRoutes = express.Router();

dailyparkingRoutes.post(ENTRY, createDailyParking);
dailyparkingRoutes.get(ENTRY, getParkingListByDate);

export default dailyparkingRoutes;
