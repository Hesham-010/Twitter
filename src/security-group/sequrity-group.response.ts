import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { SecurityGroup } from './models/security-group.model';
import { PermissionGroup } from './permission.type';

export const GqlSecurityGroupReponse = generateGqlResponseType(SecurityGroup);
export const GqlSecurityGroupsArrayResponse = generateGqlResponseType(
  Array(SecurityGroup),
  true,
);
export const GqlPermissionsGroupsArrayResponse = generateGqlResponseType(
  Array(PermissionGroup),
  true,
);
