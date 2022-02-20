import express from 'express';
import cors from 'cors';
import path from 'path';
import { viewRouter, apiRouter } from '../routes';
import { ENTRY, API } from '../constants/routes';

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set( "views", path.join( __dirname, "../views" ) );
app.set( "view engine", "ejs" );

app.use(API, apiRouter);
app.use(ENTRY, viewRouter);

export default app;
