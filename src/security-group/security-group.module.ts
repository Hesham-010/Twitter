import { Module } from '@nestjs/common';
import { SecurityGroupResolver } from './resolvers/security-group.resolver';
import { SecurityGroupService } from './services/security-group.service';

@Module({
  providers: [SecurityGroupResolver, SecurityGroupService],
  exports: [SecurityGroupService],
})
export class SecurityGroupModule {}
