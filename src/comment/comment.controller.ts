// comment.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

import { Comment } from './entities/comment.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('postId') postId: string, // รับ postId จาก param
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ): Promise<Comment> {
    const userId = req.user.userId; // ดึง userId ที่ได้จาก token
    return this.commentService.create({
      ...createCommentDto,
      postId,
      userId,
    });
  }

  @Get(':postId')
  findAllByPostId(@Param('postId') postId: string): Promise<Comment[]> {
    return this.commentService.findAllByPostId(postId);
  }
}
