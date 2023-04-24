/*
 * @Author: fg
 * @Date: 2023-04-24 16:16:00
 * @LastEditors: fg
 * @LastEditTime: 2023-04-24 16:26:44
 * @Description: cats module
 */

import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service"

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule { }