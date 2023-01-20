/*
 * @Author: fg
 * @Date: 2023-01-19 10:19:14
 * @LastEditors: fg
 * @LastEditTime: 2023-01-20 11:54:12
 * @Description: content
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService3 {
  constructor() {
  }
  getApp() {
    return 'hello world'
  }
}