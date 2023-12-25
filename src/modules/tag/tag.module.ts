import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagEntity } from './tag.entity';
import { TagRepository } from './tag.repository';
import { BlogTagModule } from 'src/modules/blog-tag/blog-tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), BlogTagModule],
  controllers: [TagController],
  providers: [TagService, TagRepository],
  exports: [TagService],
})
export class TagModule {}
