import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TweetModule } from './tweets/tweets.module';
import { FollowModule } from './follow/follow.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';
import { GqlConfigService } from './_common/graphql/graphql.provider';
import { DatabaseModule } from './_common/database/database.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './_common/exceptions/exception-filter';
import { ContextModule } from './_common/context/context.module';
import { SecurityGroupModule } from './security-group/security-group.module';
import { Timestamp } from './_common/graphql/timestamp.scalar';
import { JSONScalar } from './_common/graphql/json.scalar';
import { UploaderModule } from './_common/uploader/uploader.module';
import { HelperModule } from './helper/helper.module';
import { GqlResponseInterceptor } from './_common/graphql/graphql-response.interceptor';
import { AuthModule } from './auth/auth.module';
import { TwilioModule } from './twilio/twilio.module';
import { DataLoaderModule } from './_common/dataLoader/dataLoader.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: 'public' }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
      imports: [ContextModule, DataLoaderModule],
    }),
    UserModule,
    TweetModule,
    FollowModule,
    // QueueModule,
    SessionModule,
    DatabaseModule,
    ContextModule,
    SecurityGroupModule,
    UploaderModule,
    HelperModule,
    AuthModule,
    TwilioModule,
  ],
  providers: [
    Timestamp,
    JSONScalar,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: GqlResponseInterceptor,
    },
  ],
})
export class AppModule {}