// src/user/dto/login-response.dto.ts
import { User } from '../entities/user.entity';

export class LoginDto {
  user: User;
  token: string;
}
