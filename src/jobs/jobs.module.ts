import { Module } from '@nestjs/common';
import { JobsService } from './service/jobs.service';

@Module({
  providers: [JobsService],
})
export class JobsModule {}
