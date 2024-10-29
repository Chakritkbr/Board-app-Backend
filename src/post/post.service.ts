import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { ReadPostDto } from './dto/read-post.dto';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const post = this.postRepo.create({
      ...createPostDto,
      user: { id: userId }, // กำหนด userId สำหรับการเชื่อมโยงกับ user
    });
    return this.postRepo.save(post);
  }
  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postRepo.update(id, updatePostDto);
    return this.postRepo.findOne({ where: { id } });
  }

  async findOne(id: string): Promise<Post> {
    // เพิ่ม 'comments' ใน relations เพื่อดึงข้อมูลคอมเมนต์มาด้วย
    return this.postRepo.findOne({
      where: { id },
      relations: ['user', 'comments', 'comments.user'],
    });
  }

  async findAll(): Promise<ReadPostDto[]> {
    // เปลี่ยนจาก Post[] เป็น ReadPostDto[]
    const posts = await this.postRepo.find({ relations: ['comments', 'user'] });
    return posts.map((post) => this.mapToReadPostDto(post)); // map ไปยัง ReadPostDto
  }

  async delete(id: string): Promise<void> {
    await this.postRepo.delete(id);
  }

  async getPostFromUserId(userId: string): Promise<Post[]> {
    return this.postRepo.find({ where: { user: { id: userId } } });
  }

  public mapToReadPostDto(post: Post): ReadPostDto {
    console.log(post); // ตรวจสอบค่าของ post
    const readPostDto = new ReadPostDto();
    readPostDto.id = post.id;
    readPostDto.title = post.title;
    readPostDto.content = post.content;
    readPostDto.username = post.user ? post.user.username : null;
    readPostDto.category = post.category;
    readPostDto.updated_at = post.updated_at;
    readPostDto.comments = post.comments;
    return readPostDto;
  }
}
