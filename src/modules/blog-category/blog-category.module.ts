import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryEntity } from './blog-category.entity';
import { BlogCategoryRepository } from './blog-category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogCategoryEntity])],
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService, BlogCategoryRepository],
  exports: [BlogCategoryService],
})
export class BlogCategoryModule {}
