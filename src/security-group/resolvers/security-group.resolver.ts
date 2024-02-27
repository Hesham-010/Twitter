import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SecurityGroupService } from '../services/security-group.service';
import {
  GqlPermissionsGroupsArrayResponse,
  GqlSecurityGroupsArrayResponse,
  GqlSecurityGroupReponse,
} from '../sequrity-group.response';
import { SecurityGroup } from '../models/security-group.model';
import { AuthGuard } from 'src/_common/guards/auth.guard';
import { SecurityGroupInput } from '../inputs/securityGroup.input';
import {
  GqlBooleanResponse,
  GqlStringArrayResponse,
} from 'src/_common/graphql/graphql-response.type';
import {
  getGroupedPermissions,
  getAllPermissions,
  SecurityGroupPermissions,
} from '../security-group-permissions';
import { CreateSecurityGroupInput } from '../inputs/create-securityGroup.input';
import { UpdateSecurityGroupInput } from '../inputs/update-securityGroup.input';
import { AssignSecurityGroupToUsers } from '../inputs/assign-securityGroup.input';
import { DeleteSecurityGroupInput } from '../inputs/delete-securityGroup.input';
import { HasPermissions } from 'src/_common/decorators/permission.decorator';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';

@UseGuards(AuthGuard)
@Resolver(() => SecurityGroup)
export class SecurityGroupResolver {
  constructor(private readonly securityGroupService: SecurityGroupService) {}

  @HasPermissions(SecurityGroupPermissions.READ_SECURITY_GROUPS)
  @Query(() => GqlSecurityGroupsArrayResponse, { name: 'getAllGroups' })
  async securityGroups() {
    return this.securityGroupService.securityGroups();
  }

  @HasPermissions(SecurityGroupPermissions.READ_SECURITY_GROUPS)
  @Query(() => GqlSecurityGroupReponse, { name: 'getOneSecurityGroup' })
  async securityGroup(@Args() Input: SecurityGroupInput) {
    return this.securityGroupService.securityGroup(Input);
  }

  @HasPermissions(SecurityGroupPermissions.READ_SECURITY_GROUPS)
  @Query(() => GqlPermissionsGroupsArrayResponse)
  getGroupedPermissions() {
    const permissions = getGroupedPermissions();
    return permissions;
  }

  @HasPermissions(SecurityGroupPermissions.READ_SECURITY_GROUPS)
  @Query(() => GqlStringArrayResponse)
  allPermissions() {
    const permissions = getAllPermissions();
    return permissions;
  }

  @HasPermissions(SecurityGroupPermissions.CREATE_SECURITY_GROUPS)
  @Mutation(() => GqlSecurityGroupReponse)
  createSecurityGroup(@Args('input') input: CreateSecurityGroupInput) {
    return this.securityGroupService.createSecurityGroup(input);
  }

  @HasPermissions(SecurityGroupPermissions.UPDATE_SECURITY_GROUPS)
  @Mutation(() => GqlSecurityGroupReponse)
  updateSecurityGroup(@Args('input') input: UpdateSecurityGroupInput) {
    return this.securityGroupService.updateSecurityGroup(input);
  }

  @HasPermissions(SecurityGroupPermissions.ASSIGN_SECURITY_GROUPS_TO_USERS)
  @Mutation(() => GqlSecurityGroupReponse)
  assignSecurityGroupToUsers(@Args('input') input: AssignSecurityGroupToUsers) {
    return this.securityGroupService.assignSecurityGroup(input);
  }

  @HasPermissions(SecurityGroupPermissions.UN_ASSIGN_SECURITY_GROUPS_TO_USERS)
  @Mutation(() => GqlBooleanResponse)
  unAssignSecurityGroupToUsers(
    @Args('input') input: AssignSecurityGroupToUsers,
  ) {
    return this.securityGroupService.unAssignSecurityGroup(input);
  }

  @HasPermissions(SecurityGroupPermissions.DELETE_SECURITY_GROUPS)
  @Mutation((returns) => GqlBooleanResponse)
  async deleteSecurityGroup(@Args() input: DeleteSecurityGroupInput) {
    return await this.securityGroupService.deleteSecurityGroup(input);
  }

  @ResolveField((type) => Timestamp)
  createdAt(@Parent() securityGroup) {
    return new Date(securityGroup.createdAt).valueOf();
  }

  @ResolveField((type) => Timestamp)
  updatedAt(@Parent() securityGroup) {
    return new Date(securityGroup.updatedAt).valueOf();
  }
}
