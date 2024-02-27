import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@ArgsType()
export class SecurityGroupInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  securityGroupId: string;
}
