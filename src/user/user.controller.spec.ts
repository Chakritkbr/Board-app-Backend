import { CreateUserDto } from './dto/create-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let usercontroller: UserController;
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

    usercontroller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginOrCreate', () => {
    it('should return a user', async () => {
      const username = 'testUser';
      const user = new User();

      user.id = '1';
      user.username = username;

      mockUserService.loginOrCreate.mockResolvedValue(user);

      const createUserDto: CreateUserDto = { username };

      const result = await usercontroller.loginOrCreate(createUserDto);
      expect(result).toEqual(user);
      expect(userService.loginOrCreate).toHaveBeenCalledWith(createUserDto);
    });
  });
});
