import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async loginOrCreate(createUserDto: CreateUserDto): Promise<LoginDto> {
    return this.userService.loginOrCreate(createUserDto);
  }

  async validateUser(username: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async generateToken(userId: string, username: string): Promise<string> {
    return this.jwtService.sign({ userId, username });
  }
}
