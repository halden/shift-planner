import { DataSource, DataSourceOptions } from 'typeorm';
import { Shift } from '../shifts/entities/shift.entity';
import { User } from '../users/entities/user.entity';

export const config = {
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: 3306,
  username: 'root',
  password: 'example',
  database: 'shift_planner',
  // synchronize: process.env.NODE_ENV !== 'production',
  synchronize: false, // change it after the first migration run to the line above
};

export const appDataSource = new DataSource({
  entities: [User, Shift],
  migrations: ['src/db/migrations/*.ts'],
  ...config,
} as DataSourceOptions);
