import express, { Request, Response } from 'express';
import _ from 'lodash';
import { SUCCESS } from '../constants';
import { db } from '../loaders';
import { csvHandler, failResponse, CustomError } from '../services';


const Dailychart = db.models.dailychart;

const postDailychart = async (req: Request, res: Response) => {  
  
  const uploadDate = req.query.date as string;
  const parsedCsv = csvHandler.parser(req.files, uploadDate);


  if (_.isEmpty(parsedCsv)) {
    console.log('fail to generate csv file');
    res.status(SUCCESS.status).json(failResponse('fail to generate csv file'));
    return;
  }
  
  try {
    const insertResult = await Dailychart.bulkCreate(parsedCsv);
    
    if (insertResult.length !== parsedCsv.length) {
      throw new CustomError({ 
        message: `asked to bulkInsert ${parsedCsv.length} rows, but inserted ${insertResult.length}`
      });
    }

    const csvForDownload = csvHandler.csvGenerator(parsedCsv);
    res.setHeader('Content-disposition', 'attachment; filename=data.csv');
    res.set('Content-Type', 'text/csv');
    res.status(SUCCESS.status).send(csvForDownload);
    return; 
  } catch (err: unknown) {
    console.log('bulkCreate err in postSheet controller', err);
    res.status(SUCCESS.status).json(failResponse(err));
  }
};

const getDailychart = async (req: Request, res: Response) => {
  if (req.query.listDate) {
    const targetByUploadDate = { where: { listDate: req.query.listDate } } as any;

    try {
      const findResult = await Dailychart.findAll(targetByUploadDate);
      res.status(SUCCESS.status).json(findResult);
    } catch (err: unknown) {
      console.log('findAll err in postSheet controller', err);
      res.status(SUCCESS.status).json('There was a problem during findAll');
    }

    return;
  }

  res.status(SUCCESS.status).json('There was no listDate');
};

const dailychartControllers = {
  postDailychart,
  getDailychart,
};

export default dailychartControllers;