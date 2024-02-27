import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { UserVerificationCode } from '../models/user-verification-code.model';
import { User } from '../models/user.model';
import { UsersService } from './users.service';
import { IRepository } from 'src/_common/database/buildRepository.interface';
import { UserVerificationCodeUseCaseEnum } from '../user.enums';
import {
  DeleteVerificationCodeAndUpdateUserModelInput,
  UserByPhoneBasedOnUseCaseOrErrorInput,
  ValidVerificationCodeOrErrorInput,
  VerificationCodeAndExpirationDate,
} from '../user.interface';

@Injectable()
export class UserVerificationCodeService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(Repositories.UserVerificationCodesRepository)
    private readonly userVerificationCodeRepo: IRepository<UserVerificationCode>,
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: IRepository<User>,
    private readonly usersService: UsersService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  generateVerificationCodeAndExpiryDate(): VerificationCodeAndExpirationDate {
    return {
      verificationCode:
        this.configService.get('NODE_ENV') === 'production'
          ? Math.floor(1000 + Math.random() * 9000).toString()
          : '1234',
      expiryDateAfterOneHour: new Date(Date.now() + 3600000),
    };
  }

  async validVerificationCodeOrError(input: ValidVerificationCodeOrErrorInput) {
    const verificationCode = await this.userVerificationCodeRepo.findOne({
      userId: input.user.id,
      code: input.verificationCode,
      useCase: input.useCase,
    });
    if (!verificationCode)
      throw new BaseHttpException(ErrorCodeEnum.VERIFICATION_CODE_NOT_EXIST);
    if (verificationCode.expiryDate < new Date())
      throw new BaseHttpException(ErrorCodeEnum.EXPIRED_VERIFICATION_CODE);
    return verificationCode;
  }

  async userByPhoneBasedOnUseCaseOrError(
    input: UserByPhoneBasedOnUseCaseOrErrorInput,
  ) {
    return input.useCase === UserVerificationCodeUseCaseEnum.PHONE_VERIFICATION
      ? await this.usersService.userByNotVerifiedPhoneOrError(input.phone)
      : await this.usersService.userByVerifiedPhoneOrError(input.phone);
  }

  errorIfUserPhoneVerified(user: User, phone: string) {
    if (user.verifiedPhone === phone)
      throw new BaseHttpException(ErrorCodeEnum.USER_PHONE_ALREADY_VERIFIED);
  }

  async deleteVerificationCodeAndUpdateUserModel(
    input: DeleteVerificationCodeAndUpdateUserModelInput,
    fieldsWillUpdated: object,
  ): Promise<User> {
    return await this.sequelize.transaction(async (transaction) => {
      await this.userVerificationCodeRepo.deleteAll(
        { userId: input.user.id, useCase: input.useCase },
        transaction,
      );

      return await this.userRepo.updateOneFromExistingModel(
        input.user,
        fieldsWillUpdated,
        transaction,
      );
    });
  }
}
