import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTweetInput } from '../dto/create-tweet.input';
import { UpdateTweetInput } from '../dto/update-tweet.input';
import { Tweet } from '../entities/tweet.entity';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/models/user.model';
import { PubSub } from 'graphql-subscriptions';
import { Follow } from 'src/follow/entities/follow.entity';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/buildRepository.interface';

const pubsub = new PubSub();

@Injectable()
export class TweetService {
  constructor(
    @Inject(Repositories.TweetRepository)
    private tweetsModel: IRepository<Tweet>,
    @Inject(Repositories.FollowsRepository)
    private followsModel: IRepository<Follow>,
  ) {}

  //   async create(createTweetInput: CreateTweetInput, context) {
  //     const tweet = await this.tweetsModel.create({
  //       id: uuid(),
  //       ...createTweetInput,
  //       userId: context.req.user.id,
  //     });
  //     await pubsub.publish('TWEET_CREATED', {
  //       tweetCreated: tweet,
  //     });
  //     return tweet;
  //   }

  //   async tweetCreated() {
  //     return pubsub.asyncIterator('TWEET_CREATED');
  //   }

  //   async findAll(page: number, limit: number) {
  //     let data = await Tweet.paginate(page, limit);
  //     const tweets = data.items;

  //     // shuffle returned data
  //     for (let i = tweets.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [tweets[i], tweets[j]] = [tweets[j], tweets[i]];
  //     }

  //     data.items = tweets;
  //     return data;
  // //   }

  //   async findTweetsBySpecificUser(userId: string) {
  //     const tweets = await this.tweetsModel.findAll({
  //       where: { userId },
  //     });
  //     return tweets;
  //   }

  //   async findOne(id: string) {
  //     const tweet = await this.tweetsModel.findByPk(id, {
  //       include: User,
  //     });
  //     if (!tweet) {
  //       throw new NotFoundException('Tweet not found');
  //     }
  //     return tweet;
  //   }

  //   async update(updateTweetInput: UpdateTweetInput, id: string) {
  //     await this.tweetsModel.update(updateTweetInput, {
  //       where: { id },
  //       returning: true,
  //     });
  //     return 'Updated';
  //   }

  //   async remove(id: string) {
  //     if (await this.tweetsModel.destroy({ where: { id } })) {
  //       return 'Tweet is Deleted';
  //     }
  //     throw new NotFoundException('This tweet not found');
  //   }
}
