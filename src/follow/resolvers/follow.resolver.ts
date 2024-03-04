import { Resolver, Query, Mutation, Context, Args } from '@nestjs/graphql';
import { FollowService } from '../services/follow.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { Follow } from '../models/follow.model';
import { GqlStringResponse } from 'src/_common/graphql/graphql-response.type';
import { GqlFollowsResponse } from '../follow.response';
import { GqlUsersResponse } from 'src/user/user.response';

@UseGuards(AuthGuard)
@Resolver(() => Follow)
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => GqlStringResponse)
  createFollowOrDelete(
    @Context() context,
    @Args('followingId') followingId: string,
  ) {
    return this.followService.createFollowOrDelete(context, followingId);
  }

  @Query(() => GqlFollowsResponse)
  findAllFollows() {
    return this.followService.findAll();
  }

  @Query(() => GqlUsersResponse)
  findFollwers(@Args('followingId') followingId: string) {
    return this.followService.findFollwers(followingId);
  }

  @Query(() => GqlUsersResponse)
  findFollwings(@Args('followerId') followerId: string) {
    return this.followService.findFollwings(followerId);
  }
}
