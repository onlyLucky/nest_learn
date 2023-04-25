/*
 * @Author: fg
 * @Date: 2023-04-25 17:25:11
 * @LastEditors: fg
 * @LastEditTime: 2023-04-25 17:25:18
 * @Description: content
 */

import { HttpException, HttpStatus } from "@nestjs/common"

export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN)
  }
}