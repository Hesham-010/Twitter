import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { User } from '../models/user.model';
import { GqlUserResponse, GqlUsersResponse } from '../user.response';
import { GetUsersInputFilter } from '../dto/getUser.input';
import { Paginate } from '../dto/pagination.input';
import { CurrentUser } from 'src/_common/decorators/current_user.decorator';
import { GetUserInput } from '../dto/getUserInput';
import { GqlBooleanResponse } from 'src/_common/graphql/graphql-response.type';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Query(() => GqlUsersResponse, { name: 'usersBoard' })
  getUsers(
    @Args() filter: GetUsersInputFilter,
    @Args() paginate: Paginate,
    @CurrentUser('id') CurrentUserId: string,
  ) {
    return this.usersService.allUsers(
      filter.filter,
      paginate.paginate,
      CurrentUserId,
    );
  }

  // @UseGuards(AuthGuard)
  @Query(() => GqlUserResponse, { name: 'userBoard' })
  getUser(@Args() input: GetUserInput) {
    return this.usersService.getUser(input);
  }

  @Mutation(() => GqlBooleanResponse)
  seedAdmin() {
    return this.usersService.seedAdmin();
  }
}
