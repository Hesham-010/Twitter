import { Module } from '@nestjs/common';
import { FollowService } from './services/follow.service';
import { FollowResolver } from './resolvers/follow.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Follow } from './entities/follow.entity';

@Module({
  imports: [],
  providers: [FollowResolver, FollowService],
})
export class FollowModule {}
