import { Injectable } from '@nestjs/common';
import { RegisterInput } from 'src/auth/inputs/register.input';
import { Lang } from '../user.enums';
import { HelperService } from 'src/helper/helper.service';
import { LastLoginDetails } from '../user.type';
import {
  EmailAndPasswordLoginInput,
  PhoneAndPasswordLoginInput,
} from 'src/auth/inputs/email-and-password-login.input';
import { LastLoginDetailsTransformerInput } from '../user.interface';

@Injectable()
export class UserTransformer {
  constructor(private readonly helperService: HelperService) {}

  private lastLoginDetailsTransformer(
    input: LastLoginDetailsTransformerInput,
  ): LastLoginDetails {
    return {
      lastLoginAt: new Date(),
      ...(input.device && { lastLoginDevice: input.device }),
      ...(input.platformDetails && { platformDetails: input.platformDetails }),
    };
  }

  async registerAsUserInputTransformer(input: RegisterInput, favLang: Lang) {
    return {
      ...input,
      favLang,
      fullName: input.firstName + ' ' + input.lastName,
      notVerifiedPhone: input.phone,
      password: await this.helperService.hashPassword(input.password),
      slug: this.helperService.slugify(
        `${input.firstName} - ${input.lastName || ''}`,
      ),
      lastLoginDetails: this.lastLoginDetailsTransformer({
        device: input.device,
        ...(input.platformDetails && {
          platformDetails: input.platformDetails,
        }),
      }),
    };
  }

  emailAndPasswordLoginInputTransformer(
    input: EmailAndPasswordLoginInput,
    favLang: Lang,
  ) {
    return {
      favLang,
      lastLoginDetails: this.lastLoginDetailsTransformer({
        device: input.device,
        ...(input.platformDetails && {
          platformDetails: input.platformDetails,
        }),
      }),
    };
  }

  phoneAndPasswordLoginInputTransformer(
    input: PhoneAndPasswordLoginInput,
    favLang: Lang,
  ) {
    return {
      favLang,
      lastLoginDetails: this.lastLoginDetailsTransformer({
        device: input.device,
        ...(input.platformDetails && {
          platformDetails: input.platformDetails,
        }),
      }),
    };
  }
}
