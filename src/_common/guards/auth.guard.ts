import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { config } from 'dotenv';
import { verify } from 'jsonwebtoken';
import { verifyAccessToken } from 'src/auth/createToken';
import { IContext } from '../graphql/context.interface';
import { BaseHttpException } from '../exceptions/base-http-exception';
import { ErrorCodeEnum } from '../exceptions/error-code.enum';
import {
  IContextService,
  IContextServiceToken,
} from '../context/context.interface';
config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(IContextServiceToken) private contextService: IContextService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const { currentUser } = ctx as IContext;

    if (!currentUser) throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);

    if (
      permissions &&
      permissions.length &&
      !this.contextService.hasPermission(permissions[0], currentUser)
    )
      throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);

    return true;
  }
}
