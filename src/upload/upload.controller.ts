import {
  Controller,
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { multerOptions } from 'src/_common/config/multer.config';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 5 * 1024 * 1024;

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  public async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    return file.path;
  }
}
