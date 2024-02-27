import { ConfigService } from '@nestjs/config';
import { models } from './database.models';
import { SequelizeOptions } from 'sequelize-typescript';

export const config = (configService: ConfigService) => {
  return <SequelizeOptions>{
    dialect: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: +configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database:
      configService.get('NODE_ENV') === 'test'
        ? configService.get('DATABASE_NAME')
        : configService.get('DB_NAME'),
    models,
  };
};
