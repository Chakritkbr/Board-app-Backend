import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';

export enum PostCategory {
  History = 'History',
  Food = 'Food',
  Pets = 'Pets',
  Health = 'Health',
  Fashion = 'Fashion',
  Exercise = 'Exercise',
  Others = 'Others',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid') // เปลี่ยนให้เป็น uuid
  @IsUUID()
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: PostCategory, default: PostCategory.Others })
  category: PostCategory;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' }) // ใช้ user.posts
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post) // ความสัมพันธ์กับ Comment
  comments: Comment[]; // Array ของ Comment
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
