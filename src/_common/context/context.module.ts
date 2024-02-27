import { Global, Module } from '@nestjs/common';
import { ContextService } from './contex.service';
import { IContextServiceToken } from './context.interface';
import { GqlConfigService } from '../graphql/graphql.provider';

@Global()
@Module({
  providers: [{ provide: IContextServiceToken, useClass: ContextService }],
  exports: [{ provide: IContextServiceToken, useClass: ContextService }],
})
export class ContextModule {}
