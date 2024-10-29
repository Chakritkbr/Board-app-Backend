import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ReadPostDto } from './dto/read-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostCategory } from './entities/post.entity';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  const mockPostService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getPostFromUserId: jest.fn(),
    mapToReadPostDto: jest.fn(),
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
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        content: 'Content here',
        category: PostCategory.Others, // เปลี่ยนให้ใช้ enum ที่ถูกต้อง
      };
      const userId = 'userId';
      const expectedPost = { ...mockPost, ...createPostDto };
      mockPostService.create.mockResolvedValue(expectedPost);
      mockPostService.mapToReadPostDto.mockReturnValue(expectedPost);

      const result = await controller.create(createPostDto, {
        user: { userId },
      });
      expect(result).toEqual(expectedPost);
      expect(mockPostService.create).toHaveBeenCalledWith(
        createPostDto,
        userId,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const expectedPosts = [mockPost];
      mockPostService.findAll.mockResolvedValue(expectedPosts);
      const result = await controller.findAll();
      expect(result).toEqual(expectedPosts);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if post does not exist', async () => {
      mockPostService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = { title: 'Updated Title' };
      const userId = 'userId';
      mockPostService.findOne.mockResolvedValue(mockPost);
      mockPostService.update.mockResolvedValue({
        ...mockPost,
        ...updatePostDto,
      });
      mockPostService.mapToReadPostDto.mockReturnValue(mockPost);

      const result = await controller.update('1', updatePostDto, {
        user: { userId },
      });
      expect(result).toEqual(mockPost);
      expect(mockPostService.update).toHaveBeenCalledWith('1', updatePostDto);
    });

    it('should throw ForbiddenException if user does not own the post', async () => {
      const updatePostDto: UpdatePostDto = { title: 'Updated Title' };
      mockPostService.findOne.mockResolvedValue({
        ...mockPost,
        user: { id: 'differentUserId' },
      });

      await expect(
        controller.update('1', updatePostDto, { user: { userId: 'userId' } }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const userId = 'userId';
      mockPostService.findOne.mockResolvedValue(mockPost);
      mockPostService.delete.mockResolvedValue(undefined);

      const result = await controller.delete('1', { user: { userId } });
      expect(result).toEqual({ message: 'Post deleted successfully' });
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPostService.findOne.mockResolvedValue(null);
      await expect(
        controller.delete('2', { user: { userId: 'userId' } }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the post', async () => {
      mockPostService.findOne.mockResolvedValue({
        ...mockPost,
        user: { id: 'differentUserId' },
      });
      await expect(
        controller.delete('1', { user: { userId: 'userId' } }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getPostFromUserId', () => {
    it('should return posts from a user', async () => {
      const expectedPosts = [mockPost];
      mockPostService.getPostFromUserId.mockResolvedValue(expectedPosts);
      const result = await controller.getPostFromUserId('userId', {
        user: { userId: 'userId' },
      });
      expect(result).toEqual(expectedPosts);
    });
  });
});
