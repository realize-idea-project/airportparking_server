import express, { Request, Response, NextFunction } from 'express';
import { ENTRY, DAILYCHART, FILE_UPLOAD_KEY, SUCCESS, API, DAILYPARKING } from '../constants';
import { dailyparkingControllers } from '../controllers';
import { formatToKrTime } from '../utils/timeUtils';

const viewRouter = express.Router();

viewRouter.get(ENTRY, (req: Request, res: Response, next: NextFunction) => {
  console.log('home');
  res.send('home');
  return;
});

viewRouter.get(DAILYCHART, (req: Request, res: Response, next: NextFunction) => {
  const params = {
    url: `${process.env.HOST_URL}${API}${DAILYCHART}`,
    uploadKey: FILE_UPLOAD_KEY,
  };

  res.render('dailychart', params);
});

viewRouter.get(DAILYPARKING, async (req: Request, res: Response, next: NextFunction) => {
  const parkings = await dailyparkingControllers.getParkingListByDateForView(req, res);

  parkings.forEach((parking: any) => {
    parking.updatedAt = formatToKrTime(parking.updatedAt);
  });

  res.render('dailyparking', { parkings });
});

export default viewRouter;
