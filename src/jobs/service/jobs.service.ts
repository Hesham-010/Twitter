import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import { IRepository } from 'src/_common/database/buildRepository.interface';
import { Repositories } from 'src/_common/database/database-repository.enum';
// import { File } from 'src/_common/upload/models/file.model';

@Injectable()
export class JobsService {
  constructor() // @Inject(Repositories.FilesRepository) private fileRepo: IRepository<File>,
  {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async deleteFile() {
    // console.log('test');
    // const Path = path.resolve(__dirname, '..', '..', '..', 'uploads');
    // const directoryPath = fs.readdirSync(Path);
    // const usedFiles = await this.fileRepo.findAll();
    // const usedfilePaths = [];
    // usedFiles.forEach((file) => {
    //   usedfilePaths.push(file.filePath);
    // });
    // directoryPath.forEach(async (directory) => {
    //   const foldersPath = path.resolve(`uploads/${directory}`);
    //   const files = fs.readdirSync(foldersPath);
    //   files.forEach((fileName) => {
    //     if (usedfilePaths.includes(`uploads/${directory}/${fileName}`)) {
    //       return true;
    //     } else {
    //       fs.unlinkSync(`uploads/${directory}/${fileName}`);
    //       return true;
    //     }
    //   });
    // });
  }
}
