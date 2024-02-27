import { Inject, Injectable } from '@nestjs/common';
import { Follow } from '../entities/follow.entity';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/buildRepository.interface';

@Injectable()
export class FollowService {
  constructor(
    @Inject(Repositories.FollowsRepository)
    private followRepo: IRepository<Follow>,
  ) {}

  //   async createFollowOrDelete(context, followingId) {
  //     const follow = await this.followModel.findOne({
  //       where: {
  //         followerId: context.req.user.id,
  //         followingId: followingId,
  //       },
  //     });
  //     if (!follow) {
  //       const newFollow = await this.followModel.create({
  //         id: uuid(),
  //         followerId: context.req.user.id,
  //         followingId: followingId,
  //       });
  //       return 'Follow Created';
  //     } else {
  //       await this.followModel.destroy({ where: { id: follow.id } });
  //       return 'Follow Removed';
  //     }
  //   }

  //   async findAll() {
  //     const follows = await this.followModel.findAll();
  //     return follows;
  //   }

  //   async findFollwers(followingId) {
  //     const followers = await this.followModel.findAll({
  //       where: { followingId },
  //     });
  //     return followers.map((follower) => follower.followerId);
  //   }

  //   async findFollwings(followerId) {
  //     const followers = await this.followModel.findAll({
  //       where: { followerId },
  //     });
  //     return followers.map((follower) => follower.followingId);
  //   }
}
