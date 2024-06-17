import express, { Request, Response } from 'express';
import _ from 'lodash';
import { SUCCESS } from '../constants';
import { db } from '../loaders';
import { csvHandler, failResponse, CustomError, successResponse } from '../services';
import { getFindSyntax } from '../utils/squelizeUtils';

const Dailyparking = db.models.dailyparking;

const createDailyParking = async (req: Request, res: Response) => {
  const { reserv, parkingLot } = req.body;

  try {
    // 필요한 필드를 추출하여 새로운 객체를 생성합니다.
    const dailyParkingData = {
      carType: reserv.carType,
      plateNumber: reserv.plateNumber,
      serviceEndDate: reserv.serviceEndDate,
      listDate: reserv.listDate,
      serviceTime: reserv.serviceTime,
      parkingLotCode: parkingLot,
    };

    // 데이터베이스에 삽입합니다.
    const newDailyParking = await Dailyparking.create(dailyParkingData);

    // 성공 응답을 보냅니다.
    return res.status(200).json({ isSuccess: true });
  } catch (error) {
    console.error(error);
    // 실패 응답을 보냅니다.
    return res.status(500).json(failResponse((error as any).message));
  }
};

const _removeDup = (list: any) => {
  return list.reduce((acc: any, current: any) => {
    const existing = acc.find((item: any) => item.plateNumber === current.plateNumber);
    if (!existing) {
      acc.push(current);
    } else if (new Date(existing.updatedAt) < new Date(current.updatedAt)) {
      const index = acc.indexOf(existing);
      acc[index] = current;
    }
    return acc;
  }, [] as any[]);
};

const getParkingListByDate = async (req: Request, res: Response) => {
  const targetByUploadDate = req.query.listDate as string;

  const dailyParkings = await Dailyparking.findAll({ ...getFindSyntax(targetByUploadDate), raw: true });
  const filteredList = _removeDup(dailyParkings);

  res.status(200).json({
    isSuccess: true,
    data: filteredList,
  });
};

const dailyparkingControllers = {
  createDailyParking,
  getParkingListByDate,
};

export default dailyparkingControllers;
