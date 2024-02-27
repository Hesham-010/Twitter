import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class AssignSecurityGroupToUsers {
  @IsNotEmpty()
  @IsUUID('4')
  @IsString()
  @Field()
  securityGroupId: string;

  @IsNotEmpty()
  @IsUUID('4', { each: true })
  @Field(() => [String])
  userIds: string[];
}
