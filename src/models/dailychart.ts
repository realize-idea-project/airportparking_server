import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';

export const EXCEL_COLOUMNS = [
  '번호',
  '입출고',
  '시간',
  '차량모델',
  '차번호',
  '핸드폰',
  '요금',
  '이름',
  '비고',
  '출고일',
];
export interface DailyChartAttributes {
  // count: string;
  serviceType: string;
  serviceTime: string;
  carType: string;
  plateNumber: string;
  contactNumber: string;
  serviceCharge: number;
  customerName: string;
  note: string;
  serviceEndDate: string;
  listDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getDailyChartModel = (db: Sequelize): ModelStatic<Model<string, DailyChartAttributes>> => {
  return db.define('dailychart', {
    serviceType: {
      // 입출고: '출고' | '입고'
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceTime: {
      // 시간: 'hh:mm'
      type: DataTypes.STRING,
      allowNull: true,
    },
    carType: {
      // 차량모델: 'string'
      type: DataTypes.STRING,
      allowNull: true,
    },
    plateNumber: {
      // 차번호: 'string' 02도 8805
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactNumber: {
      // 폰번호: xxx-xxxx-xxxx
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceCharge: {
      // 금액: '50000'
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    customerName: {
      // 예약자이름: '최희경'
      type: DataTypes.STRING,
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceEndDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    listDate: {
      // 2020-02-20
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
