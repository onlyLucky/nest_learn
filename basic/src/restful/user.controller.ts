import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Request, Query, Headers, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from "./dto/update-user.dto"

@Controller({
  path: 'user',
  version: "1"
})
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body('name') createUserDto: CreateUserDto, @Request() req) {
    console.log(createUserDto, req)
    return this.userService.create(createUserDto);
  }

  @Get()
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
