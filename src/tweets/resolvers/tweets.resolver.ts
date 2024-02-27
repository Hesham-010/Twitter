import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TweetService } from '../services/tweets.service';
import { CreateTweetInput } from '../dto/create-tweet.input';
import { UpdateTweetInput } from '../dto/update-tweet.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { Tweet } from '../entities/tweet.entity';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from 'src/_common/decorators/current_user.decorator';
import { User } from 'src/user/models/user.model';
import { GqlTweetResponse, GqlTweetsResponse } from '../tweet.response';
import {
  GqlBooleanResponse,
  GqlStringResponse,
} from 'src/_common/graphql/graphql-response.type';
import { IDataLoaders } from 'src/_common/dataLoader/dataLoader.interface';

@Resolver(() => Tweet)
export class TweetResolver {
  constructor(private readonly tweetService: TweetService) {}

  @UseGuards(AuthGuard)
  @Query(() => GqlTweetResponse)
  findOneTweet(@Args('id') id: string) {
    return this.tweetService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Query(() => GqlTweetsResponse)
  findTweetsBySpecificUser(@Args('userId') userId: string) {
    return this.tweetService.findTweetsBySpecificUser(userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => GqlStringResponse)
  updateTweet(
    @Args('id') id: string,
    @Args('updateTweetInput')
    updateTweetInput: UpdateTweetInput,
  ) {
    return this.tweetService.update(updateTweetInput, id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => GqlBooleanResponse)
  removeTweet(@Args('id') id: string) {
    return this.tweetService.remove(id);
  }

  ////////////////////////////// Data Loader//////////////////////////////
  @ResolveField(() => User)
  user(
    @Parent() tweet,
    @Context('loaders') loaders: IDataLoaders,
  ): Promise<User> {
    return loaders.userLoader.load(tweet.userId);
  }
}
