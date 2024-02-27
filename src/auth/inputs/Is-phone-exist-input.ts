import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsMobilePhone } from 'class-validator';
import { ErrorCodeEnum } from '../../_common/exceptions/error-code.enum';
import { UserRole } from 'src/user/user.enums';

@InputType()
export class IsPhoneExistInput {
  @IsMobilePhone(null, null, {
    message: ErrorCodeEnum[ErrorCodeEnum.INVALID_PHONE_NUMBER],
  })
  @IsNotEmpty()
  @Field()
  phone: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @Field()
  userRole: UserRole;
}
