import express, { Request, Response, NextFunction } from 'express';
import { ENTRY, DAILYCHART, FILE_UPLOAD_KEY, SUCCESS, API } from '../constants';

const viewRouter = express.Router();

viewRouter.get(ENTRY, (req: Request, res: Response, next: NextFunction) => {
    console.log('home')
    res.send('home');
    return;
  }
);

viewRouter.get(DAILYCHART, (req: Request, res: Response, next: NextFunction) => {
  const params = {
    url: `${process.env.HOST_URL}${API}${DAILYCHART}`,
    uploadKey: FILE_UPLOAD_KEY,
  };
  
    res.render('index', params);
  }
);

export default viewRouter;