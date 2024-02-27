import { Module } from '@nestjs/common';
import { TweetService } from './services/tweets.service';
import { TweetResolver } from './resolvers/tweets.resolver';
import { TimelineResolver } from './resolvers/timeline.resolver';

@Module({
  imports: [],
  providers: [TweetResolver, TweetService, TimelineResolver],
})
export class TweetModule {}
