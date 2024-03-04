import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateTweetInput {
  @Field()
  @IsOptional()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  filePath: string;
}
