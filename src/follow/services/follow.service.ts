import { Inject, Injectable } from '@nestjs/common';
import { Follow } from '../models/follow.model';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/buildRepository.interface';
import { User } from 'src/user/models/user.model';

@Injectable()
export class FollowService {
  constructor(
    @Inject(Repositories.FollowsRepository)
    private followRepo: IRepository<Follow>,
    @Inject(Repositories.UsersRepository)
    private userRepo: IRepository<User>,
  ) {}

  async createFollowOrDelete(context, followingId) {
    const follow = await this.followRepo.findOne({
      where: {
        followerId: context.req.user.id,
        followingId: followingId,
      },
    });
    if (!follow) {
      const newFollow = await this.followRepo.createOne({
        followerId: context.req.user.id,
        followingId: followingId,
      });
      return 'Follow Created';
    } else {
      await this.followRepo.deleteAll({ id: follow.id });
      return 'Follow Removed';
    }
  }

  async findAll() {
    const follows = await this.followRepo.findAll();
    return follows;
  }

  async findFollwers(followingId) {
    const follows = await this.followRepo.findAll({ followingId });
    const followerIds = follows.map((follower) => follower.followerId);
    const followers = await this.userRepo.findAll({ id: followerIds });
    return followers;
  }

  async findFollwings(followerId) {
    const follows = await this.followRepo.findAll({ followerId });
    const followingIds = follows.map((follower) => follower.followingId);
    const followings = await this.userRepo.findAll({ id: followingIds });
    return followings;
  }
}
