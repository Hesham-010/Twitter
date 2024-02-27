import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsMobilePhone,
  MinLength,
  MaxLength,
  IsString,
  IsEnum,
  IsISO31661Alpha2,
} from 'class-validator';
import { ErrorCodeEnum } from '../../_common/exceptions/error-code.enum';
import { DeviceEnum, UserRole } from 'src/user/user.enums';
import { JSONScalar } from 'src/_common/graphql/json.scalar';

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(30)
  @Field()
  lastName: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  bio?: string;

  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  email?: string;

  @IsMobilePhone(null, null, {
    message: ErrorCodeEnum[ErrorCodeEnum.INVALID_PHONE_NUMBER],
  })
  @IsNotEmpty()
  @Field()
  phone: string;

  @Field()
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  fcmToken?: string;

  @Field()
  @IsEnum(DeviceEnum)
  @IsNotEmpty()
  device: DeviceEnum;

  @Field()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsISO31661Alpha2()
  @IsNotEmpty()
  @Field()
  country: string;

  @IsOptional()
  @Field((type) => JSONScalar, { nullable: true })
  platformDetails?: object;
}
