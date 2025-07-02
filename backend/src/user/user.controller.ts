// user.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body) {
    return this.userService.create(body);
  }

  @Get()
  getAll() {
    return this.userService.getAll();
  }
}
