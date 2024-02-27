import { Inject, Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';
import { Request } from 'express';
import { ApolloDriverConfig } from '@nestjs/apollo';
import {
  IContextService,
  IContextServiceToken,
} from '../context/context.interface';
import { DataLoaderService } from '../dataLoader/dataLoader.service';
import { IDataLoaderService } from '../dataLoader/dataLoader.interface';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    @Inject(IContextServiceToken)
    private readonly contextService: IContextService,
    @Inject(DataLoaderService)
    private readonly dataLoaderService: IDataLoaderService,
  ) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      playground: true,
      introspection: true,
      autoSchemaFile: true,
      cache: 'bounded',
      persistedQueries: false,
      csrfPrevention: true,
      context: async ({ req }) => {
        // Auth for subscription connections
        let { user, sessionId } =
          await this.contextService.getUserAndSessionIdFromReq(req);

        // Get lang and country (if exist)
        let locale = this.contextService.getLocale(<Request>req);

        return {
          req,
          currentUser: user,
          sessionId: sessionId,
          lang: locale.lang,
          country: locale.country,
          timezone: this.contextService.getTimezone(
            req ? req.headers.timezone : undefined,
          ),
          loaders: this.dataLoaderService.createLoader(),
        };
      },

      subscriptions: {
        'graphql-ws': {
          onConnect: async (context) => {
            const { connectionParams, extra } = context;
            if (connectionParams) {
              const req = { headers: connectionParams };
              let { user } = this.contextService.getUserAndSessionIdFromReq(
                <Request>req,
              );
              (extra as any).currentUser = user;
            }
          },
        },
        'subscriptions-transport-ws': {
          onConnect: async (connectionParams) => {
            if (connectionParams) {
              const req = { headers: connectionParams };
              let { user } = this.contextService.getUserAndSessionIdFromReq(
                <Request>req,
              );
              return {
                currentUser: user,
              };
            }
          },
          onDisconnect() {},
        },
      },
    };
  }
}
