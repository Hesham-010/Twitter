import { Resolver, Query, Args, Subscription, Mutation } from '@nestjs/graphql';
import { TweetService } from 'src/tweets/services/tweets.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { CreateTweetInput } from '../dto/create-tweet.input';
import { Follow } from 'src/follow/entities/follow.entity';
import { GqlTweetResponse, GqlTweetsResponse } from '../tweet.response';
import { CurrentUser } from 'src/_common/decorators/current_user.decorator';
import { User } from 'src/user/models/user.model';
import { Paginate } from 'src/user/dto/pagination.input';

@Resolver()
export class TimelineResolver {
  constructor(private readonly tweetService: TweetService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => GqlTweetResponse)
  async createTweet(
    @CurrentUser() user: User,
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
  ) {
    return await this.tweetService.create(createTweetInput, user);
  }

  @UseGuards(AuthGuard)
  @Query(() => GqlTweetsResponse)
  async getTimeLine(@Args() paginate: Paginate) {
    return await this.tweetService.findAll(paginate.paginate);
  }

  @Subscription(() => GqlTweetResponse, {
    filter: async (payload, variables, context) => {
      const isFollowing = await Follow.findOne({
        where: {
          followerId: context.user.id,
          followingId: payload.tweetCreated.userId,
        },
      });
      if (isFollowing) {
        return true;
      } else {
        return false;
      }
    },
  })
  tweetCreated() {
    return this.tweetService.tweetCreated();
  }
}
