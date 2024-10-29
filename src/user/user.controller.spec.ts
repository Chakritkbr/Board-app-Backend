import { CreateUserDto } from './dto/create-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    loginOrCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginOrCreate', () => {
    it('should return a user and token', async () => {
      const username = 'testUser';
      const user = new User();
      user.id = '1';
      user.username = username;

      const loginDto: LoginDto = { user, token: 'mockToken' }; // Adjust structure according to your LoginDto
      mockUserService.loginOrCreate.mockResolvedValue(loginDto);

      const createUserDto: CreateUserDto = { username };

      const result = await userController.loginOrCreate(createUserDto);
      expect(result).toEqual(loginDto);
      expect(userService.loginOrCreate).toHaveBeenCalledWith(createUserDto);
    });
  });
});
