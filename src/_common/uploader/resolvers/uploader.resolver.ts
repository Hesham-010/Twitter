import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UploadFileInput } from '../upload-file.input';
import { UploaderService } from '../services/uploader.service';
import { GqlStringResponse } from '../../graphql/graphql-response.type';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/current_user.decorator';

@Resolver()
export class UploaderResolver {
  constructor(private readonly uploadService: UploaderService) {}

  @UseGuards(AuthGuard)
  @Mutation((returns) => GqlStringResponse)
  async uploadFile(
    @Args() input: UploadFileInput,
    @CurrentUser('id') currentUserId: string,
  ) {
    return await this.uploadService.graphqlUpload(
      { file: input.file, saveTo: input.model },
      currentUserId,
    );
  }
}
