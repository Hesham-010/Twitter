import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { IContext } from '../graphql/context.interface';
import { BaseHttpException } from '../exceptions/base-http-exception';
import { ErrorCodeEnum } from '../exceptions/error-code.enum';

export class ValidUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlArgumentsHost.create(context).getContext();
    const { currentUser } = ctx as IContext;

    if (!currentUser) throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);
    if (currentUser.isBlocked)
      throw new BaseHttpException(ErrorCodeEnum.BLOCKED_USER);
    if (!currentUser.notVerifiedPhone)
      throw new BaseHttpException(ErrorCodeEnum.USER_PHONE_NOT_VERIFIED_YET);

    return true;
  }
}
