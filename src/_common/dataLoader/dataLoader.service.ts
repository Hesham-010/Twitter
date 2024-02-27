import { Inject, Injectable } from '@nestjs/common';
import { IDataLoaderService, IDataLoaders } from './dataLoader.interface';
import { UserDataLoaderService } from 'src/user/userDataLoader.service';

@Injectable()
export class DataLoaderService implements IDataLoaderService {
  constructor(
    @Inject(UserDataLoaderService)
    private readonly userDataLoaderService: IDataLoaderService,
  ) {}

  createLoader(): IDataLoaders {
    return {
      ...this.userDataLoaderService.createLoader(),
    };
  }
}
