import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import { UploadService } from '../services/upload.service';
import { UploadScalar } from '../uploader.scalar';

@Resolver()
export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => UploadScalar })
    { createReadStream, filename }: FileUpload,
  ): Promise<string> {
    return this.uploadService.uploadFile(createReadStream, filename);
  }
}
