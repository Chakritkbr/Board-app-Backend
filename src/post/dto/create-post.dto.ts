import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { PostCategory } from '../entities/post.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Title should not be empty' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content should not be empty' })
  content: string;

  @IsEnum(PostCategory)
  @IsOptional()
  category?: PostCategory = PostCategory.Others;
}
