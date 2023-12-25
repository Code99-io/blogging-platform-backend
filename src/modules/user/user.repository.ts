// user.repository.ts
import { DataSource, FindOptionsSelect, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }
  // Add custom query methods for user management
  // Add custom repository methods here
  async findById(
    id: number,
    select?: FindOptionsSelect<UserEntity>,
  ): Promise<UserEntity> {
    return await this.findOne({
      where: { id },
      select,
    });
  }
}
