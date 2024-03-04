import { Module } from '@nestjs/common';
import { TweetService } from './services/tweets.service';
import { TweetResolver } from './resolvers/tweets.resolver';
import { TimelineResolver } from './resolvers/timeline.resolver';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [UploadModule],
  providers: [TweetResolver, TweetService, TimelineResolver],
})
export class TweetModule {}
