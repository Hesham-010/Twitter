import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { DataLoaderService } from './dataLoader.service';

@Module({
  imports: [UserModule],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class DataLoaderModule {}
