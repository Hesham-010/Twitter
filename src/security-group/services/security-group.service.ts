import { Inject, Injectable } from '@nestjs/common';
import { IRepository } from 'src/_common/database/buildRepository.interface';
import { SecurityGroup } from '../models/security-group.model';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { CreateSecurityGroupInput } from '../inputs/create-securityGroup.input';
import { UpdateSecurityGroupInput } from '../inputs/update-securityGroup.input';
import { Op } from 'sequelize';
import { AssignSecurityGroupToUsers } from '../inputs/assign-securityGroup.input';
import { User } from 'src/user/models/user.model';
import { DeleteSecurityGroupInput } from '../inputs/delete-securityGroup.input';

@Injectable()
export class SecurityGroupService {
  constructor(
    @Inject(Repositories.SecurityGroupsRepository)
    private securityGroupRepo: IRepository<SecurityGroup>,
    @Inject(Repositories.UsersRepository)
    private userRepo: IRepository<User>,
  ) {}

  async securityGroups() {
    const securityGroups = await this.securityGroupRepo.findAll();
    return securityGroups;
  }

  async securityGroup({ securityGroupId }) {
    const securityGroup = await this.getOneSecurityGroup(securityGroupId);

    return securityGroup;
  }

  async createSecurityGroup(input: CreateSecurityGroupInput) {
    const existSecurityGroup = await this.securityGroupRepo.findOne({
      groupName: input.groupName,
    });

    if (existSecurityGroup)
      throw new BaseHttpException(
        ErrorCodeEnum.SECURITY_GROUP_NAME_ALREADY_EXISTS,
      );

    const securityGroup = await this.securityGroupRepo.createOne(input);
    return securityGroup;
  }

  async updateSecurityGroup(input: UpdateSecurityGroupInput) {
    const securityGroup = await this.getOneSecurityGroup(input.securityGroupId);

    const existSecurityGroup = await this.securityGroupRepo.findOne({
      id: { [Op.ne]: input.securityGroupId },
      groupName: input.groupName,
    });

    if (existSecurityGroup)
      throw new BaseHttpException(
        ErrorCodeEnum.SECURITY_GROUP_NAME_ALREADY_EXISTS,
      );

    const newSecurityGroup =
      await this.securityGroupRepo.updateOneFromExistingModel(
        securityGroup,
        input,
      );

    return newSecurityGroup;
  }

  async assignSecurityGroup(input: AssignSecurityGroupToUsers) {
    const securityGroup = await this.getOneSecurityGroup(input.securityGroupId);

    const users = await this.userRepo.findAll({
      id: { [Op.in]: input.userIds },
    });

    if (users.length !== input.userIds.length)
      throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);

    await this.userRepo.updateAll(
      { id: { [Op.in]: input.userIds } },
      { securityGroupId: input.securityGroupId },
    );

    return securityGroup;
  }

  async unAssignSecurityGroup(input: AssignSecurityGroupToUsers) {
    const users = await this.userRepo.findAll({
      id: { [Op.in]: input.userIds },
    });

    if (users.length !== input.userIds.length)
      throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);

    await this.userRepo.updateAll(
      { id: { [Op.in]: input.userIds } },
      { securityGroupId: null },
    );

    return true;
  }

  async deleteSecurityGroup(input: DeleteSecurityGroupInput) {
    const group = await this.getOneSecurityGroup(input.securityGroupId);
    if (group.groupName === 'SuperAdmin')
      throw new BaseHttpException(ErrorCodeEnum.CANT_DELETE_SUPER_ADMIN_GROUP);
    await this.securityGroupRepo.deleteAll({ id: input.securityGroupId });
    return true;
  }

  // get One security group
  async getOneSecurityGroup(securityGroupId: string) {
    const securityGroup = await this.securityGroupRepo.findOne({
      id: securityGroupId,
    });

    if (!securityGroup)
      throw new BaseHttpException(ErrorCodeEnum.SECURITY_GROUP_DOES_NOT_EXIST);

    return securityGroup;
  }
}
