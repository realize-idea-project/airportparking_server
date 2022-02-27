import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import CustomError from '../services/errorHandler';
import { viewRouter, apiRouter } from '../routes';
import { ENTRY, API } from '../constants/routes';
import { NOT_FOUND } from '../constants';

const app = express();

try {
  app.use(express.static('public'));
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.set( "views", path.join( __dirname, "../views" ) );
  app.set( "view engine", "ejs" );

  app.use(API, apiRouter);
  app.use(ENTRY, viewRouter);
  app.use(() => {
    throw new CustomError(NOT_FOUND);
  });


  app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {

    if (process.env.NODE_ENV === 'development') {
      console.error('Catch error in app error handler', err.message);
    }

    res.status(err.status);
    res.json(`An error occured with the code ${err.status}`);
  });
} catch (e) {
  console.error('error occur during server.ts loading', e);
  throw e;
}

export default app;
