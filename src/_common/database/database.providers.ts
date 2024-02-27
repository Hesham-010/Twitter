import { ConfigService } from '@nestjs/config';
import { config } from './database.config';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

export let sequelizeInstance: Sequelize;

export const databaseProvider = {
  provide: 'SEQUELIZE',
  useFactory: async (configService: ConfigService) => {
    sequelizeInstance = new Sequelize(<SequelizeOptions>config(configService));
    configService.get('NODE_ENV') !== 'testing' &&
      (await sequelizeInstance.sync());
    return sequelizeInstance;
  },
  inject: [ConfigService],
};
