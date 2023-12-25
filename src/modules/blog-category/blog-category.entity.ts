import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';

import { BlogEntity } from '../blog/blog.entity';
import { CategoryEntity } from '../category/category.entity';

@Entity('blog_categories')
export class BlogCategoryEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => BlogEntity, (blog) => blog.id, { onDelete: 'CASCADE' })
  blog: BlogEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.id, {
    onDelete: 'CASCADE',
  })
  category: CategoryEntity;
}
