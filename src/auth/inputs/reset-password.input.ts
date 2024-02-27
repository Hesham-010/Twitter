import { Field, InputType } from '@nestjs/graphql';
import {
  IsMobilePhone,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';

@InputType()
export class ResetPasswordByPhoneInput {
  @Field()
  @IsMobilePhone()
  @IsMobilePhone(null, null, {
    message: ErrorCodeEnum[ErrorCodeEnum.INVALID_PHONE_NUMBER],
  })
  phone: string;

  @Field()
  @IsNotEmpty()
  code: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  newPassword: string;
}
