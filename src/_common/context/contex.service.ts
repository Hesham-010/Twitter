import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Repositories } from '../database/database-repository.enum';
import { IRepository } from '../database/buildRepository.interface';
import { User } from 'src/user/models/user.model';
import { Lang } from 'src/user/user.enums';
import { isISO31661Alpha2 } from 'class-validator';
import { IContextService } from './context.interface';
import { TokenPayload, verifyAccessToken } from 'src/auth/createToken';

@Injectable()
export class ContextService implements IContextService {
  constructor(
    @Inject(Repositories.UsersRepository) private userRepo: IRepository<User>,
  ) {}

  getAuthToken(req: Request): string {
    let auth;
    if (req.headers.authorization || req.headers.Authorization) {
      if (req.headers.authorization) {
        auth = req.headers.authorization;
      }
      if (req.headers.Authorization) {
        auth = req.headers.Authorization;
      }
      const token = auth.split(' ')[1];
      return token;
    }

    return null;
  }

  async getUserAndSessionIdFromReq(req: Request) {
    const token = this.getAuthToken(req);
    if (!token) return { user: null, sessionId: null };

    const decoded = <TokenPayload>verifyAccessToken(token);

    const user = await this.userRepo.findOne({ id: decoded.userId });
    return { user, sessionId: decoded.sessionId };
  }

  hasPermission(permission: string, user: User): boolean {
    if (!user || !user.securityGroup || !user.securityGroup.id) {
      return user.securityGroup.permissions.includes(permission);
    }
  }

  getLocale(req: Request): { lang: Lang; country: string } {
    if (!req) return { lang: Lang.EN, country: 'EG' };
    let local = <string>req.headers.lang || 'eg-en';
    let country = local.split('-')[0].toUpperCase();
    if (!country || !isISO31661Alpha2(country)) country = 'EG';
    let lang = local.split('-')[1] === 'ar' ? Lang.AR : Lang.EN;
    return { lang, country };
  }

  getTimezone(timezone = '+02:00') {
    if (timezone.search(/\-|\+/) < 0) timezone = '+02:00';
    const mathOperation = timezone.slice(0, 1);
    const value = timezone.replace(mathOperation, '');
    const hours = isNaN(Number(value.split(':')[0]))
      ? 2
      : Number(value.split(':')[0]);

    const minutes = isNaN(value as any)
      ? 0
      : isNaN(Number(value.split(':')[1]))
        ? 0
        : Number(value.split(':')[1]);
    return { minusSign: mathOperation === '-', hours, minutes };
  }
}
