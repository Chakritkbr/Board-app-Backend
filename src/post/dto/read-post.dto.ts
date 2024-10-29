import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
  IsInt,
} from 'class-validator';
import { PostCategory } from '../entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';

export class ReadPostDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  username: string; // เพิ่ม ID ของผู้ใช้ที่สร้างโพสต์

  @IsEnum(PostCategory)
  @IsOptional()
  category?: PostCategory = PostCategory.Others;

  @IsOptional()
  @IsDate()
  updated_at?: Date; // เพิ่มฟิลด์เวลาที่อัปเดตล่าสุด

  @IsOptional()
  comments?: Comment[];
}
