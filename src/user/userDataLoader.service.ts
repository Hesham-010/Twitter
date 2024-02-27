import { Inject, Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { IDataLoaderService } from 'src/_common/dataLoader/dataLoader.interface';
import { IRepository } from 'src/_common/database/buildRepository.interface';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { User } from './models/user.model';
import { HelperService } from 'src/helper/helper.service';
import { SecurityGroup } from 'src/security-group/models/security-group.model';
import {
  SecurityGroupLoaderType,
  UserDataType,
  userDataLoaderType,
} from 'src/_common/dataLoader/dataLoader.type';

@Injectable()
export class UserDataLoaderService implements IDataLoaderService {
  constructor(
    @Inject(Repositories.UsersRepository) private userRepo: IRepository<User>,
    @Inject(Repositories.SecurityGroupsRepository)
    private securityGroupRepo: IRepository<SecurityGroup>,
    private readonly helper: HelperService,
  ) {}

  createLoader(): userDataLoaderType {
    const userLoader: UserDataType = new DataLoader(
      async (userIds: string[]) => await this.findUserByIds(userIds),
    );

    const securityGroupLoader: SecurityGroupLoaderType = new DataLoader(
      async (senderIds: string[]) =>
        await this.findSecurityGroupsByIds(senderIds),
    );

    return {
      userLoader,
      securityGroupLoader,
    };
  }

  private async findUserByIds(usersIds) {
    const users = await this.userRepo.findAll({ id: usersIds });

    const Obj = {};
    users.forEach((user) => {
      Obj[user.id] = user;
    });

    return usersIds.map((userId: any) => Obj[userId]);
  }

  private async findSecurityGroupsByIds(securityGroupsIds: string[]) {
    const securityGroups = await this.securityGroupRepo.findAll({
      id: securityGroupsIds,
    });

    const Obj = {};
    securityGroups.forEach((securityGroup) => {
      Obj[securityGroup.id] = securityGroup;
    });

    return securityGroupsIds.map(
      (securityGroupsId: any) => Obj[securityGroupsId],
    );
  }
}
