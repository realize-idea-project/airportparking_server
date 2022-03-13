import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { LOCAL_STORE_PATH } from '../constants';

const excelFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  // console.log(file, 'filters')
  if (!checkExtension(file)) {
    cb('Please upload only excel file.', false);
    return;
  }

  createCsvFolder();

  cb(null, true);
};

const createCsvFolder = () => {
  if (fs.existsSync(LOCAL_STORE_PATH)) return;
  fs.mkdirSync(LOCAL_STORE_PATH, { recursive: true });
};

const checkExtension = (file: Express.Multer.File) => {
  const acceptableExtensions = ['excel', 'spreadsheetml', 'csv'];
  return acceptableExtensions.some((extension) => file.mimetype.includes(extension));
};

const storage = multer.memoryStorage();
const fileUploader = multer({ storage, fileFilter: excelFilter });

export default fileUploader;
