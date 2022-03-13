import _ from 'lodash';
import xlsx from 'xlsx';
import { DailyChartAttributes, EXCEL_COLOUMNS } from '../models/dailychart';

type ParsedRow = Record<string, string>;

const HEADER_ROW_INDEX = 2;
const CHARGE_EXCEPTION = '티몬';

const parser = (files: Express.Request['files'], listDate: string) => {
  if (_.isNil(files) || _.isEmpty(files)) return [];

  try {
    if (Array.isArray(files)) {
      const parsedRows = getRowsFromExcelFile(files);
      const dbRows = parsedRows.map(convertToDBFormat(listDate));

      return dbRows;
    }
    return [];
  } catch (err: unknown) {
    console.error('An error occur in parser function in csvHandler.ts', err);
    if (process.env.NODE_ENV === 'development') throw err;
    return [];
  }
};

const getRowsFromExcelFile = (excelFiles: Express.Multer.File[]) => {
  if (_.isEmpty(excelFiles) || _.isNil(excelFiles)) return [];

  try {
    const workSheet = excelFiles.map(getWorkSheet);
    const rowsInJson = _.flatMap(workSheet, makeJson).map(trimPropertiesToProtectData);
    const rowsInArray = rowsInJson.map(convertJsonToArray);

    return rowsInArray;
  } catch (err: unknown) {
    console.error('An error occur in parseExcel function in csvHandler.ts', err);
    if (process.env.NODE_ENV === 'development') throw err;
    return [];
  }
};

const getWorkSheet = (file: Express.Multer.File) => {
  const workBook = xlsx.read(file.buffer);
  return workBook.Sheets[workBook.SheetNames[0]];
};

const makeJson = (sheet: xlsx.WorkSheet): ParsedRow[] => {
  return xlsx.utils.sheet_to_json(sheet, { raw: false, range: HEADER_ROW_INDEX });
};

const trimPropertiesToProtectData = (row: ParsedRow) => {
  if (_.isNil(row)) return {};
  const trimmed = Object.entries(row).map(([key, value]) => [trimValues(key), trimValues(value)]);
  return Object.fromEntries(trimmed);
};

const trimValues = (string: string) => _.trim(string);

const convertJsonToArray = (row: ParsedRow) => EXCEL_COLOUMNS.map((key) => row[key] ?? '');

const convertToDBFormat =
  (listDate: string) =>
  (rows: string[]): DailyChartAttributes => {
    const serviceCharge = chargeStringToNumber(rows[6]);

    return {
      serviceType: rows[1] || '',
      serviceTime: rows[2] || '',
      carType: rows[3] || '',
      plateNumber: rows[4] || '',
      contactNumber: rows[5] || '',
      serviceCharge: !_.isNaN(serviceCharge) ? serviceCharge : 0,
      customerName: rows[7] || '',
      note: rows[8] || '',
      serviceEndDate: rows[9] || '',
      listDate: listDate || '',
    };
  };

const chargeStringToNumber = (charge: string) => {
  if (charge === CHARGE_EXCEPTION) {
    return 0;
  } else if (charge.includes(',')) {
    const strings = charge.split(',');
    return Number(`${strings[0]}${strings[1]}`);
  } else {
    return Number(charge);
  }
};

const csvHandler = {
  parser,
};

export default csvHandler;
