import { SecurityGroupLoaderType, UserDataType } from './dataLoader.type';

export interface IDataLoaderService {
  createLoader();
}

export interface IDataLoaders {
  userLoader: UserDataType;
  securityGroupLoader: SecurityGroupLoaderType;
}
