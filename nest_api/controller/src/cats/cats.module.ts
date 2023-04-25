/*
 * @Author: fg
 * @Date: 2023-04-24 16:16:00
 * @LastEditors: fg
 * @LastEditTime: 2023-04-25 16:22:26
 * @Description: cats module
 */

import { Module, NestModule, RequestMethod, MiddlewareConsumer } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { LoggerMiddleware } from "./logger.middleware"
import { CatsService } from "./cats.service"

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: 'cats', method: RequestMethod.GET })
  }
}