import { Global, Module } from '@nestjs/common';
import { databaseProvider } from './database.providers';
import { repositories } from './database.models';

@Global()
@Module({
  providers: [databaseProvider, ...repositories],
  exports: [databaseProvider, ...repositories],
})
export class DatabaseModule {}
