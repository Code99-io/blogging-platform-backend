import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogEntity } from './blog.entity';
import { BlogRepository } from './blog.repository';
import { BlogCategoryModule } from 'src/modules/blog-category/blog-category.module';
import { BlogTagModule } from 'src/modules/blog-tag/blog-tag.module';
import { DraftModule } from 'src/modules/draft/draft.module';
import { CommentModule } from 'src/modules/comment/comment.module';
import { LikeModule } from 'src/modules/like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),
    BlogCategoryModule,
    BlogTagModule,
    DraftModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
  exports: [BlogService],
})
export class BlogModule {}
