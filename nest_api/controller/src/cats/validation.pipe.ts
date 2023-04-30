/*
 * @Author: fg
 * @Date: 2023-04-30 22:14:18
 * @LastEditors: fg
 * @LastEditTime: 2023-04-30 22:19:01
 * @Description: 自定义管道
 */
import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}