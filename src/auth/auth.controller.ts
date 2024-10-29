import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-or-create')
  async loginOrCreate(@Body() createUserDto: CreateUserDto): Promise<LoginDto> {
    return this.authService.loginOrCreate(createUserDto);
  }
}
