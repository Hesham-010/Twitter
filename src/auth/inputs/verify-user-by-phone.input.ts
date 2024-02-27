import { Field, InputType } from '@nestjs/graphql';
import { IsMobilePhone, IsNotEmpty } from 'class-validator';

@InputType()
export class VerifyUserByPhone {
  @Field()
  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @Field()
  @IsNotEmpty()
  verificationCode: string;
}
