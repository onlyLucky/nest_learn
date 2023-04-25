/*
 * @Author: fg
 * @Date: 2023-04-25 15:05:05
 * @LastEditors: fg
 * @LastEditTime: 2023-04-25 15:10:53
 * @Description: logger 中间件
 */

import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log('Request ...')
    next();
  }
}