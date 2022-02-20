import express, { Request, Response, NextFunction } from 'express';
import { ENTRY, DAILYCHART, FILE_UPLOAD_KEY } from '../constants';

const viewRouter = express.Router();

viewRouter.get(ENTRY, (req: Request, res: Response, next: NextFunction) => {
    console.log('home')
    res.send('home');
    return;
  }
);

viewRouter.get(DAILYCHART, (req: Request, res: Response, next: NextFunction) => {
    console.log('get sheet');
    const params = {
      url: process.env.UPLOAD_API_PATH,
      uploadKey: FILE_UPLOAD_KEY,
    };
    
    res.render('index', params);
    return;
  }
);

export default viewRouter;