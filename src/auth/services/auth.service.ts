import { Inject, Injectable } from '@nestjs/common';
import { IRepository } from 'src/_common/database/buildRepository.interface';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { User } from 'src/user/models/user.model';
import { UsersService } from 'src/user/services/users.service';
import { RegisterInput } from '../inputs/register.input';
import { UserTransformer } from 'src/user/userTransformer.ts/user.transformer';
import { IsPhoneExistInput } from '../inputs/Is-phone-exist-input';
import { compare } from 'bcryptjs';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { SetLastActiveDetailsInput } from '../inputs/set-last-active-details.input';
import { SendVerificationCodeByPhone } from '../inputs/send-verification-code.input';
import { UserVerificationCodeService } from 'src/user/services/verification-code.service';
import { TwilioService } from 'src/twilio/twilio.service';
import { UserVerificationCode } from 'src/user/models/user-verification-code.model';
import { VerifyUserByPhone } from '../inputs/verify-user-by-phone.input';
import { ResetPasswordByPhoneInput } from '../inputs/reset-password.input';
import { IsUserWithVerificationCodeExistInput } from '../inputs/is-user-with-verification-code-exist';
import { HelperService } from 'src/helper/helper.service';
import { Lang, UserVerificationCodeUseCaseEnum } from 'src/user/user.enums';
import { Session } from 'src/session/models/session.model';
import { IContext } from 'src/_common/graphql/context.interface';
import { Op } from 'sequelize';
import { SessionService } from 'src/session/services/session.service';
import {
  EmailAndPasswordLoginInput,
  PhoneAndPasswordLoginInput,
} from '../inputs/email-and-password-login.input';
import {
  CreateAccessToken,
  CreateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from 'src/auth/createToken';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Repositories.UserVerificationCodesRepository)
    private userVerificationCodeRepo: IRepository<UserVerificationCode>,
    @Inject(Repositories.UsersRepository)
    private userRepo: IRepository<User>,
    @Inject(Repositories.SessionsRepository)
    private sessionsRepo: IRepository<Session>,
    private readonly userService: UsersService,
    private readonly userTransformer: UserTransformer,
    private readonly userVerificationCodeService: UserVerificationCodeService,
    private readonly sessionService: SessionService,
    private readonly twilioService: TwilioService,
    private readonly helperService: HelperService,
  ) {}

  async register(input: RegisterInput, lang: Lang): Promise<User> {
    await this.userService.errorIfUserWithVerifiedPhoneExists(input.phone);
    await this.userService.errorIfUserWithEmailExists(input.email);
    await this.userService.deleteDuplicatedUsersAtNotVerifiedPhone(input.phone);
    await this.userService.deleteDuplicatedUsersAtEmailsIfPhoneNotVerifiedYet(
      input.email,
    );
    const transformedInput =
      await this.userTransformer.registerAsUserInputTransformer(input, lang);
    return await this.userRepo.createOne({ ...transformedInput });
  }

  async isVerifiedPhoneExist(input: IsPhoneExistInput) {
    const user = await this.userRepo.findOne({
      verifiedPhone: input.phone,
      role: input.userRole,
    });
    return !!user;
  }

  async emailAndPasswordLogin(input: EmailAndPasswordLoginInput, lang: Lang) {
    const user = await this.userService.getValidUserforLogin({
      email: input.email,
    });

    await this.matchPassword(input.password, user.password);

    const transformerData =
      this.userTransformer.emailAndPasswordLoginInputTransformer(input, lang);

    await this.userRepo.updateOneFromExistingModel(user, transformerData);

    // Create session
    const session = await this.sessionService.create({
      fcmToken: input.fcmToken,
      device: input.device,
      userId: user.id,
      refreshToken: await CreateRefreshToken({
        userId: user.id,
      }),
    });

    // Create Access Token
    const token = await CreateAccessToken({
      userId: user.id,
      sessionId: session.id,
    });

    return { user, token, refreshToken: session.refreshToken };
  }

  async phoneAndPasswordLogin(input: PhoneAndPasswordLoginInput, lang: Lang) {
    const user = await this.userService.getValidUserforLogin({
      verifiedPhone: input.phone,
    });
    await this.matchPassword(input.password, user.password);

    const transformerData =
      this.userTransformer.phoneAndPasswordLoginInputTransformer(input, lang);

    await this.userRepo.updateOneFromExistingModel(user, {
      ...transformerData,
    });

    // Create session
    const session = await this.sessionService.create({
      fcmToken: input.fcmToken,
      device: input.device,
      userId: user.id,
      refreshToken: await CreateRefreshToken({
        userId: user.id,
      }),
    });

    // Create Access Token
    const token = await CreateAccessToken({
      userId: user.id,
      sessionId: session.id,
    });

    return { user, token, refreshToken: session.refreshToken };
  }

  async setLastActiveDetails(
    input: SetLastActiveDetailsInput,
    currentUserId: string,
  ) {
    const user = await this.userRepo.findOne({ id: currentUserId });
    await this.userRepo.updateOneFromExistingModel(user, {
      favLang: input.lang,
      lastLoginDetails: {
        lastLoginDevice: input.device,
        ...(input.platformDetails && {
          platformDetails: input.platformDetails,
        }),
        lastLoginAt: new Date(),
      },
    });
    return user;
  }

  async sendVerificationCodeByPhone(
    input: SendVerificationCodeByPhone,
  ): Promise<boolean> {
    const user = await this.userService.userByPhoneBasedOnUseCase({
      phone: input.phone,
      useCase: input.useCase,
    });

    if (input.useCase === UserVerificationCodeUseCaseEnum.PHONE_VERIFICATION)
      this.userVerificationCodeService.errorIfUserPhoneVerified(
        user,
        input.phone,
      );

    const codeAndExpiry =
      this.userVerificationCodeService.generateVerificationCodeAndExpiryDate();

    await this.twilioService.sendSMS(
      input.phone,
      codeAndExpiry.verificationCode,
    );

    const existCode = await this.userVerificationCodeRepo.findOne({
      userId: user.id,
      useCase: input.useCase,
    });

    if (existCode) await existCode.destroy();

    await this.userVerificationCodeRepo.createOne({
      useCase: input.useCase,
      code: codeAndExpiry.verificationCode,
      expiryDate: codeAndExpiry.expiryDateAfterOneHour,
      userId: user.id,
    });

    return true;
  }

  async verifyUserByPhone(input: VerifyUserByPhone) {
    const user = await this.userRepo.findOne({ notVerifiedPhone: input.phone });
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);

    await this.userVerificationCodeService.validVerificationCodeOrError({
      user,
      verificationCode: input.verificationCode,
      useCase: UserVerificationCodeUseCaseEnum.PHONE_VERIFICATION,
    });

    await this.userService.errorIfOtherUserHasSameVerifiedPhone(
      input.phone,
      user.id,
    );
    await this.userVerificationCodeService.deleteVerificationCodeAndUpdateUserModel(
      {
        user,
        useCase: UserVerificationCodeUseCaseEnum.PHONE_VERIFICATION,
      },
      { verifiedPhone: input.phone, notVerifiedPhone: null },
    );

    return user;
  }

  async resetPassword(input: ResetPasswordByPhoneInput) {
    const user = await this.userByValidVerificationCode({
      code: input.code,
      phone: input.phone,
      useCase: UserVerificationCodeUseCaseEnum.PASSWORD_RESET,
    });

    return await this.userVerificationCodeService.deleteVerificationCodeAndUpdateUserModel(
      { user, useCase: UserVerificationCodeUseCaseEnum.PASSWORD_RESET },
      { password: await this.helperService.hashPassword(input.newPassword) },
    );
  }

  async logOut(sessionId: string) {
    await this.sessionsRepo.deleteAll({ id: sessionId });
    return true;
  }

  async logOutFromOtherDevices(context: IContext) {
    await this.sessionsRepo.deleteAll({
      id: { [Op.ne]: context.sessionId },
      userId: context.currentUser.id,
    });
    return true;
  }

  /*------------------------------------------------------------------------*/
  async matchPassword(password: string, hash: string) {
    const isMatch = compare(password, hash);
    if (!isMatch)
      throw new BaseHttpException(ErrorCodeEnum.INCORRECT_EMAIL_OR_PASSWORD);
  }

  async userByValidVerificationCode(
    input: IsUserWithVerificationCodeExistInput,
  ) {
    const user = await this.userService.userIfverifiedOrNotVerifiedPhone(
      input.phone,
    );

    await this.userVerificationCodeService.validVerificationCodeOrError({
      user,
      verificationCode: input.code,
      useCase: input.useCase,
    });

    return user;
  }
}
