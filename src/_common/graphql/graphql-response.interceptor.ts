import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGqlSuccessResponse } from './graphql-response.type';

@Injectable()
export class GqlResponseInterceptor<T>
  implements NestInterceptor<T, IGqlSuccessResponse<T>>
{
  constructor() {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IGqlSuccessResponse<T>> {
    return next.handle().pipe(
      map((res) => {
        return {
          code: 200,
          success: true,
          message: 'Operation done successfully',
          data: res,
        };
      }),
    );
  }
}
