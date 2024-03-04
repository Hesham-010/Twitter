import { CreateTweetInput } from './create-tweet.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTweetInput extends PartialType(CreateTweetInput) {}
