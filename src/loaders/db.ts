import { Sequelize, Dialect } from 'sequelize';
import { getDailyChartModel, getDailyParkingModal } from '../models';

const database = process.env.DB_DATABASE || 'local';
const username = process.env.DB_USERNAME || 'root';
const password = process.env.DB_PASSWORD || '';
const host = process.env.DB_HOST || '3306';
const dialect = (process.env.DB_DIALECT as Dialect) || ('mysql' as Dialect);
const timezone = process.env.DB_TIMEZONE || '+09:00';

const sequelize = new Sequelize(database, username, password, { host, dialect, timezone });
const Dailychart = getDailyChartModel(sequelize);
const DailyParking = getDailyParkingModal(sequelize);

export default {
  meta: sequelize,
  models: {
    dailychart: Dailychart,
    dailyparking: DailyParking,
  },
};
