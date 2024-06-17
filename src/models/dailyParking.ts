import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';

export interface DailyParkingAttributes {
  carType: string;
  plateNumber: string;
  serviceEndDate: string;
  listDate: string;
  serviceTime: string;
  parkingLotCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getDailyparkingModal = (db: Sequelize): ModelStatic<Model<string, DailyParkingAttributes>> => {
  return db.define('dailyparking', {
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
    parkingLotCode: {
      // i/p, gmg, b
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
    serviceTime: {
      // 시간: 'hh:mm'
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
