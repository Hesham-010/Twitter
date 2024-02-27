import { Field, ObjectType } from '@nestjs/graphql';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
import { DeviceEnum } from './user.enums';
import { JSONScalar } from 'src/_common/graphql/json.scalar';

@ObjectType()
export class LastLoginDetails {
  @Field(() => String, { nullable: true })
  lastLoginAt?: Timestamp | number | Date;

  @Field(() => String, { nullable: true })
  readableLastLoginAt?: Timestamp | number | Date;

  @Field({ nullable: true })
  lastLoginDevice?: DeviceEnum;

  @Field(() => JSONScalar, { nullable: true })
  platformDetails?: object;
}
