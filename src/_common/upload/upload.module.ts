import { Module } from '@nestjs/common';
import { UploadService } from './services/upload.service';
import { UploadResolver } from './resolvers/upload.resolver';
import { UploadScalar } from './uploader.scalar';

@Module({
  providers: [UploadResolver, UploadService],
  exports: [UploadService],
})
export class UploadModule {}
