import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async loginOrCreate(@Body() createUserDto: CreateUserDto): Promise<LoginDto> {
    return this.userService.loginOrCreate(createUserDto);
  }
}
