/*
 * @Author: fg
 * @Date: 2023-04-25 22:16:02
 * @LastEditors: fg
 * @LastEditTime: 2023-04-25 22:21:42
 * @Description: catch filter
 */

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamps: new Date().toISOString(),
      path: request.url,
    });
  }
}