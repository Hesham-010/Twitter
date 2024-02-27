import {
  Resolver,
  ResolveField,
  Parent,
  Context,
  Query,
  Args,
} from '@nestjs/graphql';
import { SessionService } from '../services/session.service';
import { Session } from '../models/session.model';
import { User } from 'src/user/models/user.model';
// import { IDataLoaders } from 'src/_common/dataloader/dataloader.interface';
import { GqlSessionsResponse } from '../session.response';
import { Paginate } from 'src/user/dto/pagination.input';
import { IDataLoaders } from 'src/_common/dataLoader/dataLoader.interface';

@Resolver(() => Session)
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query(() => GqlSessionsResponse)
  getAllSession(@Args() paginate: Paginate) {
    return this.sessionService.getAllSessions();
  }

  /*--------------------------Data Loaders------------------------ */
  @ResolveField(() => User)
  user(
    @Parent() sessison,
    @Context('loaders') loaders: IDataLoaders,
  ): Promise<User> {
    return loaders.userLoader.load(sessison.userId);
  }
}
