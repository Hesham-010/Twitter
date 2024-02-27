import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Gender, UserRole } from '../user.enums';

@InputType()
export class UsersFilter {
  @IsOptional()
  @Field()
  searchKey?: string;

  @IsOptional()
  @IsBoolean()
  @Field()
  isBlocked?: boolean;

  @IsOptional()
  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @IsOptional()
  @IsEnum(Gender)
  @Field(() => Gender, { nullable: true })
  gender?: Gender;
}

@ArgsType()
export class GetUsersInputFilter {
  filter?: UsersFilter;
}
