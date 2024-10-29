import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async loginOrCreate(createUserDto: CreateUserDto): Promise<LoginDto> {
    let user = await this.userRepo.findOne({
      where: { username: createUserDto.username },
    });

    if (!user) {
      user = this.userRepo.create(createUserDto);
      await this.userRepo.save(user);
    }

    const token = this.jwtService.sign({
      userId: user.id,
      username: user.username,
    });

    return { user, token };
  }
  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: { username } });
  }
}
