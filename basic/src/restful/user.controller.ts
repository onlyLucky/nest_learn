import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Request, Query, Headers, HttpCode, Req, Res, Session, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from "./dto/update-user.dto"
import * as svgCaptcha from 'svg-captcha';
import session from 'express-session';

@Controller({
  path: 'user',
  version: "1"
})
export class UserController {
  constructor(
    @Inject('RestCode') private readonly userService: UserService,
    @Inject('JD') private readonly shopList: string[],
    @Inject('Test') private readonly Test: any,
    @Inject('sync') private readonly Sync: any
  ) { }

  // session code 
  @Get('code')
  createCode(@Session() session) {
    // 不懂res req 为什么不能用
    const captcha = svgCaptcha.create({
      size: 4,//字体
      fontSize: 50,//生成字体大小
      width: 100,//宽度
      height: 34,//高度
      background: "#cc9966"//背景颜色
    })
    session.code = captcha.text as string // 缓存session 验证码
    return captcha.data
  }

  @Post("create")
  handleCode(@Session() session, @Body() body) {
    console.log(session.code, body)
    let res = {
      code: 200,
      message: '',
    }
    if (session.code) {
      if (session.code.toLocaleLowerCase() === body?.code?.toLocaleLowerCase()) {
        res.message = '验证码正确'
      } else {
        res.message = '验证码错误'
      }
    } else {
      res.message = '未获取到验证码'
    }
    return res
  }

  @Post()
  create(@Body('name') createUserDto: CreateUserDto, @Request() req) {
    console.log(createUserDto, req)
    return this.userService.create(createUserDto);
  }

  /* @Get()
  @Version('2')
  findAll(@Request() req, @Query() query) {
    console.log(req.query, query)
    // return this.userService.findAll();
    return { code: 200 }
  }

  @Get(':id')
  @HttpCode(500)
  findOne(@Param('id') id: string, @Headers() header) {
    console.log(id, header)
    return { code: 500 };
  } */
  @Get()
  findAll() {
    // return this.shopList
    // return this.Test.getApp()
    return this.Sync
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
