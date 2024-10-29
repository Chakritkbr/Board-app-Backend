import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ReadPostDto } from './dto/read-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // ใช้ AuthGuard
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ): Promise<ReadPostDto> {
    const userId = req.user['userId'];
    const post = await this.postService.create(createPostDto, userId);
    return this.postService.mapToReadPostDto(post);
  }

  @Get()
  async findAll(): Promise<ReadPostDto[]> {
    // เปลี่ยนจาก Post[] เป็น ReadPostDto[]
    const posts = await this.postService.findAll();
    return posts; // ส่งคืน ReadPostDto[]
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReadPostDto> {
    const post = await this.postService.findOne(id);
    return this.postService.mapToReadPostDto(post); // แปลงเป็น ReadPostDto ก่อนส่งกลับ
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // ใช้ AuthGuard
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ): Promise<ReadPostDto> {
    const userId = req.user['userId'];
    const post = await this.postService.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this post',
      );
    }

    const updatedPost = await this.postService.update(id, updatePostDto);
    return this.postService.mapToReadPostDto(updatedPost); // แปลงเป็น ReadPostDto ก่อนส่งกลับ
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // ใช้ AuthGuard
  async delete(@Param('id') id: string, @Req() req) {
    const userId = req.user['userId'];
    const post = await this.postService.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this post',
      );
    }

    await this.postService.delete(id);
    return { message: 'Post deleted successfully' };
  }

  @Get('blog/:userId') // เพิ่ม route ใหม่สำหรับดึงโพสต์จาก userId
  @UseGuards(AuthGuard('jwt')) // ใช้ AuthGuard
  async getPostFromUserId(
    @Param('userId') userId: string,
    @Req() req,
  ): Promise<ReadPostDto[]> {
    const currentUserId = req.user['userId']; // รับ userId จาก token

    // ตรวจสอบว่า userId ที่ส่งมาจากพารามิเตอร์ตรงกับ userId ใน token หรือไม่
    if (currentUserId !== userId) {
      throw new ForbiddenException(
        "You do not have permission to access this user's posts",
      );
    }

    const posts = await this.postService.getPostFromUserId(userId);
    return posts.map((post) => this.postService.mapToReadPostDto(post)); // แปลงทุกโพสต์เป็น ReadPostDto
  }
}
