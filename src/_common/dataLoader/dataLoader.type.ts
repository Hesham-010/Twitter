import * as DataLoader from 'dataloader';
import { SecurityGroup } from 'src/security-group/models/security-group.model';
import { User } from 'src/user/models/user.model';

export type UserDataType = DataLoader<string, User>;
export type SecurityGroupLoaderType = DataLoader<string, SecurityGroup>;

export type userDataLoaderType = {
  userLoader: UserDataType;
  securityGroupLoader: SecurityGroupLoaderType;
};
