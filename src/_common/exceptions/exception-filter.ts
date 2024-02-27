import { HttpException, Catch, ArgumentsHost } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { DatabaseError } from 'sequelize';
import { BaseHttpException } from './base-http-exception';
import { MessageSource } from './errors';

interface IGqlErrorResponse {
  code: number;
  success: boolean;
  message: string;
}

// Catch any error type
@Catch()
export class HttpExceptionFilter implements GqlExceptionFilter {
  private response = {
    code: 500,
    success: false,
    message: 'Something went wrong!',
  };

  catch(exception: unknown, host: GqlArgumentsHost): IGqlErrorResponse {
    if (exception instanceof HttpException) {
      const gqlHost = GqlArgumentsHost.create(host);
      const currentGqlCtx = gqlHost.getContext();

      let myException = exception as BaseHttpException;

      let params = myException.getParams;

      const messageKey = exception.getResponse().toString();

      let localizedMessage = new MessageSource().getMessage(
        messageKey,
        currentGqlCtx.lang,
        params,
      );

      if (!localizedMessage)
        localizedMessage = exception.getResponse().toString();

      this.response.code = exception.getStatus();
      this.response.message = localizedMessage;

      return this.response;
    }

    if (exception instanceof DatabaseError) {
      this.response.code = 500;
      this.response.message = exception.message;
      return this.response;
    }

    if (exception instanceof RangeError) {
      this.response.code = 413;
      this.response.message = (exception as any).message;
      return this.response;
    }

    if (exception instanceof Error) {
      if (exception.message.includes('path must be absolute')) {
        const httpCtx = host.switchToHttp();
        const response = httpCtx.getResponse();
        return response.end('File does not exist');
      }
      this.response.code = 500;
      this.response.message = 'Something went wrong!';
      return this.response;
    }

    this.response.code = 500;
    this.response.message = 'Something went wrong!';
    return this.response;
  }
}
