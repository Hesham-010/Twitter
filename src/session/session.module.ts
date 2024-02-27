import { Module } from '@nestjs/common';
import { SessionService } from './services/session.service';
import { SessionResolver } from './resolvers/session.resolver';

@Module({
  imports: [],
  providers: [SessionResolver, SessionService],
  exports: [SessionService],
})
export class SessionModule {}
