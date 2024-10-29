import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginOrCreate', () => {
    it('should return existing user if found', async () => {
      const username = 'testUser';
      const existingUser = new User();
      existingUser.id = '1';
      existingUser.username = username;

      mockUserRepo.findOne.mockResolvedValue(existingUser);

      const createUserDto: CreateUserDto = { username };

      const user = await service.loginOrCreate(createUserDto);
      expect(user).toEqual(existingUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
    });

    it('should create and return new user if not found', async () => {
      const username = 'newUser';
      mockUserRepo.findOne.mockResolvedValue(null);

      const newUser = new User();
      newUser.id = '2';
      newUser.username = username;
      const createUserDto: CreateUserDto = { username };

      mockUserRepo.create.mockReturnValue(newUser);
      mockUserRepo.save.mockResolvedValue(newUser);

      const user = await service.loginOrCreate(createUserDto);
      expect(user).toEqual(newUser);
      expect(userRepository.create).toHaveBeenCalledWith({ username });
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
    });
  });
});
