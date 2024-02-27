import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidPermissions } from 'src/_common/custom_validator/valid_permission';

@InputType()
export class CreateSecurityGroupInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  groupName: string;

  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @ValidPermissions()
  @Field(() => [String])
  permissions: string[];
}
