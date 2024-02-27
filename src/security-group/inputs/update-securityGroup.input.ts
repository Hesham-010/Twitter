import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateSecurityGroupInput } from './create-securityGroup.input';
import { IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ValidPermissions } from 'src/_common/custom_validator/valid_permission';

@InputType()
export abstract class UpdateSecurityGroupInput {
  @IsNotEmpty()
  @IsUUID('4')
  @Field()
  readonly securityGroupId: string;

  @IsOptional()
  @Field({ nullable: true })
  readonly groupName?: string;

  @IsOptional()
  @Field({ nullable: true })
  readonly description?: string;

  @IsOptional()
  @ValidPermissions()
  @Field((type) => [String], { nullable: 'itemsAndList' })
  readonly permissions?: string[];
}
