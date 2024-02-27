import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { UploadScalar } from 'src/_common/upload/uploader.scalar';

@InputType()
export class CreateTweetInput {
  @Field()
  @IsOptional()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  filePath: string;
}
