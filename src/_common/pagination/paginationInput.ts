import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class paginationUserInput {
  @Field({ nullable: true })
  name: string;

  @IsEmail()
  @Field({ nullable: true })
  email: string;

  @IsOptional()
  @Field({ nullable: true })
  role: string;
}
