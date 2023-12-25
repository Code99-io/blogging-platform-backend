import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeEntity } from './like.entity';
import { LikeRepository } from './like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity])],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository],
  exports: [LikeService],
})
export class LikeModule {}
