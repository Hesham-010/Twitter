import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@ArgsType()
export class GetUserInput {
  @IsNotEmpty()
  @IsUUID('4')
  @Field()
  userId: string;
}
