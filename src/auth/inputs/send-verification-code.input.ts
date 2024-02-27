import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMobilePhone, IsNotEmpty } from 'class-validator';
import { UserVerificationCodeUseCaseEnum } from 'src/user/user.enums';

@InputType()
export class SendVerificationCodeByPhone {
  @IsNotEmpty()
  @IsMobilePhone()
  @Field()
  phone: string;

  @IsNotEmpty()
  @IsEnum(UserVerificationCodeUseCaseEnum)
  @Field()
  useCase: UserVerificationCodeUseCaseEnum;
}
