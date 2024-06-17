import express, { Request, Response, NextFunction } from 'express';
import { ENTRY } from '../../constants';
import { dailyparkingControllers } from '../../controllers';

const { createDailyParking } = dailyparkingControllers;
const dailyparkingRoutes = express.Router();

dailyparkingRoutes.post(ENTRY, createDailyParking);

export default dailyparkingRoutes;
