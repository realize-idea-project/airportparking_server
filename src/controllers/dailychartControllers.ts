import express, { Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { db } from '../loaders';
import { csvHandler } from '../services';

const Dailychart = db.models.dailychart;

const postDailychart = async (req: Request, res: Response) => {  
  
  const uploadDate = req.query.date as string;
  const parsedCsv = csvHandler.parser(req.files, uploadDate);
  
  Dailychart.bulkCreate(parsedCsv).then(() => {
    const csvForDownload = csvHandler.csvGenerator(parsedCsv);
  
    res.setHeader('Content-disposition', 'attachment; filename=data.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvForDownload);
    return;
  }).catch((err: unknown) => {
    console.log('bulkCreate err in postSheet controller', err);
    res.status(200).send('There was a problem during blukcreate');
  });
};

const getDailychart = (req: Request, res: Response) => {
  if (req.query.listDate) {
    const targetByUploadDate = { where: { listDate: req.query.listDate } } as any;
    Dailychart.findAll(targetByUploadDate).then((list) => {
      console.log(list, '@@')
      res.status(200).json(list);
    }).catch((err) => {
      console.log('findAll err in postSheet controller', err);
      res.status(200).send('There was a problem during findAll');
    });
    return;
  }

  res.status(200).send('There was no listDate');
};

const dailychartControllers = {
  postDailychart,
  getDailychart,
};

export default dailychartControllers;