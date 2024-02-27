import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { TweetService } from '../services/tweets.service';
import { CreateTweetInput } from '../dto/create-tweet.input';
import { UpdateTweetInput } from '../dto/update-tweet.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { Tweet } from '../entities/tweet.entity';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

@Resolver(() => Tweet)
export class TweetResolver {
  constructor(private readonly tweetService: TweetService) {}

  //   @UseGuards(AuthGuard)
  //   @Mutation(() => Tweet)
  //   async createTweet(
  //     @Context() context,
  //     @Args('createTweetInput') createTweetInput: CreateTweetInput,
  //   ) {
  //     const tweet = await this.tweetService.create(createTweetInput, context);
  //     return tweet;
  //   }

  //   @UseGuards(AuthGuard)
  //   @Query(() => Tweet)
  //   findOneTweet(@Args('id') id: string) {
  //     return this.tweetService.findOne(id);
  //   }

  //   @UseGuards(AuthGuard)
  //   @Query(() => [Tweet])
  //   findTweetsBySpecificUser(@Args('userId') userId: string) {
  //     return this.tweetService.findTweetsBySpecificUser(userId);
  //   }

  //   @UseGuards(AuthGuard)
  //   @Mutation(() => String)
  //   updateTweet(
  //     @Args('id') id: string,
  //     @Args('updateTweetInput')
  //     updateTweetInput: UpdateTweetInput,
  //   ) {
  //     return this.tweetService.update(updateTweetInput, id);
  //   }

  //   @UseGuards(AuthGuard)
  //   @Mutation(() => String)
  //   removeTweet(@Args('id') id: string) {
  //     return this.tweetService.remove(id);
  //   }
}
