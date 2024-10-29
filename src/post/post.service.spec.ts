import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { Post, PostCategory } from './entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostService', () => {
  let service: PostService;
  let repo: Repository<Post>;

  const mockPostRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'This is a test post',
    user: { id: 'userId', username: 'testuser' },
    category: 'Test',
    updated_at: new Date(),
    comments: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repo = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        content: 'Content here',
        category: PostCategory.Others,
      };
      mockPostRepository.create.mockReturnValue(mockPost);
      mockPostRepository.save.mockResolvedValue(mockPost);

      const result = await service.create(createPostDto, 'userId');
      expect(result).toEqual(mockPost);
      expect(mockPostRepository.create).toHaveBeenCalledWith({
        ...createPostDto,
        user: { id: 'userId' },
      });
      expect(mockPostRepository.save).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = { title: 'Updated Title' };
      mockPostRepository.update.mockResolvedValue({});
      mockPostRepository.findOne.mockResolvedValue({
        ...mockPost,
        ...updatePostDto,
      });

      const result = await service.update('1', updatePostDto);
      expect(result).toEqual({ ...mockPost, ...updatePostDto });
      expect(mockPostRepository.update).toHaveBeenCalledWith(
        '1',
        updatePostDto,
      );
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      const result = await service.findOne('1');
      expect(result).toEqual(mockPost);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['user', 'comments', 'comments.user'],
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      mockPostRepository.find.mockResolvedValue([mockPost]);
      const result = await service.findAll();
      expect(result).toEqual([mockPost]);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      await service.delete('1');
      expect(mockPostRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('getPostFromUserId', () => {
    it('should return posts from a user', async () => {
      mockPostRepository.find.mockResolvedValue([mockPost]);
      const result = await service.getPostFromUserId('userId');
      expect(result).toEqual([mockPost]);
      expect(mockPostRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'userId' } },
      });
    });
  });
});
