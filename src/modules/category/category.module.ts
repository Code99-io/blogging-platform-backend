import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './category.entity';
import { CategoryRepository } from './category.repository';
import { BlogCategoryModule } from 'src/modules/blog-category/blog-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), BlogCategoryModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
