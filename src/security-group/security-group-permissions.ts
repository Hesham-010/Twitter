import { PermissionGroup } from './permission.type';

export enum UserPermissions {
  READ_USERS = 'READ_USERS',
  UPDATE_USERS = 'UPDATE_USERS',
  CREATE_USERS = 'CREATE_USERS',
  DELETE_USERS = 'DELETE_USERS',
}

export enum SecurityGroupPermissions {
  READ_SECURITY_GROUPS = 'READ_SECURITY_GROUPS',
  UPDATE_SECURITY_GROUPS = 'UPDATE_SECURITY_GROUPS',
  CREATE_SECURITY_GROUPS = 'CREATE_SECURITY_GROUPS',
  DELETE_SECURITY_GROUPS = 'DELETE_SECURITY_GROUPS',
  ASSIGN_SECURITY_GROUPS_TO_USERS = 'ASSIGN_SECURITY_GROUPS_TO_USERS',
  UN_ASSIGN_SECURITY_GROUPS_TO_USERS = 'UN_ASSIGN_SECURITY_GROUPS_TO_USERS',
}

export enum NotificationPermissions {
  SEND_NOTIFICATIONS = 'SEND_NOTIFICATIONS',
}

export enum AppConfigurationPermissions {
  READ_APP_CONFIGURATION = 'READ_APP_CONFIGURATION',
  UPDATE_APP_CONFIGURATION = 'UPDATE_APP_CONFIGURATION',
  CREATE_APP_CONFIGURATION = 'CREATE_APP_CONFIGURATION',
}

export const permissions = {
  users: Object.keys(UserPermissions),
  securityGroups: Object.keys(SecurityGroupPermissions),
  notifications: Object.keys(NotificationPermissions),
  appConfigurations: Object.keys(AppConfigurationPermissions),
};

export function getGroupedPermissions() {
  let permissionGroups: PermissionGroup[] = [];
  let permissionGroup: PermissionGroup;
  for (let key in permissions) {
    permissionGroup = {
      groupName: key,
      permissions: permissions[key],
    };
    permissionGroups.push(permissionGroup);
  }
  return permissionGroups;
}

export function getAllPermissions(): string[] {
  console.log(Object.values(permissions));
  return Object.values(permissions).reduce((total, row) => {
    total.push(...row);
    return total;
  }, []);
}
