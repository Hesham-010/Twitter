import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class PermissionGroup {
  @IsString()
  @Field()
  groupName: string;

  @Field(() => [String])
  permissions: string[];
}
