import { Resolver, Query, Mutation, Context, Args } from '@nestjs/graphql';
import { FollowService } from '../services/follow.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { Follow } from '../entities/follow.entity';

@UseGuards(AuthGuard)
@Resolver(() => Follow)
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  //   @Mutation(() => String)
  //   createFollowOrDelete(
  //     @Context() context,
  //     @Args('followingId') followingId: string,
  //   ) {
  //     return this.followService.createFollowOrDelete(context, followingId);
  //   }

  //   @Query(() => [Follow])
  //   findAllFollows() {
  //     return this.followService.findAll();
  //   }

  //   @Query(() => [String])
  //   findFollwers(@Args('followingId') followingId: string) {
  //     return this.followService.findFollwers(followingId);
  //   }

  //   @Query(() => [String])
  //   findFollwings(@Args('followerId') followerId: string) {
  //     return this.followService.findFollwings(followerId);
  //   }
}
