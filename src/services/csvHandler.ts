import _ from 'lodash';
import iconvlite from 'iconv-lite';
import jschardet from 'jschardet';
import { parse } from 'json2csv';
import { DailyChartAttributes } from '../models/dailychart';

type ParsedCsv = DailyChartAttributes & { count: string};

/**  
 * 2022.02.19 입/출고 파일 기준
 * IN_OUT_CSV_COLUMNS 배열의 '비고' 항목의 데이터가 동적으로 들어옵니다.
 * '이름' 항목을 기준으로 '번호' ~ '이름' 항목까지와 '비고' ~ '출고시간'을
 * 나누어서 다루고 있습니다.
 */ 

const STATIC_DATA_COLUMNS = ['번호', '입출고', '시간', '차량모델', '차번호', '핸드폰', '요금', '이름'];
const DYNAMIC_DATA_COLUMNS = ['비고', '출고일', '출고시간'];
const STATIC_DATA_COLUMN_INDEX = STATIC_DATA_COLUMNS.length - 1;
const serviceEndDateDigits = 2; // 출고일은 2자리
const serviceTimeIndex = 2;

const parser = (files: Express.Request['files'], listDate: string) => {
  if (_.isNil(files) || _.isEmpty(files)) return [];

  if (Array.isArray(files)) {
    const encodedBuffer = encodeToUft8(files);
    const JsonContentFromCsv = formatCsvBufferIntoArray(encodedBuffer)
      .sort(sortByServiceTime)
      .map(mapNewIndex)
      .map(convertCsvToObject(listDate));
    
    return JsonContentFromCsv;
  }

  return [];
};

const encodeToUft8 = (csvFiles: Express.Multer.File[]) => {
  if (_.isEmpty(csvFiles) || _.isNil(csvFiles)) return [];
  return csvFiles.map(filterBuffers).map(getUft8EncodedBuffer);
};

const formatCsvBufferIntoArray = (encodedBuffer: string[]) => {
  if (_.isEmpty(encodedBuffer) || _.isNil(encodedBuffer)) return [];
  
  const result =  _.flatMap(encodedBuffer, splitByNewLine)
    .filter(deleteEmptyRows)
    .filter(deleteMeaninglessRows)
    .map(splitByColumns);

  return result;
};

const filterBuffers = (file: Express.Multer.File) => file.buffer;
const getUft8EncodedBuffer = (fileBuffer: Buffer) => iconvlite.decode(fileBuffer, jschardet.detect(fileBuffer).encoding);
const splitByNewLine = (string: string) => string.split('\n');
const deleteEmptyRows = (string: string) => string !== '\r';
const deleteMeaninglessRows = (string: string) => !_.isNaN(Number(string[0]));
const trimValues = (string: string) => _.trim(string);

const splitByColumns = (string: string) => {
  const splittedData = string.split(',').map(trimValues);

  const staticColumnData = splittedData.slice(0, STATIC_DATA_COLUMN_INDEX + 1);
  const changableColumnData = parseChangableData(splittedData.slice(STATIC_DATA_COLUMN_INDEX + 1));
  
  return [ ...staticColumnData, ...changableColumnData ];
};

const parseChangableData = (dynamicData: string[]) => {
  const serviceEndDateIndex = dynamicData.findIndex(isServiceEndDate);
  const hasServiceEndDate = serviceEndDateIndex !== -1;

  if (!hasServiceEndDate) return parseNoServiceEndDateColumnData(dynamicData);

  return parseHasServiceEndDateColumnData(dynamicData, serviceEndDateIndex)
};

const isServiceEndDate = (data: string) => data.length === serviceEndDateDigits && !_.isNaN(Number(data))

const parseNoServiceEndDateColumnData = (dynamicData: string[]) => {
  const noteColumnData = dynamicData.join(',');
  return [ noteColumnData ];
};

const parseHasServiceEndDateColumnData = (dynamicData: string[], serviceEndDateIndex: number) => {
  const noteColumnData = dynamicData.slice(0, serviceEndDateIndex).join(',');
  const serviceEndAt = dynamicData[serviceEndDateIndex];
  const serviceEndTime = dynamicData[serviceEndDateIndex + 1];

  return [noteColumnData, serviceEndAt, serviceEndTime];
};

const sortByServiceTime = (a: string[], b: string[]) => {
  if (a[serviceTimeIndex] === b[serviceTimeIndex]) return 0;
  return a[serviceTimeIndex] > b[serviceTimeIndex] ? 1 : -1;
};

const mapNewIndex = (row: string[], index: number) => [(index + 1).toString(), ...row.slice(1)];

const convertCsvToObject = (listDate: string) => (row: string[]): ParsedCsv => {

  return {
    count: row[0],
    serviceType: row[1],
    serviceTime: row[2] || "00:00",
    carType: row[3],
    plateNumber: row[4],
    contactNumber: row[5],
    serviceCharge: row[6] || '0',
    customerName: row[7],
    note: row[8],
    serviceEndDate: row[9] || '',
    serviceEndAt: row[10] || '',
    listDate: listDate || '',
  };
};

const csvGenerator = (paredCsvs: ParsedCsv[]) => {
  const csvData = paredCsvs.map(changeFieldName);
  const csv = parse(csvData, { withBOM: true });
  
  return csv;
};

const changeFieldName = (parsedCsv: ParsedCsv) => {
  return {
    [STATIC_DATA_COLUMNS[0]]: parsedCsv.count,
    [STATIC_DATA_COLUMNS[1]]: parsedCsv.serviceType,
    [STATIC_DATA_COLUMNS[2]]: parsedCsv.serviceTime,
    [STATIC_DATA_COLUMNS[3]]: parsedCsv.carType,
    [STATIC_DATA_COLUMNS[4]]: parsedCsv.plateNumber,
    [STATIC_DATA_COLUMNS[5]]: parsedCsv.contactNumber,
    [STATIC_DATA_COLUMNS[6]]: parsedCsv.serviceCharge,
    [STATIC_DATA_COLUMNS[7]]: parsedCsv.customerName,
    [DYNAMIC_DATA_COLUMNS[0]]: parsedCsv.note,
    [DYNAMIC_DATA_COLUMNS[1]]: parsedCsv.serviceEndDate,
    [DYNAMIC_DATA_COLUMNS[2]]: parsedCsv.serviceEndAt,
  };
};
  
const csvHandler = {
	parser,
  csvGenerator,
};

export default csvHandler;