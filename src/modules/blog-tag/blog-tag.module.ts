import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogTagService } from './blog-tag.service';
import { BlogTagController } from './blog-tag.controller';
import { BlogTagEntity } from './blog-tag.entity';
import { BlogTagRepository } from './blog-tag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogTagEntity])],
  controllers: [BlogTagController],
  providers: [BlogTagService, BlogTagRepository],
  exports: [BlogTagService],
})
export class BlogTagModule {}
