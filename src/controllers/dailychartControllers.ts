import express, { Request, Response } from 'express';
import _ from 'lodash';
import { SUCCESS } from '../constants';
import { db } from '../loaders';
import { csvHandler, failResponse, CustomError, successResponse } from '../services';
import { getFindSyntax } from '../utils/squelizeUtils';

const Dailychart = db.models.dailychart;

const createDailychart = async (req: Request, res: Response) => {
  const uploadDate = req.query.date as string;
  const hasAlreadyUploadedList = await checkHasAlreadyUploadedList(uploadDate);

  if (hasAlreadyUploadedList) {
    await Dailychart.destroy(getFindSyntax(uploadDate));
  }

  const { result, message } = await insertUploadedFile(req.files, uploadDate);
  const resultMessage = result ? successResponse(message) : failResponse(message);

  res.status(SUCCESS.status).json(resultMessage);
  return;
};

const checkHasAlreadyUploadedList = async (listDate: string) => {
  const listOnUploadDate = await Dailychart.findOne(getFindSyntax(listDate));
  return !_.isNil(listOnUploadDate);
};

const insertUploadedFile = async (files: Express.Request['files'], listDate: string) => {
  console.log('files', files);
  const rowsForDB = csvHandler.parser(files, listDate);

  if (_.isEmpty(rowsForDB)) {
    console.log('fail to parse excel file');
    return { result: false, messgae: 'fail to parse excel file' };
  }

  try {
    const insertResult = await Dailychart.bulkCreate(rowsForDB);

    if (insertResult.length !== rowsForDB.length) {
      throw new CustomError({
        message: `asked to bulkInsert ${rowsForDB.length} rows, but inserted ${insertResult.length}`,
      });
    }

    return { result: true, message: 'success to upload' };
  } catch (err: any) {
    console.log('bulkCreate err in postSheet controller', err);
    return { result: false, message: err?.message };
  }
};

const getDailychart = async (req: Request, res: Response) => {
  if (req.query.listDate) {
    const targetByUploadDate = req.query.listDate as string;

    try {
      const findResult = await Dailychart.findAll(getFindSyntax(targetByUploadDate));
      res.status(SUCCESS.status).json(findResult);
    } catch (err: unknown) {
      console.log('findAll err in postSheet controller', err);
      res.status(SUCCESS.status).json('There was a problem during findAll');
    }

    return;
  }

  res.status(SUCCESS.status).json('There was no listDate');
};

const updateOneColumnInDailychart = async (req: Request, res: Response) => {
  const { id, serviceTime } = req.body;

  const updateValue = { serviceTime } as any;
  const findCondition = { where: { id } } as any;
  const updatedResult = await Dailychart.update(updateValue, findCondition);

  const isSuccess = Boolean(updatedResult[0]);

  if (isSuccess) {
    res.status(SUCCESS.status).json({ isSuccess: true });
  } else {
    res.status(400).json({ isSuccess: false });
  }
};

const dailychartControllers = {
  createDailychart,
  getDailychart,
  updateOneColumnInDailychart,
};

export default dailychartControllers;
