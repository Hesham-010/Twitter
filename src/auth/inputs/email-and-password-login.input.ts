import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { JSONScalar } from 'src/_common/graphql/json.scalar';
import { DeviceEnum } from 'src/user/user.enums';

@InputType()
export class EmailAndPasswordLoginInput {
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @IsOptional()
  @Field()
  fcmToken?: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(DeviceEnum)
  device: DeviceEnum;

  @IsOptional()
  @Field((type) => JSONScalar, { nullable: true })
  platformDetails?: object;
}

@InputType()
export class PhoneAndPasswordLoginInput {
  @IsMobilePhone()
  @IsNotEmpty()
  @Field()
  phone: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @IsOptional()
  @Field()
  fcmToken?: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(DeviceEnum)
  device: DeviceEnum;

  @IsOptional()
  @Field((type) => JSONScalar, { nullable: true })
  platformDetails?: object;
}
