/*
 * @Author: fg
 * @Date: 2023-04-24 14:56:00
 * @LastEditors: fg
 * @LastEditTime: 2023-04-24 15:08:50
 * @Description: cat server
 */

import { Injectable } from "@nestjs/common/decorators";
import { Cat } from "./interfaces/cat.interface";

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat)
  }
  findAll(): Cat[] {
    return this.cats
  }
}