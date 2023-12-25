import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';

import { BlogEntity } from '../blog/blog.entity';
import { UserEntity } from '../user/user.entity';

@Entity('likes')
export class LikeEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => BlogEntity, (blog) => blog.id, { onDelete: 'CASCADE' })
  blog: BlogEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;
}
