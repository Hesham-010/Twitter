import { Inject, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { saveFile } from '../filePath';
import { File } from '../models/file.model';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/buildRepository.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject(Repositories.FilesRepository)
    private fileRepo: IRepository<File>,
  ) {}

  uploadFile(createReadStream, filename): Promise<string> {
    const filePath = saveFile(filename);
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', () => resolve(filePath))
        .on('error', (err) => {
          reject('error uploading file');
        }),
    );
  }

  async createFile(filePath, useCase) {
    return await this.fileRepo.createOne({
      ...filePath,
    });
  }
}
