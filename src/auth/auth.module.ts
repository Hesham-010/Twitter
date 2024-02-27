import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthResolver } from './resolvers/auth.resolver';
import { SessionModule } from 'src/session/session.module';
import { UserModule } from 'src/user/user.module';
import { HelperModule } from 'src/helper/helper.module';
import { TwilioModule } from 'src/twilio/twilio.module';

@Module({
  imports: [SessionModule, UserModule, HelperModule, TwilioModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
