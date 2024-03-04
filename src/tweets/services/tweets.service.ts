import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTweetInput } from '../dto/create-tweet.input';
import { UpdateTweetInput } from '../dto/update-tweet.input';
import { Tweet } from '../models/tweet.model';
import { User } from 'src/user/models/user.model';
import { PubSub } from 'graphql-subscriptions';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { IRepository } from 'src/_common/database/buildRepository.interface';
// import { UploadService } from 'src/_common/upload/services/upload.service';
// import { FileUseCases } from 'src/_common/upload/file-useCase.enum';
// import { File } from 'src/_common/upload/models/file.model';
import { PaginationInput } from 'src/user/dto/pagination.input';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';

const pubsub = new PubSub();

@Injectable()
export class TweetService {
  constructor(
    @Inject(Repositories.TweetRepository)
    private tweetRepo: IRepository<Tweet>,
    // private readonly uploadService: UploadService,
  ) {}

  // async create(createTweetInput: CreateTweetInput, user: User) {
  //   let file: File;
  //   let tweetFile = null;
  //   if (createTweetInput.filePath) {
  //     file = await this.uploadService.createFile(
  //       createTweetInput.filePath,
  //       FileUseCases.TWEET_FILE,
  //     );
  //     tweetFile = file.id;
  //   }

  //   const tweet = await this.tweetRepo.createOne({
  //     content: createTweetInput.content,
  //     tweetFile,
  //     userId: user.id,
  //   });

  //   await pubsub.publish('TWEET_CREATED', {
  //     tweetCreated: tweet,
  //   });

  //   return tweet;
  // }

  async tweetCreated() {
    return pubsub.asyncIterator('TWEET_CREATED');
  }

  async findAll(paginate: PaginationInput) {
    let data = await this.tweetRepo.findPaginated(
      {},
      '-createdAt',
      paginate.page,
      paginate.limit,
    );
    const tweets = data.items;

    // shuffle returned data
    for (let i = tweets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tweets[i], tweets[j]] = [tweets[j], tweets[i]];
    }

    data.items = tweets;
    return data;
  }

  async findTweetsBySpecificUser(userId: string) {
    const tweets = await this.tweetRepo.findAll({
      where: { userId },
    });
    return tweets;
  }

  async findOne(id: string) {
    const tweet = await this.tweetRepo.findOne({ id }, [User]);
    if (!tweet) {
      throw new BaseHttpException(ErrorCodeEnum.TWEET_DOES_NOT_EXIST);
    }
    return tweet;
  }

  async update(updateTweetInput: UpdateTweetInput, id: string) {
    await this.tweetRepo.updateAll({ id }, updateTweetInput);
    return 'Updated';
  }

  async remove(id: string) {
    if (await this.tweetRepo.deleteAll({ id })) {
      return true;
    }
    throw new BaseHttpException(ErrorCodeEnum.TWEET_DOES_NOT_EXIST);
  }
}
