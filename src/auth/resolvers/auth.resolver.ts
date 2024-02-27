import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';
import { AuthService } from '../services/auth.service';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/_common/decorators/current_user.decorator';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { GqlUserResponse } from 'src/user/user.response';
import { RegisterInput } from '../inputs/register.input';
import { Lang } from 'src/user/user.enums';
import { IsPhoneExistInput } from '../inputs/Is-phone-exist-input';
import { SetLastActiveDetailsInput } from '../inputs/set-last-active-details.input';
import { SendVerificationCodeByPhone } from '../inputs/send-verification-code.input';
import { VerifyUserByPhone } from '../inputs/verify-user-by-phone.input';
import { ResetPasswordByPhoneInput } from '../inputs/reset-password.input';
import { GqlLoginResponse } from '../login.response';
import { IContext } from 'src/_common/graphql/context.interface';
import {
  EmailAndPasswordLoginInput,
  PhoneAndPasswordLoginInput,
} from '../inputs/email-and-password-login.input';
import {
  GqlBooleanResponse,
  GqlStringResponse,
} from 'src/_common/graphql/graphql-response.type';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Query((returns) => GqlUserResponse)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @Query((returns) => GqlBooleanResponse)
  async isVerifiedPhoneExist(@Args('input') input: IsPhoneExistInput) {
    return await this.authService.isVerifiedPhoneExist(input);
  }

  @Mutation((returns) => GqlUserResponse, { name: 'register' })
  async register(
    @Args('input') input: RegisterInput,
    @Context('lang') lang: Lang,
  ) {
    return await this.authService.register(input, lang);
  }

  @Mutation(() => GqlLoginResponse)
  emailAndPasswordLogin(
    @Args('input') input: EmailAndPasswordLoginInput,
    @Context('lang') lang: Lang,
  ) {
    return this.authService.emailAndPasswordLogin(input, lang);
  }

  @Mutation(() => GqlLoginResponse)
  phoneAndPasswordLogin(
    @Args('input') input: PhoneAndPasswordLoginInput,
    @Context('lang') lang: Lang,
  ) {
    return this.authService.phoneAndPasswordLogin(input, lang);
  }

  @Mutation(() => GqlBooleanResponse)
  logOut(@Context('sessionId') sessionId: string) {
    return this.authService.logOut(sessionId);
  }

  @Mutation(() => GqlBooleanResponse)
  logOutFromOtherDevices(@Context() context: IContext) {
    return this.authService.logOutFromOtherDevices(context);
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => GqlUserResponse)
  async setLastActiveDetails(
    @Args('input') input: SetLastActiveDetailsInput,
    @CurrentUser('id') currentUserId: string,
  ): Promise<User> {
    return await this.authService.setLastActiveDetails(input, currentUserId);
  }

  @Mutation(() => GqlBooleanResponse)
  sendVerificationCodeByPhone(
    @Args('input') input: SendVerificationCodeByPhone,
  ): Promise<boolean> {
    return this.authService.sendVerificationCodeByPhone(input);
  }

  @Mutation(() => GqlUserResponse)
  verifyUserByPhone(@Args('input') input: VerifyUserByPhone) {
    return this.authService.verifyUserByPhone(input);
  }

  @Mutation(() => GqlUserResponse)
  resetPassword(@Args('input') input: ResetPasswordByPhoneInput) {
    return this.authService.resetPassword(input);
  }
}
