/*
 * @Author: fg
 * @Date: 2023-04-21 14:49:52
 * @LastEditors: fg
 * @LastEditTime: 2023-04-30 21:52:21
 * @Description: 控制器: 负责处理传入的请求和向客户端返回响应。
 */


/* 
@Controller() 装饰器定义一个基本的控制器
*/
import { Controller, Get, Req, Post, Body, HttpCode, Param, Put, Delete, Inject, HttpException, HttpStatus, UseFilters, ParseIntPipe } from "@nestjs/common";
// 获取express中的 Request类型的数据
import { Request } from "express";
import { CreateCatDto } from "./dto/create-cats.dto";
import { CatsService } from "./cats.service";
import { LoggerMiddleware } from "./logger.middleware";
import { Cat } from "./interfaces/cat.interface"
import { ForbiddenException } from "./forbidden.exception"
import { HttpExceptionFilter } from "./http-exception.filter"
import { AllExceptionsFilter } from "./any-exception.filter"


/* 路由 */
// 路由路径前缀设置为cats /cats
@Controller('cats')
export class CatsController {
  constructor(
    private readonly catsService: CatsService
  ) { }
  /* 
  @Get() HTTP 请求方法装饰器告诉 Nest 为 HTTP 请求的特定端点创建处理程序
  Nest 会将 GET /cats 请求映射到此处理程序
  @Get('profile') 组合会为 GET /cats/profile 请求生成路由映射
  */
  @Get()
  @UseFilters(new AllExceptionsFilter)
  async findAll(@Req() request: Request) {
    // return 'This action returns all cats'
    /* throw new HttpException({s
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message'
    }, HttpStatus.FORBIDDEN) */
    throw new ForbiddenException();
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
    return 'success'
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return `This action returns a #${id} cat`
  }

  @Put(':id')
  update(@Param('id') id: string) {
    return `This action updates a #${id} cat`
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action remove a #${id} cat`
  }

}

// 要使用 CLI 创建控制器，只需执行 $ nest g controller cats

