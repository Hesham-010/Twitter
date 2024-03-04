import { Module } from '@nestjs/common';
import { FollowService } from './services/follow.service';
import { FollowResolver } from './resolvers/follow.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Follow } from './models/follow.model';

@Module({
  imports: [],
  providers: [FollowResolver, FollowService],
})
export class FollowModule {}
