import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';

import { BlogEntity } from '../blog/blog.entity';
import { TagEntity } from '../tag/tag.entity';

@Entity('blog_tags')
export class BlogTagEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => BlogEntity, (blog) => blog.id, { onDelete: 'CASCADE' })
  blog: BlogEntity;

  @ManyToOne(() => TagEntity, (tag) => tag.id, { onDelete: 'CASCADE' })
  tag: TagEntity;
}
