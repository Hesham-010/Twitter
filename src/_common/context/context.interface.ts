import { Request } from 'express';
import { User } from 'src/user/models/user.model';
import { Lang } from 'src/user/user.enums';
import { Timezone } from '../graphql/graphql-response.type';

export const IContextServiceToken = 'IContextService';

export interface IContextService {
  getUserAndSessionIdFromReq(req: Request): any;

  getTimezone(timezone: string): Timezone;

  getLocale(req: Request): { lang: Lang; country: string };

  hasPermission(permission: string, user: User);
}
