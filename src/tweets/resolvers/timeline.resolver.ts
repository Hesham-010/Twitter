import {
  Resolver,
  Query,
  Args,
  Subscription,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { TweetService } from 'src/tweets/services/tweets.service';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { CreateTweetInput } from '../dto/create-tweet.input';
import { Follow } from 'src/follow/entities/follow.entity';

@Resolver()
export class TimelineResolver {
  constructor(private readonly tweetService: TweetService) {}

  // @UseGuards(AuthGuard)
  // @Mutation(() => Tweet)
  // async createTweet(
  //   @Context() context,
  //   @Args('createTweetInput') createTweetInput: CreateTweetInput,
  // ) {
  //   const tweet = await this.tweetService.create(createTweetInput, context);
  //   return tweet;
  // }

  // @UseGuards(AuthGuard)
  // @Query(() => TweetPaginationType)
  // async getTimeLine(@Args('page') page: number, @Args('limit') limit: number) {
  //   return await this.tweetService.findAll(page, limit);
  // }

  // @Subscription(() => Tweet, {
  //   filter: async (payload, variables, context) => {
  //     const isFollowing = await Follow.findOne({
  //       where: {
  //         followerId: context.user.id,
  //         followingId: payload.tweetCreated.userId,
  //       },
  //     });
  //     if (isFollowing) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   },
  // })
  // tweetCreated() {
  //   return this.tweetService.tweetCreated();
  // }
}
