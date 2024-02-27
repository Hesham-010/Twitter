import { Inject, Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { hash } from 'bcryptjs';
import { IRepository } from 'src/_common/database/buildRepository.interface';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { Op } from 'sequelize';
import { UsersFilter } from '../dto/getUser.input';
import { HelperService } from 'src/helper/helper.service';
import { PaginationInput } from '../dto/pagination.input';
import { GetUserInput } from '../dto/getUserInput';
import { SecurityGroup } from 'src/security-group/models/security-group.model';
import { getAllPermissions } from 'src/security-group/security-group-permissions';
import { DeviceEnum, UserVerificationCodeUseCaseEnum } from '../user.enums';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserVerificationCode } from '../models/user-verification-code.model';
import { UserByPhoneBasedOnUseCaseOrErrorInput } from '../user.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: IRepository<User>,
    private helper: HelperService,
    @Inject(Repositories.SecurityGroupsRepository)
    private securityGroupRepo: IRepository<SecurityGroup>,
    private config: ConfigService,
  ) {}

  async allUsers(
    filter: UsersFilter,
    paginate: PaginationInput,
    currentUserId: string,
  ) {
    const users = await this.userRepo.findPaginated(
      {
        id: { [Op.ne]: currentUserId },
        ...(filter.role && { role: filter.role }),
        ...(filter.isBlocked !== undefined && {
          isBlocked: filter.isBlocked,
        }),
        ...(filter.gender && { gender: filter.gender }),
        ...(filter.searchKey && {
          [Op.or]: [
            {
              fullname: {
                [Op.iLike]: `%${this.helper.trimAllSpaces(filter.searchKey)}%`,
              },
            },
            { email: { [Op.iLike]: `%${filter.searchKey}%` } },
            { verifiedPhone: { [Op.iLike]: `%${filter.searchKey}%` } },
          ],
        }),
      },
      '-createdAt',
      paginate.page,
      paginate.limit,
    );
    return users;
  }

  async getUser(input: GetUserInput) {
    const user = await this.userRepo.findOne({ id: input.userId });
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }

  async seedAdmin() {
    // 1- get super admin group from security group
    let superAdminGroup = await this.securityGroupRepo.findOne({
      groupName: 'SuperAdmin',
    });

    // 2- check if super admin group exist in security group or create it
    if (!superAdminGroup)
      superAdminGroup = await this.securityGroupRepo.createOne({
        groupName: 'SuperAdmin',
        permissions: getAllPermissions(),
      });

    let superAdmin = await this.userRepo.findOne({
      securityGroupId: superAdminGroup.id,
    });

    // 3- check if super admin exist in user repo or create it
    if (!superAdmin)
      superAdmin = await this.userRepo.createOne({
        firstName: process.env.APP_NAME,
        lastName: 'Admin',
        fullName: `${process.env.APP_NAME}_Admin`,
        slug: `${process.env.APP_NAME}-admin`,
        email: `admin@${process.env.APP_NAME}.com`,
        verifiedPhone: '+201011122233',
        password: await hash(`${process.env.APP_NAME}@123456`, 12),
        country: 'EG',
        isBlocked: false,
        securityGroupId: superAdminGroup.id,
        lastLoginDetails: {
          lastLoginAt: new Date(),
          lastLoginDevice: DeviceEnum.DESKTOP,
        },
        fcmTokens: {
          [DeviceEnum.DESKTOP.toLowerCase()]: sign(
            { securityGroupId: superAdminGroup.id },
            this.config.get('JWT_SECRET'),
          ),
        },
      });
    return true;
  }

  async userByNotVerifiedPhoneOrError(phone: string) {
    const user = await this.userRepo.findOne({ notVerifiedPhone: phone }, [
      UserVerificationCode,
    ]);
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }

  async userByVerifiedPhoneOrError(phone: string) {
    const user = await this.userRepo.findOne({ verifiedPhone: phone }, [
      UserVerificationCode,
    ]);
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }

  async errorIfUserWithVerifiedPhoneExists(phone: string) {
    if (phone && (await this.userRepo.findOne({ verifiedPhone: phone })))
      throw new BaseHttpException(ErrorCodeEnum.PHONE_ALREADY_EXISTS);
  }

  async deleteDuplicatedUsersAtNotVerifiedPhone(duplicatedPhone: string) {
    await this.userRepo.deleteAll({ notVerifiedPhone: duplicatedPhone });
  }

  async deleteDuplicatedUsersAtEmailsIfPhoneNotVerifiedYet(
    duplicatedEmail?: string,
  ) {
    if (duplicatedEmail) {
      const user = await this.userRepo.findOne({ email: duplicatedEmail });
      if (user && !user.verifiedPhone) await user.destroy({ force: true });
    }
  }

  async errorIfUserWithEmailExists(email?: string) {
    if (email && (await this.userRepo.findOne({ email })))
      throw new BaseHttpException(ErrorCodeEnum.EMAIL_ALREADY_EXISTS);
  }

  async getValidUserforLogin(filter): Promise<User> {
    const user = await this.userRepo.findOne(filter);
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    if (user.isBlocked) throw new BaseHttpException(ErrorCodeEnum.BLOCKED_USER);
    return user;
  }

  async userByPhoneBasedOnUseCase(
    input: UserByPhoneBasedOnUseCaseOrErrorInput,
  ): Promise<User> {
    if (input.useCase === UserVerificationCodeUseCaseEnum.PHONE_VERIFICATION)
      return await this.userRepo.findOne({ notVerifiedPhone: input.phone });
    return await this.userRepo.findOne({ verifiedPhone: input.phone });
  }

  async errorIfOtherUserHasSameVerifiedPhone(phone: string, userId: string) {
    const otherUser = await this.userRepo.findAll({
      verifiedPhone: phone,
      id: { [Op.ne]: userId },
    });
    if (otherUser.length)
      throw new BaseHttpException(ErrorCodeEnum.PHONE_ALREADY_EXISTS);
  }

  async userIfverifiedOrNotVerifiedPhone(phone: string) {
    const user = await this.userRepo.findOne({
      [Op.or]: [{ verifiedPhone: phone }, { notVerifiedPhone: phone }],
    });

    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);

    return user;
  }
}
