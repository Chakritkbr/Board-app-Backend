import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsUUID } from 'class-validator';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ unique: true })
  username: string;

  @OneToMany(() => Comment, (comment) => comment.user) // ความสัมพันธ์กับ Comment
  comments: Comment[]; // Array ของ Comment

  @OneToMany(() => Post, (post) => post.user) // ความสัมพันธ์กับ Post
  posts: Post[]; // Array ของ Post
}
