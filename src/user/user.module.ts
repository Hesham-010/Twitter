import { Global, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/user.resolver';
import { HelperModule } from 'src/helper/helper.module';
import { UserVerificationCodeService } from './services/verification-code.service';
import { UserTransformer } from './userTransformer.ts/user.transformer';
import { UserDataLoaderService } from './userDataLoader.service';

@Global()
@Module({
  imports: [HelperModule],
  providers: [
    UsersResolver,
    UsersService,
    UserVerificationCodeService,
    UserTransformer,
    UserDataLoaderService,
  ],
  exports: [
    UsersService,
    UserVerificationCodeService,
    UserTransformer,
    UserDataLoaderService,
  ],
})
export class UserModule {}
