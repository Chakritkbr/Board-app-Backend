// comment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto & { postId: string; userId: string },
  ): Promise<Comment> {
    const comment = this.commentRepo.create({
      content: createCommentDto.content,
      post: { id: createCommentDto.postId }, // เชื่อมโยงกับโพสต์
      user: { id: createCommentDto.userId }, // เชื่อมโยงกับผู้ใช้
    });
    return this.commentRepo.save(comment);
  }

  async findAllByPostId(postId: string): Promise<Comment[]> {
    return await this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['user', 'post'],
    });
  }
}
