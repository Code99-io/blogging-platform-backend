import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftService } from './draft.service';
import { DraftController } from './draft.controller';
import { DraftEntity } from './draft.entity';
import { DraftRepository } from './draft.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DraftEntity])],
  controllers: [DraftController],
  providers: [DraftService, DraftRepository],
  exports: [DraftService],
})
export class DraftModule {}
