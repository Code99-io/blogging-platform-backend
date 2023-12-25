import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';

import { BlogEntity } from '../blog/blog.entity';
import { UserEntity } from '../user/user.entity';

@Entity('drafts')
export class DraftEntity {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => BlogEntity, (blog) => blog.id, { onDelete: 'CASCADE' })
  blog: BlogEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  createdBy: UserEntity;
}
